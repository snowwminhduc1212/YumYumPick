from datetime import datetime
from typing import List, Optional
from sqlalchemy import (
    String,
    Integer,
    DateTime,
    ForeignKey,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship, synonym

from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String, unique=True, nullable=False, index=True)
    password: Mapped[str] = mapped_column(String, nullable=False)
    full_name: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[Optional[datetime]] = mapped_column(DateTime, server_default=func.now())

    # Relationships
    saved_dishes: Mapped[List["UserSavedDish"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
    )


class Cuisine(Base):
    __tablename__ = "cuisines"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    flag_emoji: Mapped[str] = mapped_column(String, nullable=False)

    # Relationships
    dishes: Mapped[List["Dish"]] = relationship(back_populates="cuisine_rel")


class Dish(Base):
    __tablename__ = "dishes"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    english_name: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    # Maps directly to JSON field 'cuisine' ("Vietnam", "Korea"...) in dishes_seed.json
    # while binding to the SQLite DB column 'cuisine_id':
    cuisine: Mapped[str] = mapped_column(
        "cuisine_id",
        String,
        ForeignKey("cuisines.id", onupdate="CASCADE"),
        nullable=False,
        index=True,
    )
    cuisine_id = synonym("cuisine")

    region: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    image: Mapped[str] = mapped_column(String, nullable=False)
    image_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    cook_time_minutes: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    prep_time_minutes: Mapped[int] = mapped_column(Integer, default=10)
    difficulty: Mapped[str] = mapped_column(String, default="Dễ")
    spicy_level: Mapped[int] = mapped_column(Integer, default=0)
    calories_approx: Mapped[int] = mapped_column(Integer, default=400)
    short_description: Mapped[str] = mapped_column(String, nullable=False)
    tips: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    created_at: Mapped[Optional[datetime]] = mapped_column(DateTime, server_default=func.now())

    # Relationships
    cuisine_rel: Mapped[Optional["Cuisine"]] = relationship(back_populates="dishes")
    ingredients: Mapped[List["Ingredient"]] = relationship(
        back_populates="dish",
        cascade="all, delete-orphan",
    )
    cooking_steps: Mapped[List["CookingStep"]] = relationship(
        back_populates="dish",
        cascade="all, delete-orphan",
        order_by="CookingStep.step_number",
    )
    steps = synonym("cooking_steps")

    saved_by_users: Mapped[List["UserSavedDish"]] = relationship(
        back_populates="dish",
        cascade="all, delete-orphan",
    )


class Ingredient(Base):
    __tablename__ = "ingredients"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    dish_id: Mapped[str] = mapped_column(
        String,
        ForeignKey("dishes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name: Mapped[str] = mapped_column(String, nullable=False)
    amount: Mapped[str] = mapped_column(String, nullable=False)
    unit: Mapped[str] = mapped_column(String, nullable=False)
    category: Mapped[str] = mapped_column(String, default="nguyên liệu chính")

    # Relationships
    dish: Mapped["Dish"] = relationship(back_populates="ingredients")


class CookingStep(Base):
    __tablename__ = "cooking_steps"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    dish_id: Mapped[str] = mapped_column(
        String,
        ForeignKey("dishes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    step_number: Mapped[int] = mapped_column(Integer, nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=False)

    # Relationships
    dish: Mapped["Dish"] = relationship(back_populates="cooking_steps")


class UserSavedDish(Base):
    __tablename__ = "user_saved_dishes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    dish_id: Mapped[str] = mapped_column(
        String,
        ForeignKey("dishes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    saved_at: Mapped[Optional[datetime]] = mapped_column(DateTime, server_default=func.now())

    __table_args__ = (
        UniqueConstraint("user_id", "dish_id", name="uq_user_saved_dish"),
    )

    # Relationships
    user: Mapped["User"] = relationship(back_populates="saved_dishes")
    dish: Mapped["Dish"] = relationship(back_populates="saved_by_users")
