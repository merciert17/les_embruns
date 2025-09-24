from fastapi import FastAPI, APIRouter, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import logging
import uuid
from datetime import datetime, timedelta
from typing import List, Dict, Any
from pydantic import BaseModel

# Create the main app
app = FastAPI(title="Les Embruns Restaurant API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Valid access code
VALID_ACCESS_CODE = "2108"
ADMIN_ACCESS_CODE = "2108"
ACCESS_SESSION_DURATION = timedelta(hours=24)  # Sessions last 24 hours

# Session storage (in-memory for simplicity)
active_sessions = {}
admin_sessions = {}

# Site lock status
SITE_SETTINGS = {
    "is_locked": True,  # True = code requis, False = accès direct
    "admin_password": "2108"
}

# Pydantic models for API responses
class AccessRequest(BaseModel):
    code: str

class AccessResponse(BaseModel):
    success: bool
    message: str
    session_id: str = ""

class AdminLoginRequest(BaseModel):
    password: str

class AdminResponse(BaseModel):
    success: bool
    message: str
    session_id: str = ""

class SiteSettingsUpdate(BaseModel):
    is_locked: bool

class MenuItemCreate(BaseModel):
    name: str
    description: str
    price: str

class MenuItemUpdate(BaseModel):
    name: str
    description: str
    price: str

class MenuCategoryUpdate(BaseModel):
    name: str
    items: List[MenuItemCreate]

# Static restaurant data (replaces MongoDB)
RESTAURANT_DATA = {
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
        "address": "6 Rue Chay Morin, 17410 Saint-Martin-de-Ré",
        "hours": {
            "monday": "Fermé",
            "tuesday": "12h15-13h30, 19h15-21h15",
            "wednesday": "12h15-13h30, 19h15-21h15",
            "thursday": "12h15-13h30, 19h15-21h15", 
            "friday": "12h15-13h30, 19h15-21h15",
            "saturday": "12h15-13h30, 19h15-21h15",
            "sunday": "12h15-13h30, 19h15-21h15"
        }
    }
}

MENU_DATA = [
    {
        "id": "entrees",
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
        ]
    },
    {
        "id": "plats",
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
        ]
    },
    {
        "id": "desserts",
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
        ]
    }
]

GALLERY_DATA = [
    {
        "id": "1",
        "image": "https://images.unsplash.com/photo-1731156683189-64b572795e4e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwRnJlbmNoJTIwY3Vpc2luZXxlbnwwfHx8fDE3NTg1Nzg2MDB8MA&ixlib=rb-4.1.0&q=85",
        "alt": "Plat gastronomique signature",
        "category": "food",
        "order": 1
    },
    {
        "id": "2",
        "image": "https://images.unsplash.com/photo-1737700088910-8c22735cf11f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwyfHxnb3VybWV0JTIwRnJlbmNoJTIwY3Vpc2luZXxlbnwwfHx8fDE3NTg1Nzg2MDB8MA&ixlib=rb-4.1.0&q=85",
        "alt": "Spécialités artisanales",
        "category": "food"
    },
    {
        "id": "3", 
        "image": "https://images.unsplash.com/photo-1651607826886-efd567ad54f2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHw0fHxlbGVnYW50JTIwcmVzdGF1cmFudCUyMGludGVyaW9yfGVufDB8fHx8MTc1ODU3ODU5NHww&ixlib=rb-4.1.0&q=85",
        "alt": "Table dressée avec élégance", 
        "category": "interior"
    },
    {
        "id": "4",
        "image": "https://images.unsplash.com/photo-1709940683584-a3f589a47e18?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwyfHxzZWFzaWRlJTIwcmVzdGF1cmFudHxlbnwwfHx8fDE3NTg1Nzg2MDV8MA&ixlib=rb-4.1.0&q=85",
        "alt": "Vue sur le port",
        "category": "view"
    }
]

def verify_session(session_id: str) -> bool:
    """Verify if session is valid and not expired"""
    if session_id not in active_sessions:
        return False
    
    session_data = active_sessions[session_id]
    if datetime.utcnow() > session_data['expires_at']:
        del active_sessions[session_id]
        return False
    
    return True

