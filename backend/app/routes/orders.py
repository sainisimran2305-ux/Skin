import random
from datetime import datetime
from fastapi import APIRouter, Depends
from typing import List
from ..db import get_db
from ..models import OrderResponse, OrderCreate

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.get("/", response_model=List[OrderResponse])
async def list_orders():
    db = get_db()
    cursor = db.orders.find({}, {"_id": 0})
    orders = await cursor.to_list(length=200)
    # Sort orders by date descending if possible, or keep as inserted
    return orders

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
    
    # Return created order, projecting out _id
    created_order = await db.orders.find_one({"id": order_data["id"]}, {"_id": 0})
    return created_order
