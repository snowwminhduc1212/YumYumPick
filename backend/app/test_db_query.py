import sys
from sqlalchemy import select, func
from app.db.database import SessionLocal
from app.models.models import Dish, Cuisine, Ingredient, CookingStep, User, UserSavedDish
from app.schemas.dish import DishCardResponse, DishDetailResponse

def run_verification():
    # Ensure stdout handles utf-8 on Windows
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    db = SessionLocal()
    try:
        # 1. Check table counts using SQLAlchemy 2.0 select() style
        dish_count = db.scalar(select(func.count()).select_from(Dish))
        cuisine_count = db.scalar(select(func.count()).select_from(Cuisine))
        ingredient_count = db.scalar(select(func.count()).select_from(Ingredient))
        step_count = db.scalar(select(func.count()).select_from(CookingStep))
        user_count = db.scalar(select(func.count()).select_from(User))
        saved_count = db.scalar(select(func.count()).select_from(UserSavedDish))

        print("=== 1. DATABASE RECORD COUNTS (SQLAlchemy 2.0 style) ===")
        print(f"Dishes: {dish_count}")
        print(f"Cuisines: {cuisine_count}")
        print(f"Ingredients: {ingredient_count}")
        print(f"Cooking Steps: {step_count}")
        print(f"Users: {user_count}")
        print(f"Saved Dishes: {saved_count}")

        assert dish_count == 100, f"Expected 100 dishes, found {dish_count}"
        assert cuisine_count == 5, f"Expected 5 cuisines, found {cuisine_count}"
        assert ingredient_count > 0, "No ingredients found"
        assert step_count > 0, "No cooking steps found"

        # 2. Test Single Dish & Relationships using db.scalar(select(Dish))
        dish = db.scalar(select(Dish))
        assert dish is not None, "Failed to fetch first dish"
        print(f"\n=== 2. DETAIL OF FIRST DISH ({dish.id}) ===")
        print(f"Name: {dish.name} ({dish.english_name})")
        print(f"Cuisine (matches dishes_seed.json): {dish.cuisine} (synonym cuisine_id: {dish.cuisine_id})")
        print(f"Cuisine Info: {dish.cuisine_rel.name} {dish.cuisine_rel.flag_emoji}")
        print(f"Short Description: {dish.short_description}")
        print(f"Cook Time: {dish.cook_time_minutes}m, Spicy Level: {dish.spicy_level}, Cal: {dish.calories_approx}")
        print(f"Ingredients ({len(dish.ingredients)}): {[ing.name for ing in dish.ingredients[:3]]}...")
        print(f"Steps ({len(dish.cooking_steps)}): {[s.title for s in dish.cooking_steps]}")

        # 3. Test Pydantic Serialization
        card = DishCardResponse(
            id=dish.id,
            name=dish.name,
            english_name=dish.english_name,
            cuisine=dish.cuisine,
            cook_time_minutes=dish.cook_time_minutes,
            spicy_level=dish.spicy_level,
            calories_approx=dish.calories_approx,
            image=dish.image,
            short_description=dish.short_description,
        )
        print("\n=== 3. PYDANTIC CARD SERIALIZATION ===")
        print(card.model_dump_json(indent=2))

        detail = DishDetailResponse(
            id=dish.id,
            name=dish.name,
            english_name=dish.english_name,
            cuisine=dish.cuisine,
            region=dish.region,
            cook_time_minutes=dish.cook_time_minutes,
            prep_time_minutes=dish.prep_time_minutes,
            difficulty=dish.difficulty,
            spicy_level=dish.spicy_level,
            calories_approx=dish.calories_approx,
            image=dish.image,
            short_description=dish.short_description,
            tips=dish.tips,
            ingredients=[
                {"name": ing.name, "amount": ing.amount, "unit": ing.unit, "category": ing.category}
                for ing in dish.ingredients
            ],
            steps=[
                {"step_number": stp.step_number, "title": stp.title, "description": stp.description}
                for stp in dish.cooking_steps
            ],
        )
        print("\n=== 4. PYDANTIC DETAIL SERIALIZATION ===")
        print(f"Detail serialized with {len(detail.ingredients)} ingredients and {len(detail.steps)} steps.")
        assert len(detail.steps) == len(dish.cooking_steps), f"Expected {len(dish.cooking_steps)} steps, found {len(detail.steps)}"

        # 4. Test Random Query with Limit 10 (SQLAlchemy 2.0 select + scalars)
        query = select(Dish).order_by(func.random()).limit(10)
        random_dishes = list(db.scalars(query).all())
        print(f"\n=== 5. RANDOM BATCH OF 10 DISHES (SQLAlchemy 2.0 select) ===")
        for idx, d in enumerate(random_dishes, 1):
            print(f"{idx}. [{d.cuisine}] {d.name} ({d.id})")

        print("\n>>> ALL SQLALCHEMY 2.0 TESTS PASSED SUCCESSFULLY! <<<")

    finally:
        db.close()

if __name__ == "__main__":
    run_verification()
