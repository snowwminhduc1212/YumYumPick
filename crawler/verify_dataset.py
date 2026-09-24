"""
Verification & Audit Tool for YumYumPick Dish Dataset
Checks image files, hash uniqueness, database consistency, and filters for AI/stock leaks.
"""

import os
import sys
import sqlite3
import hashlib
import json
from collections import Counter
from urllib.parse import urlparse

from config import (
    DB_PATH, IMG_DIR, SEED_JSON_PATH, FRONTEND_MOCK_PATH,
    BANNED_WORDS, FAMOUS_LEGIT_DOMAINS
)

def run_audit():
    print("=" * 60)
    print("      YUMYUMPICK DATASET & IMAGE AUDIT REPORT      ")
    print("=" * 60)

    # 1. Database Check
    if not os.path.exists(DB_PATH):
        print(f"[ERROR] Database file not found: {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('SELECT id, name, cuisine_id, image, image_url FROM dishes')
    dishes = c.fetchall()
    total_db = len(dishes)
    print(f"Total dishes in Database: {total_db}")

    # 2. Local Image Files Check
    if not os.path.exists(IMG_DIR):
        print(f"[ERROR] Image directory not found: {IMG_DIR}")
        return

    files = [f for f in os.listdir(IMG_DIR) if f.endswith('.jpg')]
    print(f"Total JPG image files on disk: {len(files)}")

    missing_files = []
    file_sizes = []
    hashes = {}

    for did, name, cuisine, img_field, url in dishes:
        expected_path = os.path.join(IMG_DIR, f"{did}.jpg")
        if not os.path.exists(expected_path):
            missing_files.append((did, "missing"))
            continue
        sz = os.path.getsize(expected_path)
        file_sizes.append(sz)
        if sz < 10000:
            missing_files.append((did, f"corrupt/too small ({sz} bytes)"))
            continue
        with open(expected_path, 'rb') as fp:
            h = hashlib.md5(fp.read()).hexdigest()
            hashes[h] = hashes.get(h, 0) + 1

    print(f"Valid image files matching DB: {len(file_sizes)} / {total_db}")
    if missing_files:
        print(f"[WARNING] Missing or corrupt files ({len(missing_files)}): {missing_files[:5]}...")
    else:
        print("All dishes have valid local image files on disk.")

    unique_hashes = len(hashes)
    print(f"Unique image hashes: {unique_hashes} / {len(file_sizes)} ({unique_hashes/len(file_sizes)*100:.1f}%)")

    if file_sizes:
        print(f"Image sizes: Min = {min(file_sizes)/1024:.1f} KB, Max = {max(file_sizes)/(1024*1024):.1f} MB, Avg = {sum(file_sizes)/len(file_sizes)/1024:.1f} KB")

    # 3. Source Domain & AI/Stock Check
    flagged_urls = []
    domains = Counter()
    for did, name, cuisine, img_field, url in dishes:
        if not url:
            flagged_urls.append((did, "no_url"))
            continue
        url_l = url.lower()
        for b in BANNED_WORDS:
            if b in url_l:
                flagged_urls.append((did, f"banned_keyword:{b}"))
                break
        dom = urlparse(url).netloc.lower().replace('www.', '')
        domains[dom] += 1

    print(f"Total AI/Stock flagged source URLs: {len(flagged_urls)}")
    if flagged_urls:
        print(f"[WARNING] Flagged dishes: {flagged_urls[:5]}")
    else:
        print("Zero stock repositories or AI art generators detected.")

    print(f"\nTop 10 Authentic Source Domains:")
    for d, cnt in domains.most_common(10):
        print(f"  - {d}: {cnt} dishes")

    # 4. Sync verification
    if os.path.exists(SEED_JSON_PATH):
        with open(SEED_JSON_PATH, 'r', encoding='utf-8') as f:
            seed_count = len(json.load(f))
        print(f"\nSeed JSON count: {seed_count} dishes")
    else:
        print(f"\n[WARNING] Seed JSON missing at {SEED_JSON_PATH}")

    print("=" * 60)

if __name__ == '__main__':
    run_audit()
