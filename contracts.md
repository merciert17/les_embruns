# 🍽️ Les Embruns - Restaurant Semi-Gastronomique

Site vitrine élégant pour le restaurant Les Embruns situé au port de Saint Martin de Ré.

## 🚀 Lancement rapide

### Option 1 : Script automatique (Recommandé)
```bash
python start.py
```

Le script lance automatiquement :
- ✅ Installation des dépendances
- ✅ Serveur backend (FastAPI)
- ✅ Serveur frontend (React)
- ✅ Ouverture du navigateur

### Option 2 : Lancement manuel

**Backend :**
```bash
cd backend
pip install -r requirements.txt
python server.py
```

**Frontend :**
```bash
cd frontend
yarn install
yarn start
```

## 🔐 Accès au site

1. **URL :** http://localhost:3000
2. **Code d'accès :** `2108`
3. **Profitez de l'expérience !**

## 📱 Fonctionnalités

- ✨ **Page de protection** avec code d'accès
- 🎨 **Design élégant** avec palette de couleurs chaudes
- 📸 **Carrousel d'images** pour "Notre Histoire"
- 🍽️ **Menu complet** avec entrées, plats, desserts
- 🖼️ **Galerie interactive** avec modal
- 📱 **Design responsive** mobile/desktop
- 🎭 **Animations fluides** et transitions
- 📞 **Contact direct** avec numéro de téléphone

## 🛠️ Technologies utilisées

**Frontend :**
- React 19
- Tailwind CSS
- Shadcn/UI Components
- Lucide React Icons

**Backend :**
- FastAPI
- Python 3.8+
- Données statiques (pas de base de données)

## 📦 Structure du projet

```
├── frontend/          # Application React
│   ├── src/
│   │   ├── components/   # Composants React
│   │   ├── services/     # API calls
│   │   └── ...
├── backend/           # API FastAPI
│   ├── server.py        # Serveur principal
│   └── requirements.txt
├── start.py          # Script de lancement
└── README.md
```

## 🎨 Palette de couleurs

- **Primaire :** Tons crème et beige chauds
- **Secondaire :** Pierre et ambre
- **Accent :** Noir profond
- **Background :** Gradients subtils par section

## 📸 Sections du site

1. **Hero** - Page d'accueil avec image de fond
2. **À Propos** - Histoire avec carrousel d'images
3. **Menu** - Carte complète du restaurant
4. **Galerie** - Photos du restaurant et des plats
5. **Contact** - Informations et horaires

## 🔧 Dépannage

**Le site ne se lance pas :**
- Vérifiez que Python 3.8+ est installé
- Vérifiez que Node.js est installé
- Lancez `python start.py` dans le dossier racine

**Le carrousel ne fonctionne pas :**
- Vérifiez votre connexion internet (images Unsplash)
- Rafraîchissez la page

**Port déjà utilisé :**
- Backend : http://localhost:8001
- Frontend : http://localhost:3000

## 📝 Licence

Projet créé pour Les Embruns - Saint Martin de Ré