import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.auth import router as auth_router

#Khởi tạo ứng dụng
app = FastAPI(
    title="YumYumPick API",
    description="Tinder for Food - Backend",
    version="1.0.0"
)

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)

#Cấu hình đường dẫn ảnh (Static Files)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGES_DIR = os.path.join(BASE_DIR,"images")

import sys
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app.api.dishes import router as dishes_router
from app.api.saved_dishes import router as saved_dishes_router

# Đăng ký Routers
app.include_router(dishes_router, prefix="/api/v1/dishes", tags=["Dishes"])
app.include_router(saved_dishes_router, prefix="/api/v1/saved-dishes", tags=["Saved Dishes"])

app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
@app.get("/")
def health_check():
    return{"status":"ok","message":"Backend is running"}

class CachedStaticFiles(StaticFiles):
    def is_not_modified(self, response_headers, request_headers) -> bool:
        return super().is_not_modified(response_headers, request_headers)

    async def get_response(self, path: str, scope):
        response = await super().get_response(path, scope)

        response.headers["Cache-Control"] = "public, max-age=86400"
        return response

if os.path.exists(IMAGES_DIR):
    app.mount("/images", CachedStaticFiles(directory=IMAGES_DIR), name="images")