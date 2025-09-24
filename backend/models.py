from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

# Restaurant Info Models
class ContactInfo(BaseModel):
    phone: str
    address: str
    hours: dict

class HeroSection(BaseModel):
    title: str
    subtitle: str
    description: str
    image: str

class AboutSection(BaseModel):
    title: str
    description: str
    image: str

class RestaurantInfo(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    tagline: str
    location: str
    description: str
    hero: HeroSection
    about: AboutSection
    contact: ContactInfo
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Menu Models
class MenuItem(BaseModel):
    name: str
    description: str
    price: str

class MenuCategory(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    items: List[MenuItem]
    order: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Gallery Models
class GalleryItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    image: str
    alt: str
    category: Optional[str] = None
    order: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Access Control Models
class AccessRequest(BaseModel):
    code: str

class AccessResponse(BaseModel):
    success: bool
    message: str
    session_id: Optional[str] = None

class AccessLog(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    access_granted: bool
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)