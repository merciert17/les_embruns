from motor.motor_asyncio import AsyncIOMotorClient
from models import RestaurantInfo, MenuCategory, GalleryItem, AccessLog
import os
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'restaurant_db')]

# Collections
restaurant_collection = db.restaurant_info
menu_collection = db.menu_items
gallery_collection = db.gallery
access_collection = db.access_logs

async def init_database():
    """Initialize database with sample data if empty"""
    
    # Check if restaurant info exists
    if await restaurant_collection.count_documents({}) == 0:
        restaurant_data = {
            "name": "Les Embruns",
            "tagline": "Restaurant Semi-Gastronomique", 
            "location": "Port de Saint Martin de Ré",
            "description": "Découvrez Les Embruns, une expérience culinaire raffinée au cœur du port de Saint Martin de Ré. Notre cuisine semi-gastronomique met à l'honneur les produits de la mer et les saveurs locales dans un cadre élégant proche de la mer.",
            "hero": {
                "title": "Les Embruns",
                "subtitle": "L'Art Culinaire proche de la mer",
                "description": "Une expérience semi-gastronomique unique au port de Saint Martin de Ré",
                "image": "https://images.unsplash.com/photo-1678798947526-49a0c432105c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwxfHxzZWFzaWRlJTIwcmVzdGF1cmFudHxlbnwwfHx8fDE3NTg1Nzg2MDV8MA&ixlib=rb-4.1.0&q=85"
            },
            "about": {
                "title": "Notre Histoire", 
                "description": "Niché au cœur du port de Saint Martin de Ré, Les Embruns vous invite à découvrir une cuisine raffinée où se mêlent tradition française et innovations culinaires. Notre chef perpétue l'art de sublimer les produits locaux de l'île de Ré dans un cadre exceptionnel proche de la mer.",
                "image": "https://images.unsplash.com/photo-1728891715962-ffee8c61e38e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwcmVzdGF1cmFudCUyMGludGVyaW9yfGVufDB8fHx8MTc1ODU3ODU5NHww&ixlib=rb-4.1.0&q=85"
            },
            "contact": {
                "phone": "05 46 66 46 31",
                "address": "12 Quai Nicolas Baudin, 17410 Saint Martin de Ré",
                "hours": {
                    "monday": "Fermé",
                    "tuesday": "12h15-13h30, 19h15-21h15",
                    "wednesday": "12h15-13h30, 19h15-21h15",
                    "thursday": "12h15-13h30, 19h15-21h15", 
                    "friday": "12h15-13h30, 19h15-21h15",
                    "saturday": "12h15-13h30, 19h15-21h15",
                    "sunday": "12h15-13h30, 19h15-21h15"
                }
            },
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        restaurant_info = RestaurantInfo(**restaurant_data)
        await restaurant_collection.insert_one(restaurant_info.dict())
    
    # Initialize menu data
    if await menu_collection.count_documents({}) == 0:
        menu_categories = [
            {
                "name": "Entrées",
                "order": 1,
                "items": [
                    {
                        "name": "Huîtres de Marennes-Oléron", 
                        "description": "Servies nature ou gratinées au beurre d'algues",
                        "price": "18€"
                    },
                    {
                        "name": "Tartare de Bar de Ligne",
                        "description": "Avocat, pomme verte et vinaigrette aux agrumes", 
                        "price": "22€"
                    },
                    {
                        "name": "Velouté de Châtaigne",
                        "description": "Émulsion de truffe et lard paysan",
                        "price": "16€"
                    }
                ],
                "created_at": datetime.utcnow()
            },
            {
                "name": "Plats", 
                "order": 2,
                "items": [
                    {
                        "name": "Sole de Nos Côtes",
                        "description": "Meunière aux pommes de terre de Noirmoutier",
                        "price": "42€"
                    },
                    {
                        "name": "Agneau de Pré-Salé", 
                        "description": "Jus au thym, légumes de saison",
                        "price": "38€"
                    },
                    {
                        "name": "Risotto aux Fruits de Mer",
                        "description": "Langoustines, moules et palourdes", 
                        "price": "34€"
                    }
                ],
                "created_at": datetime.utcnow()
            },
            {
                "name": "Desserts",
                "order": 3, 
                "items": [
                    {
                        "name": "Tarte au Chocolat Valrhona",
                        "description": "Glace vanille de Madagascar",
                        "price": "14€"
                    },
                    {
                        "name": "Île Flottante Revisitée", 
                        "description": "Caramel au beurre salé de Guérande",
                        "price": "12€"
                    }
                ],
                "created_at": datetime.utcnow()
            }
        ]
        
        for category_data in menu_categories:
            category = MenuCategory(**category_data)
            await menu_collection.insert_one(category.dict())
    
    # Initialize gallery data
    if await gallery_collection.count_documents({}) == 0:
        gallery_items = [
            {
                "image": "https://images.unsplash.com/photo-1731156683189-64b572795e4e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwRnJlbmNoJTIwY3Vpc2luZXxlbnwwfHx8fDE3NTg1Nzg2MDB8MA&ixlib=rb-4.1.0&q=85",
                "alt": "Plat gastronomique signature",
                "category": "food",
                "order": 1,
                "created_at": datetime.utcnow()
            },
            {
                "image": "https://images.unsplash.com/photo-1737700088910-8c22735cf11f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwyfHxnb3VybWV0JTIwRnJlbmNoJTIwY3Vpc2luZXxlbnwwfHx8fDE3NTg1Nzg2MDB8MA&ixlib=rb-4.1.0&q=85",
                "alt": "Spécialités artisanales",
                "category": "food", 
                "order": 2,
                "created_at": datetime.utcnow()
            },
            {
                "image": "https://images.unsplash.com/photo-1651607826886-efd567ad54f2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHw0fHxlbGVnYW50JTIwcmVzdGF1cmFudCUyMGludGVyaW9yfGVufDB8fHx8MTc1ODU3ODU5NHww&ixlib=rb-4.1.0&q=85",
                "alt": "Table dressée avec élégance", 
                "category": "interior",
                "order": 3,
                "created_at": datetime.utcnow()
            },
            {
                "image": "https://images.unsplash.com/photo-1709940683584-a3f589a47e18?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwyfHxzZWFzaWRlJTIwcmVzdGF1cmFudHxlbnwwfHx8fDE3NTg1Nzg2MDV8MA&ixlib=rb-4.1.0&q=85",
                "alt": "Vue sur le port",
                "category": "view",
                "order": 4, 
                "created_at": datetime.utcnow()
            }
        ]
        
        for item_data in gallery_items:
            item = GalleryItem(**item_data)
            await gallery_collection.insert_one(item.dict())