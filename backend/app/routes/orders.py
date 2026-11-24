import random
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from ..db import get_db
from ..models import OrderResponse, OrderCreate, OrderUpdate

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.get("/", response_model=List[OrderResponse])
async def list_orders():
    db = get_db()
    cursor = db.orders.find({}, {"_id": 0})
    orders = await cursor.to_list(length=200)
    return orders

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(order_id: str):
    db = get_db()
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.post("/", response_model=OrderResponse, status_code=201)
async def create_order(order: OrderCreate):
    db = get_db()
    order_data = order.model_dump()
    
    # Generate ID if missing
    if not order_data.get("id"):
        order_data["id"] = f"PRK-{random.randint(10000, 99999)}"
        
    # Generate Date if missing
    if not order_data.get("date"):
        order_data["date"] = datetime.utcnow().strftime("%Y-%m-%d")
        
    # Generate tracking number if missing
    if not order_data.get("trackingNumber"):
        order_data["trackingNumber"] = f"TRK-BOT-{random.randint(100000, 999990)}"
        
    # Generate estimated delivery (e.g. 4 days from now) if missing
    if not order_data.get("estimatedDelivery"):
        from datetime import timedelta
        est = datetime.utcnow() + timedelta(days=4)
        order_data["estimatedDelivery"] = est.strftime("%Y-%m-%d")

    await db.orders.insert_one(order_data)
    created_order = await db.orders.find_one({"id": order_data["id"]}, {"_id": 0})
    return created_order

@router.put("/{order_id}", response_model=OrderResponse)
async def update_order(order_id: str, order_update: OrderUpdate):
    db = get_db()
    existing = await db.orders.find_one({"id": order_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Order not found")
    
    update_data = {k: v for k, v in order_update.model_dump().items() if v is not None}
    if update_data:
        await db.orders.update_one({"id": order_id}, {"$set": update_data})
        
    updated = await db.orders.find_one({"id": order_id}, {"_id": 0})
    return updated

@router.delete("/{order_id}")
async def delete_order(order_id: str):
    db = get_db()
    res = await db.orders.delete_one({"id": order_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order deleted successfully", "id": order_id}
