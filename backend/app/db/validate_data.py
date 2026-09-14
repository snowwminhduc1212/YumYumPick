import json
import os
import sys

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

SEED_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "dishes_seed.json"))

VALID_CUISINES = {"Vietnam", "Korea", "Japan", "Thailand", "Italy"}
VALID_SPICY_LEVELS = {0, 1, 2, 3}

def validate_data():
    if not os.path.exists(SEED_FILE):
        print(f"❌ Không tìm thấy file: {SEED_FILE}")
        sys.exit(1)

    with open(SEED_FILE, "r", encoding="utf-8") as f:
        try:
            dishes = json.load(f)
        except json.JSONDecodeError as e:
            print(f"❌ Lỗi định dạng JSON: {e}")
            sys.exit(1)

    print(f"🔍 Đang kiểm tra tính hợp lệ của {len(dishes)} món ăn...\n")

    errors = []
    cuisine_count = {c: 0 for c in VALID_CUISINES}
    spicy_count = {s: 0 for s in VALID_SPICY_LEVELS}
    time_less_20 = 0
    time_20_45 = 0
    time_over_45 = 0
    total_ingredients = 0
    total_steps = 0
    ids_seen = set()

    for idx, d in enumerate(dishes):
        dish_name = d.get("name", f"Dish #{idx}")

        # Kiểm tra ID
        dish_id = d.get("id")
        if not dish_id:
            errors.append(f"Món '{dish_name}' thiếu trường 'id'.")
        elif dish_id in ids_seen:
            errors.append(f"Trùng lặp ID: '{dish_id}' ở món '{dish_name}'.")
        else:
            ids_seen.add(dish_id)

        # Kiểm tra Cuisines
        c = d.get("cuisine")
        if c not in VALID_CUISINES:
            errors.append(f"Món '{dish_name}' có cuisine '{c}' không hợp lệ (Phải là {VALID_CUISINES}).")
        else:
            cuisine_count[c] += 1

        # Kiểm tra Image URL
        img = d.get("image", "")
        if not img or not img.startswith("http"):
            errors.append(f"Món '{dish_name}' có link ảnh không hợp lệ: '{img}'.")

        # Kiểm tra Thời gian nấu
        t = d.get("cook_time_minutes")
        if not isinstance(t, int) or t <= 0:
            errors.append(f"Món '{dish_name}' có cook_time_minutes không hợp lệ: {t}.")
        else:
            if t <= 20:
                time_less_20 += 1
            elif t <= 45:
                time_20_45 += 1
            else:
                time_over_45 += 1

        # Kiểm tra Độ cay
        s = d.get("spicy_level")
        if s not in VALID_SPICY_LEVELS:
            errors.append(f"Món '{dish_name}' có spicy_level '{s}' không nằm trong khoảng 0-3.")
        else:
            spicy_count[s] += 1

        # Kiểm tra Mô tả ngắn
        desc = d.get("short_description")
        if not desc or len(desc.strip()) < 10:
            errors.append(f"Món '{dish_name}' thiếu short_description hoặc quá ngắn.")

        # Kiểm tra Mẹo đầu bếp
        tips = d.get("tips")
        if not tips:
            errors.append(f"Món '{dish_name}' thiếu trường tips (mẹo đầu bếp).")

        # Kiểm tra Nguyên liệu
        ings = d.get("ingredients", [])
        if not ings or len(ings) < 2:
            errors.append(f"Món '{dish_name}' có quá ít nguyên liệu ({len(ings)}).")
        for i_idx, ing in enumerate(ings):
            total_ingredients += 1
            if not ing.get("name") or not ing.get("amount") or not ing.get("unit"):
                errors.append(f"Món '{dish_name}' có nguyên liệu #{i_idx+1} thiếu name, amount hoặc unit.")

        # Kiểm tra Bước nấu
        steps = d.get("steps", [])
        if not steps or len(steps) < 2:
            errors.append(f"Món '{dish_name}' có quá ít bước nấu ({len(steps)}).")
        for s_idx, st in enumerate(steps):
            total_steps += 1
            if not st.get("title") or not st.get("description"):
                errors.append(f"Món '{dish_name}' có bước nấu #{s_idx+1} thiếu title hoặc description.")

    # In kết quả
    if errors:
        print(f"❌ PHÁT HIỆN {len(errors)} LỖI DỮ LIỆU:")
        for err in errors[:10]:
            print(f"  - {err}")
        if len(errors) > 10:
            print(f"  ... và {len(errors)-10} lỗi khác.")
        sys.exit(1)
    else:
        print("✅ TẤT CẢ DỮ LIỆU HOÀN HẢO! KHÔNG CÓ LỖI NÀO.")

    print("\n📊 BÁO CÁO THỐNG KÊ DỮ LIỆU (DATA AUDIT SUMMARY):")
    print("--------------------------------------------------")
    print(f"• Tổng số món ăn:             {len(dishes)} món")
    print(f"• Tổng số nguyên liệu chi tiết: {total_ingredients} nguyên liệu (Trung bình {total_ingredients/len(dishes):.1f} món)")
    print(f"• Tổng số bước nấu ăn 1-2-3:    {total_steps} bước (Trung bình {total_steps/len(dishes):.1f} bước/món)")
    print("\n🌍 Phân bố theo Quốc Gia / Ẩm thực:")
    for c, count in cuisine_count.items():
        print(f"  - {c:12}: {count:2} món ({count/len(dishes)*100:.1f}%)")
    print("\n⏱️ Phân bố theo Thời Gian Chế Biến:")
    print(f"  - Dưới 20 phút (Nấu nhanh) : {time_less_20:2} món")
    print(f"  - Từ 20 - 45 phút (Vừa phải): {time_20_45:2} món")
    print(f"  - Trên 45 phút (Kỳ công)   : {time_over_45:2} món")
    print("\n🌶️ Phân bố theo Mức Độ Cay:")
    print(f"  - Cấp 0 (Không cay)  : {spicy_count[0]:2} món")
    print(f"  - Cấp 1 (Cay nhẹ)    : {spicy_count[1]:2} món")
    print(f"  - Cấp 2 (Cay vừa)    : {spicy_count[2]:2} món")
    print(f"  - Cấp 3 (Cay nồng)   : {spicy_count[3]:2} món")
    print("--------------------------------------------------\n")

if __name__ == "__main__":
    validate_data()
