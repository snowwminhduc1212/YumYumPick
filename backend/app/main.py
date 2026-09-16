import os
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse

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

# Mount thư mục images vào url '/images'
if os.path.exists(IMAGES_DIR):
    app.mount("/images",StaticFiles(directory=IMAGES_DIR), name="images")

@app.get("/")
def health_check():
    return{"status":"ok","message":"Backend is running"}

@app.get("/api/v1/mock/dishes")
def get_mock_dishes():
    """
    API cung cấp Mock Data (Dữ liệu giả lập) cho Frontend làm giao diện Ngày 1.
    Đọc thẳng từ file dishes_seed.json và trả về.
    """
    file_path = os.path.join(BASE_DIR, "app", "data", "dishes_seed.json")

    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    return JSONResponse(content=data)