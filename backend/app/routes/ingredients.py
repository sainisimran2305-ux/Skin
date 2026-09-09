from fastapi import APIRouter, HTTPException
from typing import List
from ..db import get_db
from ..models import IngredientResponse

router = APIRouter(prefix="/ingredients", tags=["Ingredients"])

@router.get("/", response_model=List[IngredientResponse])
async def list_ingredients():
    db = get_db()
    cursor = db.ingredients.find({}, {"_id": 0})
    ingredients = await cursor.to_list(length=100)
    return ingredients

@router.get("/{ingredient_id}", response_model=IngredientResponse)
async def get_ingredient(ingredient_id: str):
    db = get_db()
    ingredient = await db.ingredients.find_one({"id": ingredient_id}, {"_id": 0})
    if not ingredient:
        raise HTTPException(status_code=404, detail="Ingredient not found")
    return ingredient
