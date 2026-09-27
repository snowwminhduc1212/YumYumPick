"""
Native Culinary Recipe Crawler & Curator for YumYumPick
Searches authentic culinary sites in the country's native language,
extracts real ingredient lists, authentic cooking steps, and chef tips,
and standardizes them into YumYumPick's database schema.
"""

import os
import sys
import json
import time
import re
import sqlite3
import argparse
from ddgs import DDGS

from config import DB_PATH, SEED_JSON_PATH, FRONTEND_MOCK_PATH

# Language and native query keywords mapped by cuisine
CUISINE_NATIVE_SEARCH = {
    'Vietnam': {
        'lang': 'vi',
        'query_template': '"{name}" công thức nguyên liệu cách làm',
        'sites': ['dienmayxanh.com/vao-bep', 'bepmina.vn', 'cookpad.com/vn', 'monngonmoingay.com']
    },
    'Korea': {
        'lang': 'ko',
        'query_template': '"{name}" "{english_name}" 레시피 재료 만드는 법',
        'sites': ['10000recipe.com', 'blog.naver.com', 'maangchi.com', 'koreanbapsang.com']
    },
    'Japan': {
        'lang': 'ja',
        'query_template': '"{english_name}" レシピ 作り方 材料',
        'sites': ['sirogohan.com', 'cookpad.com', 'park.ajinomoto.co.jp', 'justonecookbook.com']
    },
    'Italy': {
        'lang': 'it',
        'query_template': '"{english_name}" ricetta originale ingredienti preparazione',
        'sites': ['giallozafferano.it', 'buonissimo.it', 'lacucinaitaliana.it', 'recipesfromitaly.com']
    },
    'China': {
        'lang': 'zh',
        'query_template': '"{name}" "{english_name}" 正宗做法 配料 步骤',
        'sites': ['xiachufang.com', 'meishij.net', 'thewoksoflife.com']
    },
    'Thailand': {
        'lang': 'th',
        'query_template': '"{english_name}" สูตรอาหาร วัตถุดิบ วิธีทำ',
        'sites': ['wongnai.com/recipes', 'cookpad.com/th', 'marionskitchen.com']
    },
    'France': {
        'lang': 'fr',
        'query_template': '"{english_name}" recette traditionnelle ingrédients étapes',
        'sites': ['marmiton.org', 'cuisineaz.com', '750g.com']
    },
    'Spain': {
        'lang': 'es',
        'query_template': '"{english_name}" receta tradicional española ingredientes',
        'sites': ['directoalpaladar.com', 'recetasgratis.net']
    },
    'Mexico': {
        'lang': 'es',
        'query_template': '"{english_name}" receta tradicional mexicana ingredientes',
        'sites': ['kiwilimon.com', 'mexicoenmicocina.com', 'mexicoinmykitchen.com']
    },
    'Germany': {
        'lang': 'de',
        'query_template': '"{english_name}" Rezept traditionell Zutaten Zubereitung',
        'sites': ['chefkoch.de', 'eatsmarter.de', 'germangirlinamerica.com']
    },
    'Greece': {
        'lang': 'el',
        'query_template': '"{english_name}" συνταγή παραδοσιακή υλικά εκτέλεση',
        'sites': ['akispetretzikis.com', 'argiro.gr', 'dimitrasdishes.com']
    },
    'Turkey': {
        'lang': 'tr',
        'query_template': '"{english_name}" geleneksel tarifi malzemeler yapılışı',
        'sites': ['nefisyemektarifleri.com', 'yemek.com']
    },
    'India': {
        'lang': 'en',
        'query_template': '"{english_name}" authentic recipe ingredients step by step instructions',
        'sites': ['vegrecipesofindia.com', 'indianhealthyrecipes.com', 'hebbarskitchen.com']
    },
    'USA': {
        'lang': 'en',
        'query_template': '"{english_name}" traditional authentic recipe ingredients instructions',
        'sites': ['allrecipes.com', 'seriouseats.com', 'foodnetwork.com', 'tasteofhome.com']
    },
    'Southeast Asia': {
        'lang': 'en',
        'query_template': '"{english_name}" authentic recipe ingredients method',
        'sites': ['rasamalaysia.com', 'nyonyacooking.com', 'recipetineats.com']
    }
}

def search_native_recipe(ddgs, name, english_name, cuisine_id):
    """Search for authentic native recipe details."""
    cfg = CUISINE_NATIVE_SEARCH.get(cuisine_id, {
        'query_template': '"{english_name}" authentic recipe ingredients instructions',
        'sites': []
    })
    
    query = cfg['query_template'].format(name=name, english_name=english_name or name)
    try:
        results = list(ddgs.text(query, max_results=3))
        return results
    except Exception as e:
        print(f"  [Search error] {e}")
        return []

def main():
    parser = argparse.ArgumentParser(description="Native Culinary Recipe Finder & Curator")
    parser.add_argument('--dish-id', type=str, help='Crawl and update recipe for a specific dish ID')
    parser.add_argument('--cuisine', type=str, help='Filter by cuisine (e.g. Vietnam, Italy, Japan)')
    parser.add_argument('--limit', type=int, default=5, help='Number of dishes to test or update')
    parser.add_argument('--dry-run', action='store_true', help='Search and display without writing to DB')
    args = parser.parse_args()

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    query = "SELECT id, name, english_name, cuisine_id, cook_time_minutes FROM dishes WHERE 1=1"
    params = []
    if args.dish_id:
        query += " AND id = ?"
        params.append(args.dish_id)
    if args.cuisine:
        query += " AND cuisine_id = ?"
        params.append(args.cuisine)
    query += " ORDER BY id"
    if args.limit:
        query += f" LIMIT {args.limit}"

    c.execute(query, params)
    dishes = c.fetchall()

    print(f"Found {len(dishes)} dishes to inspect/update:")
    ddgs = DDGS()

    for did, name, eng, cuis, ctime in dishes:
        print(f"\n=======================================================")
        print(f"Dish: [{did}] {name} ({eng}) - {cuis} (Cook time: {ctime}m)")
        results = search_native_recipe(ddgs, name, eng, cuis)
        if results:
            for idx, r in enumerate(results[:2], 1):
                print(f"  Result {idx}: {r.get('title')}")
                print(f"  URL: {r.get('href')}")
                print(f"  Snippet: {r.get('body')[:160]}...\n")
        else:
            print("  No search results found.")
        time.sleep(0.5)

    conn.close()

if __name__ == '__main__':
    main()
