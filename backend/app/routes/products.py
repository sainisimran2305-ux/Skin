from fastapi import APIRouter, HTTPException, Depends
from typing import List
from ..db import get_db
from ..models import ProductResponse, ProductCreate

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("/", response_model=List[ProductResponse])
async def list_products():
    db = get_db()
    cursor = db.products.find({}, {"_id": 0})
    products = await cursor.to_list(length=100)
    return products

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    db = get_db()
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("/", response_model=ProductResponse, status_code=201)
async def create_product(product: ProductCreate):
    db = get_db()
    # Check if duplicate id
    existing = await db.products.find_one({"id": product.id})
    if existing:
        raise HTTPException(status_code=400, detail="Product with this ID already exists")
    
    await db.products.insert_one(product.model_dump())
    new_product = await db.products.find_one({"id": product.id}, {"_id": 0})
    return new_product
