"""
Crawler for Authentic Food Dish Photography
Strictly excludes AI art, 3D renders, vector illustrations, and stock photo repositories.
Fetches high-quality real camera food photos from food blogs, cooking sites, and video stills.
"""

import os
import sys
import json
import time
import argparse
import sqlite3
import re
import urllib.parse
import requests
from io import BytesIO
from PIL import Image
from ddgs import DDGS
from concurrent.futures import ThreadPoolExecutor, as_completed

from config import (
    DB_PATH, IMG_DIR, SEED_JSON_PATH, FRONTEND_MOCK_PATH, PROGRESS_FILE,
    BANNED_WORDS, AI_FARM_REGEX, FAMOUS_LEGIT_DOMAINS
)

SESSION = requests.Session()
SESSION.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
})

def is_clean_candidate(url, title):
    """Check if candidate URL and title are clean from AI and stock."""
    if not url:
        return False
    url_l = url.lower()
    title_l = title.lower()

    # Banned keywords in URL
    for b in BANNED_WORDS:
        if b in url_l:
            return False

    # Negative prompt words in title
    for t in ['ai generated', 'ai art', 'vector', 'illustration', '3d render',
              'stock photo', 'midjourney', 'drawing', 'clipart', 'concept art']:
        if t in title_l:
            return False

    netloc = urllib.parse.urlparse(url).netloc.lower().replace('www.', '')

    # Known famous legit blogs are always accepted
    if any(legit in netloc for legit in FAMOUS_LEGIT_DOMAINS):
        return True

    # Generic AI recipe blog spam check
    if re.search(r'recipe(s)?\.(com|net|org|co)$', netloc) or AI_FARM_REGEX.search(netloc):
        return False

    # Midjourney / AI hash patterns
    if re.search(r'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}', url_l):
        return False

    return True

def download_and_verify_image(url, out_path, min_dim=250, min_bytes=15000):
    """Download image, verify format and size, save as optimized JPEG."""
    try:
        resp = SESSION.get(url, timeout=12)
        if resp.status_code != 200 or len(resp.content) < min_bytes:
            return False, f"HTTP {resp.status_code} or small size ({len(resp.content)}B)"
        img = Image.open(BytesIO(resp.content))
        if img.width < min_dim or img.height < min_dim:
            return False, f"Dimensions too small: {img.width}x{img.height}"
        if img.mode != 'RGB':
            img = img.convert('RGB')
        img.save(out_path, format='JPEG', quality=90)
        return True, "OK"
    except Exception as e:
        return False, str(e)

def find_authentic_photo(ddgs, name, english_name, cuisine_id):
    """Search for authentic food photography using targeted queries."""
    is_viet = (cuisine_id == 'Vietnam')
    if is_viet:
        queries = [
            f'"{name}" cách làm món ăn',
            f'"{name}" món ăn ẩm thực',
            f'"{english_name}" vietnamese authentic food',
            f'"{name}" cách làm video'
        ]
    else:
        queries = [
            f'"{english_name}" authentic recipe dish',
            f'"{english_name}" food dish recipe',
            f'"{name}" món ăn ngon',
            f'"{english_name}" recipe authentic youtube'
        ]

    for q in queries:
        try:
            results = list(ddgs.images(q, max_results=8))
            for r in results:
                img_url = r.get('image', '')
                title = r.get('title', '')
                if is_clean_candidate(img_url, title):
                    return img_url, title
            time.sleep(0.3)
        except Exception:
            time.sleep(0.5)
            continue
    return None, None

def process_dish(item):
    """Worker task to process a single dish."""
    did, name, eng, cuisine = item
    out_file = os.path.join(IMG_DIR, f"{did}.jpg")
    ddgs = DDGS()

    img_url, title = find_authentic_photo(ddgs, name, eng, cuisine)
    if not img_url:
        return did, False, "No valid clean candidate found", None

    ok, msg = download_and_verify_image(img_url, out_file)
    if ok:
        return did, True, img_url, title
    else:
        # Fallback to YouTube cooking thumbnail
        try:
            yt_res = list(ddgs.images(f'{name} cooking youtube', max_results=5))
            for r in yt_res:
                u = r.get('image', '')
                if 'ytimg.com' in u:
                    ok_yt, _ = download_and_verify_image(u, out_file)
                    if ok_yt:
                        return did, True, u, r.get('title', '')
        except Exception:
            pass
        return did, False, f"Download failed: {msg}", None

def sync_data(conn):
    """Synchronize database records into seed JSON and frontend mockDishes.js."""
    print("\n--- Synchronizing Data ---")
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute('SELECT * FROM dishes ORDER BY id')
    rows = [dict(r) for r in c.fetchall()]

    with open(SEED_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(rows, f, ensure_ascii=False, indent=2)
    print(f"Updated {SEED_JSON_PATH} ({len(rows)} dishes)")

    mock_js = "export const MOCK_DISHES = " + json.dumps(rows, ensure_ascii=False, indent=2) + ";\n"
    with open(FRONTEND_MOCK_PATH, 'w', encoding='utf-8') as f:
        f.write(mock_js)
    print(f"Updated {FRONTEND_MOCK_PATH} ({len(rows)} dishes)")

def main():
    parser = argparse.ArgumentParser(description="Authentic Food Dish Image Crawler")
    parser.add_argument('--workers', type=int, default=3, help='Number of worker threads (default: 3)')
    parser.add_argument('--limit', type=int, default=None, help='Limit number of dishes to process')
    parser.add_argument('--dish-id', type=str, default=None, help='Crawl a specific dish by ID')
    parser.add_argument('--force-all', action='store_true', help='Force re-crawling all dishes')
    parser.add_argument('--sync-only', action='store_true', help='Sync database to seed and mock files only')
    args = parser.parse_args()

    os.makedirs(IMG_DIR, exist_ok=True)

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    if args.sync_only:
        sync_data(conn)
        conn.close()
        return

    c.execute('SELECT id, name, english_name, cuisine_id, image_url FROM dishes')
    all_dishes = c.fetchall()

    to_process = []
    for did, name, eng, cuisine, img_url in all_dishes:
        if args.dish_id and did != args.dish_id:
            continue
        out_file = os.path.join(IMG_DIR, f"{did}.jpg")
        file_missing = not os.path.exists(out_file) or os.path.getsize(out_file) < 10000
        url_flagged = not is_clean_candidate(img_url, "")

        if args.force_all or file_missing or url_flagged or (args.dish_id == did):
            to_process.append((did, name, eng, cuisine))

    if args.limit:
        to_process = to_process[:args.limit]

    print(f"Total dishes to process: {len(to_process)}")
    if not to_process:
        print("All dishes are already up-to-date with authentic real photos!")
        sync_data(conn)
        conn.close()
        return

    success_cnt = 0
    fail_cnt = 0
    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = {executor.submit(process_dish, item): item for item in to_process}
        idx = 0
        for future in as_completed(futures):
            idx += 1
            did, ok, info, title = future.result()
            if ok:
                success_cnt += 1
                c.execute('UPDATE dishes SET image_url = ?, image = ? WHERE id = ?',
                          (info, f'/images/dishes/{did}.jpg', did))
                conn.commit()
                print(f"[{idx}/{len(to_process)}] [OK] {did} -> {info[:65]}")
            else:
                fail_cnt += 1
                print(f"[{idx}/{len(to_process)}] [FAIL] {did}: {info}")

    print(f"\nCrawling completed! Success: {success_cnt}, Failed: {fail_cnt}")
    sync_data(conn)
    conn.close()

if __name__ == '__main__':
    main()