def verify_admin_session(session_id: str) -> bool:
    """Verify if admin session is valid and not expired"""
    if session_id not in admin_sessions:
        return False
    
    session_data = admin_sessions[session_id]
    if datetime.utcnow() > session_data['expires_at']:
        del admin_sessions[session_id]
        return False
    
    return True

# Restaurant Info Endpoints
@api_router.get("/restaurant/info")
async def get_restaurant_info():
    """Get restaurant information"""
    try:
        return RESTAURANT_DATA
    except Exception as e:
        logging.error(f"Error fetching restaurant info: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Menu Endpoints
@api_router.get("/menu")
async def get_menu():
    """Get complete menu with categories and items"""
    try:
        return MENU_DATA
    except Exception as e:
        logging.error(f"Error fetching menu: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Gallery Endpoints
@api_router.get("/gallery")
async def get_gallery():
    """Get gallery images"""
    try:
        return GALLERY_DATA
    except Exception as e:
        logging.error(f"Error fetching gallery: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Access Control Endpoints
@api_router.post("/access/verify", response_model=AccessResponse)
async def verify_access_code(request: AccessRequest, req: Request):
    """Verify access code and create session"""
    try:
        # Si le site n'est pas verrouillé, accès autorisé sans code
        if not SITE_SETTINGS["is_locked"]:
            session_id = str(uuid.uuid4())
            session_data = {
                'created_at': datetime.utcnow(),
                'expires_at': datetime.utcnow() + ACCESS_SESSION_DURATION,
                'ip_address': req.client.host,
                'user_agent': req.headers.get('user-agent', '')
            }
            active_sessions[session_id] = session_data
            
            return AccessResponse(
                success=True,
                message="Accès libre autorisé",
                session_id=session_id
            )
        
        if request.code == VALID_ACCESS_CODE:
            # Generate session ID
            session_id = str(uuid.uuid4())
            
            # Create session
            session_data = {
                'created_at': datetime.utcnow(),
                'expires_at': datetime.utcnow() + ACCESS_SESSION_DURATION,
                'ip_address': req.client.host,
                'user_agent': req.headers.get('user-agent', '')
            }
            active_sessions[session_id] = session_data
            
            return AccessResponse(
                success=True,
                message="Accès autorisé",
                session_id=session_id
            )
        else:
            return AccessResponse(
                success=False,
                message="Code d'accès invalide"
            )
    except Exception as e:
        logging.error(f"Error verifying access code: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/access/check/{session_id}")
async def check_session(session_id: str):
    """Check if session is valid"""
    try:
        is_valid = verify_session(session_id)
        return {"hasAccess": is_valid}
    except Exception as e:
        logging.error(f"Error checking session: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/site/settings")
async def get_site_settings():
    """Get site settings (lock status)"""
    try:
        return {"is_locked": SITE_SETTINGS["is_locked"]}
    except Exception as e:
        logging.error(f"Error fetching site settings: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Admin Endpoints
@api_router.post("/admin/login", response_model=AdminResponse)
async def admin_login(request: AdminLoginRequest, req: Request):
    """Admin login"""
    try:
        if request.password == ADMIN_ACCESS_CODE:
            session_id = str(uuid.uuid4())
            
            session_data = {
                'created_at': datetime.utcnow(),
                'expires_at': datetime.utcnow() + ACCESS_SESSION_DURATION,
                'ip_address': req.client.host,
                'user_agent': req.headers.get('user-agent', '')
            }
            admin_sessions[session_id] = session_data
            
            return AdminResponse(
                success=True,
                message="Connexion admin réussie",
                session_id=session_id
            )
        else:
            return AdminResponse(
                success=False,
                message="Mot de passe incorrect"
            )
    except Exception as e:
        logging.error(f"Error in admin login: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/admin/check/{session_id}")
async def check_admin_session(session_id: str):
    """Check if admin session is valid"""
    try:
        is_valid = verify_admin_session(session_id)
        return {"hasAccess": is_valid}
    except Exception as e:
        logging.error(f"Error checking admin session: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.put("/admin/site/settings")
async def update_site_settings(settings: SiteSettingsUpdate, req: Request):
    """Update site settings (admin only)"""
    try:
        # Vérifier l'autorisation admin via header
        auth_header = req.headers.get('authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            raise HTTPException(status_code=401, detail="Non autorisé")
        
        session_id = auth_header.split(' ')[1]
        if not verify_admin_session(session_id):
            raise HTTPException(status_code=401, detail="Session admin invalide")
        
        SITE_SETTINGS["is_locked"] = settings.is_locked
        return {"success": True, "message": "Paramètres mis à jour", "settings": SITE_SETTINGS}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error updating site settings: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/admin/menu")
async def get_admin_menu(req: Request):
    """Get menu for admin (admin only)"""
    try:
        # Vérifier l'autorisation admin via header
        auth_header = req.headers.get('authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            raise HTTPException(status_code=401, detail="Non autorisé")
        
        session_id = auth_header.split(' ')[1]
        if not verify_admin_session(session_id):
            raise HTTPException(status_code=401, detail="Session admin invalide")
        
        return MENU_DATA
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error fetching admin menu: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.put("/admin/menu/{category_id}")
async def update_menu_category(category_id: str, category: MenuCategoryUpdate, req: Request):
    """Update menu category (admin only)"""
    try:
        # Vérifier l'autorisation admin via header
        auth_header = req.headers.get('authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            raise HTTPException(status_code=401, detail="Non autorisé")
        
        session_id = auth_header.split(' ')[1]
        if not verify_admin_session(session_id):
            raise HTTPException(status_code=401, detail="Session admin invalide")
        
        # Trouver et mettre à jour la catégorie
        for i, cat in enumerate(MENU_DATA):
            if cat["id"] == category_id:
                MENU_DATA[i]["name"] = category.name
                MENU_DATA[i]["items"] = [item.dict() for item in category.items]
                return {"success": True, "message": "Catégorie mise à jour"}
        
        raise HTTPException(status_code=404, detail="Catégorie non trouvée")
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error updating menu category: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.post("/admin/menu/{category_id}/items")
async def add_menu_item(category_id: str, item: MenuItemCreate, req: Request):
    """Add item to menu category (admin only)"""
    try:
        # Vérifier l'autorisation admin via header
        auth_header = req.headers.get('authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            raise HTTPException(status_code=401, detail="Non autorisé")
        
        session_id = auth_header.split(' ')[1]
        if not verify_admin_session(session_id):
            raise HTTPException(status_code=401, detail="Session admin invalide")
        
        # Trouver la catégorie et ajouter l'item
        for cat in MENU_DATA:
            if cat["id"] == category_id:
                cat["items"].append(item.dict())
                return {"success": True, "message": "Plat ajouté"}
        
        raise HTTPException(status_code=404, detail="Catégorie non trouvée")
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error adding menu item: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.delete("/admin/menu/{category_id}/items/{item_index}")
async def delete_menu_item(category_id: str, item_index: int, req: Request):
    """Delete item from menu category (admin only)"""
    try:
        # Vérifier l'autorisation admin via header
        auth_header = req.headers.get('authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            raise HTTPException(status_code=401, detail="Non autorisé")
        
        session_id = auth_header.split(' ')[1]
        if not verify_admin_session(session_id):
            raise HTTPException(status_code=401, detail="Session admin invalide")
        
        # Trouver la catégorie et supprimer l'item
        for cat in MENU_DATA:
            if cat["id"] == category_id:
                if 0 <= item_index < len(cat["items"]):
                    cat["items"].pop(item_index)
                    return {"success": True, "message": "Plat supprimé"}
                else:
                    raise HTTPException(status_code=404, detail="Item non trouvé")
        
        raise HTTPException(status_code=404, detail="Catégorie non trouvée")
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error deleting menu item: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Health check endpoint
@api_router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

# Include the router in the main app
app.include_router(api_router)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    """Application startup"""
    logger.info("Application started successfully")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Application shutting down")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)