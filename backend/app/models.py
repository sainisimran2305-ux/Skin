from pydantic import BaseModel, Field
from typing import List, Optional

# --- Product Models ---

class ProductBase(BaseModel):
    id: str  # unique string identifier like "radiant-glow-serum"
    name: str
    subtitle: str
    category: str
    categoryLabel: str
    price: float
    originalPrice: Optional[float] = None
    rating: float
    reviewsCount: int
    badge: Optional[str] = None
    skinType: List[str]
    volumeOptions: List[str]
    selectedVolume: str
    image: str
    secondaryImage: Optional[str] = None
    description: str
    keyIngredients: List[str]
    benefits: List[str]
    usage: str
    ritualTime: str

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    subtitle: Optional[str] = None
    category: Optional[str] = None
    categoryLabel: Optional[str] = None
    price: Optional[float] = None
    originalPrice: Optional[float] = None
    rating: Optional[float] = None
    reviewsCount: Optional[int] = None
    badge: Optional[str] = None
    skinType: Optional[List[str]] = None
    volumeOptions: Optional[List[str]] = None
    selectedVolume: Optional[str] = None
    image: Optional[str] = None
    secondaryImage: Optional[str] = None
    description: Optional[str] = None
    keyIngredients: Optional[List[str]] = None
    benefits: Optional[List[str]] = None
    usage: Optional[str] = None
    ritualTime: Optional[str] = None

class ProductResponse(ProductBase):
    pass


# --- Ingredient Models ---

class IngredientBase(BaseModel):
    id: str  # unique string identifier like "sage"
    name: str
    latinName: str
    originRegion: str
    lat: float
    lng: float
    benefits: List[str]
    skinTypeSuitability: str
    image: str
    description: str

class IngredientCreate(IngredientBase):
    pass

class IngredientResponse(IngredientBase):
    pass


# --- Order Models ---

class OrderItem(BaseModel):
    name: str
    selectedVolume: str
    quantity: int
    price: float
    image: str

class ShippingAddress(BaseModel):
    fullName: str
    address: str
    city: str
    state: str
    zip: str

class OrderBase(BaseModel):
    id: Optional[str] = None
    date: Optional[str] = None
    status: Optional[str] = "Formulating Botanicals"
    currentStep: Optional[int] = 2
    trackingNumber: Optional[str] = None
    carrier: Optional[str] = "EcoCourier Express"
    estimatedDelivery: Optional[str] = None
    paymentMethod: str
    paymentMethodLabel: str
    items: List[OrderItem]
    shippingAddress: ShippingAddress
    total: float

class OrderCreate(OrderBase):
    pass

class OrderUpdate(BaseModel):
    status: Optional[str] = None
    currentStep: Optional[int] = None
    trackingNumber: Optional[str] = None
    carrier: Optional[str] = None
    estimatedDelivery: Optional[str] = None
    paymentMethod: Optional[str] = None
    paymentMethodLabel: Optional[str] = None

class OrderResponse(OrderBase):
    pass
