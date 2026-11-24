from fastapi import APIRouter, HTTPException, Depends
from typing import List
from ..db import get_db
from ..models import ProductResponse, ProductCreate, ProductUpdate
from ..seeds import SEED_PRODUCTS

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

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(product_id: str, product_update: ProductUpdate):
    db = get_db()
    existing = await db.products.find_one({"id": product_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = {k: v for k, v in product_update.model_dump().items() if v is not None}
    if update_data:
        await db.products.update_one({"id": product_id}, {"$set": update_data})
    
    updated = await db.products.find_one({"id": product_id}, {"_id": 0})
    return updated

@router.delete("/{product_id}")
async def delete_product(product_id: str):
    db = get_db()
    res = await db.products.delete_one({"id": product_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully", "id": product_id}

@router.post("/reset-defaults", response_model=List[ProductResponse])
async def reset_seed_products():
    db = get_db()
    await db.products.delete_many({})
    await db.products.insert_many(SEED_PRODUCTS)
    cursor = db.products.find({}, {"_id": 0})
    return await cursor.to_list(length=100)
