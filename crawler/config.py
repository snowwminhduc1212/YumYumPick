import os
import re

# Base paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, 'backend', 'yumyumpick.db')
IMG_DIR = os.path.join(BASE_DIR, 'backend', 'images', 'dishes')
SEED_JSON_PATH = os.path.join(BASE_DIR, 'backend', 'app', 'data', 'dishes_seed.json')
FRONTEND_MOCK_PATH = os.path.join(BASE_DIR, 'frontend', 'src', 'data', 'mockDishes.js')
PROGRESS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'crawler_progress.json')

# Strict ban list: stock photo websites, AI generator domains, video thumbnails, and non-food retailers
BANNED_WORDS = [
    'freepik', 'vecteezy', 'ftcdn', 'dreamstime', 'alamy', 'shutterstock',
    'istock', 'stock.adobe', 'depositphotos', '123rf', 'pinimg',
    'pinterest', 'canva', 'rawpixel', 'envato', 'getty', 'lookstudio',
    'wirestock', 'artstation', 'deviantart', 'cookai', 'homecookai', 'midjourney',
    'dall-e', 'dalle', 'stable-diffusion', 'stablediffusion', 'craiyon',
    'leonardo', 'civitai', 'koala.sh', 'dream',
    'generative', 'ai-generated', 'render', 'illustration', 'stock',
    'pexels', 'pixabay', 'unsplash', 'clipart', 'vector', 'transparent-png',
    'cleanpng', 'pngwing', 'pngtree', 'kissclipart',
    'tgdd.vn', 'fptshop.com.vn', 'dienmayxanh.com', 'bachhoaxanh.com',
    'tiki.vn', 'shopee.vn', 'lazada.vn', 'sendo.vn',
    'imimg.com', 'indiamart.com', 'alibaba', 'aliexpress',
    'ytimg.com', 'youtube.com', 'wallpaper', 'shutterphoto', 'twinkl', 'lecongnang'
]

# Patterns for automated AI recipe content farms
AI_FARM_REGEX = re.compile(
    r'(recipesby[a-z]+|'
    r'mealsby[a-z]+|'
    r'cookingwith[a-z]+|'
    r'cookai|homecookai|'
    r'bakesby[a-z]+|'
    r'foodie-haven|'
    r'dishrise|'
    r'easykitchenly|'
    r'delectablemeal|'
    r'snackablejoy|'
    r'hilltoprecipes|'
    r'tastytango|'
    r'blesseddish|'
    r'homeydishes|'
    r'teresasrecipes|'
    r'bakedtales|'
    r'leyarecipes|'
    r'grammyrecipes|'
    r'claricerecipes|'
    r'jessicarecipes|'
    r'vibestimes|'
    r'grannyeats|'
    r'sweetbananachef|'
    r'quickmealrecipe|'
    r'whaleycooks|'
    r'cookbreeze|'
    r'dishiary)',
    re.IGNORECASE
)

# Known authentic food & recipe websites
FAMOUS_LEGIT_DOMAINS = [
    'recipetineats.com', 'allrecipes.com', 'simplyrecipes.com', 'tasteofhome.com',
    'seriouseats.com', 'epicurious.com', 'bonappetit.com', 'bbcgoodfood.com',
    'taste.com.au', 'justonecookbook.com', 'koreanbapsang.com', 'thewoksoflife.com',
    'maangchi.com', 'beyondkimchee.com', 'marionskitchen.com', 'recipesfromitaly.com',
    'sallysbakingaddiction.com', 'delish.com', 'foodnetwork.com', 'tasteatlas.com',
    'cooking.nytimes.com', 'saveur.com', 'foodandwine.com', 'bepmina.vn',
    'vinpearl.com', 'vinwonders.com', 'dulichviet.com.vn', 'cookpad.com',
    'wikimedia.org', 'wikipedia.org', 'netspace.edu.vn', 'daubepgiadinh.vn',
    'cookidoo', 'thespruceeats.com', 'damndelicious.net', 'gimmesomeoven.com',
    'tamlong.com.vn', 'mia.vn', 'nucuoimekong.com', 'dimitrasdishes.com',
    'mygreekdish.com', 'bestyumrecipes.com', 'hungryhuy.com', 'omnivorescookbook.com',
    'hot-thai-kitchen.com', 'eatingthai.com', 'mexicanplease.com', 'spainonafork.com',
    'indianhealthyrecipes.com', 'vegrecipesofindia.com', 'tastingtable.com'
]
