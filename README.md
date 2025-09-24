# 🍽️ Les Embruns - Restaurant Semi-Gastronomique

Site web élégant pour le restaurant Les Embruns situé au port de Saint Martin de Ré.

## 🚀 Déploiement rapide (Une seule commande!)

### Lancement automatique recommandé ⭐

```bash
cd /app
./start.sh
```

Ce script lance automatiquement :
- ✅ Backend FastAPI sur http://localhost:8001
- ✅ Frontend React sur http://localhost:3000  
- ✅ Vérification de la connectivité
- ✅ Statut des services

### Accès au site

1. **URL :** http://localhost:3000
2. **Code d'accès :** `2108`
3. **Panel Admin :** http://localhost:3000/admin (mot de passe: `2108`)

## 📱 Fonctionnalités complètes

- ✨ **Page de protection** avec code d'accès
- 🎨 **Design élégant** avec palette de couleurs chaudes
- 📸 **Carrousel d'images** pour "Notre Histoire"
- 🍽️ **Menu complet** avec entrées, plats, desserts
- 🖼️ **Galerie interactive** avec modal
- 👨‍💼 **Panel d'administration** pour gérer le contenu
- 📱 **Design responsive** mobile/desktop
- 🎭 **Animations fluides** et transitions
- 📞 **Contact direct** avec informations du restaurant

## 🛠️ Technologies utilisées

**Frontend :**
- React 19
- Tailwind CSS + Shadcn/UI Components
- Axios pour les appels API
- React Router pour la navigation

**Backend :**
- FastAPI avec Python 3.11
- Système d'authentification par sessions
- API RESTful complète
- Gestion des accès et administration

## 🔧 Gestion des services

**Statut des services :**
```bash
supervisorctl status
```

**Redémarrer les services :**
```bash
supervisorctl restart backend frontend
```

**Arrêter les services :**
```bash
supervisorctl stop backend frontend
```

**Voir les logs :**
```bash
# Backend
tail -f /var/log/supervisor/backend.out.log

# Frontend  
tail -f /var/log/supervisor/frontend.out.log
```

## 🧪 Test de connectivité

Pour tester que tout fonctionne correctement :

```bash
cd /app
python test_access.py
```

## 📦 Structure du projet

```
├── backend/              # API FastAPI
│   ├── server.py        # Serveur principal avec toutes les routes
│   ├── models.py        # Modèles Pydantic
│   ├── database.py      # Configuration base de données (MongoDB)
│   ├── requirements.txt # Dépendances Python
│   └── .env            # Variables d'environnement backend
├── frontend/            # Application React
│   ├── src/
│   │   ├── components/  # Composants React
│   │   ├── services/    # Services API
│   │   └── App.js      # Composant principal
│   ├── package.json    # Dépendances Node.js
│   └── .env           # Variables d'environnement frontend
├── start.sh            # Script de démarrage unifié
├── test_access.py      # Script de test complet
└── README.md          # Documentation
```

## 🎨 Palette de couleurs

- **Primaire :** Tons crème et beige chauds (#F5F5DC, #DDBF94)
- **Secondaire :** Pierre et ambre (#8B7355, #D4AF37)  
- **Accent :** Noir profond (#1C1C1C)
- **Backgrounds :** Gradients subtils par section

## 🌟 API Endpoints

**Publics :**
- `GET /api/health` - Vérification de santé
- `GET /api/site/settings` - Paramètres du site
- `POST /api/access/verify` - Vérification code d'accès
- `GET /api/restaurant/info` - Informations du restaurant
- `GET /api/menu` - Menu complet
- `GET /api/gallery` - Images de la galerie

**Administration (auth requise) :**
- `POST /api/admin/login` - Connexion admin
- `PUT /api/admin/site/settings` - Modifier paramètres
- `GET /api/admin/menu` - Menu admin
- `PUT /api/admin/menu/{category}` - Modifier catégorie

## 🔐 Sécurité et accès

- **Code d'accès visiteur :** 2108
- **Mot de passe admin :** 2108
- Sessions temporaires (24h)
- Protection CORS configurée
- Validation des données avec Pydantic

## 🚨 Dépannage

**Les services ne démarrent pas :**
```bash
supervisorctl status
tail -f /var/log/supervisor/*.log
```

**Port déjà utilisé :**
```bash
sudo lsof -i :3000  # Frontend
sudo lsof -i :8001  # Backend
```

**Problème de connectivité frontend ↔ backend :**
```bash
curl http://localhost:8001/api/health
```

## 📝 Licence

Projet créé pour Les Embruns - Saint Martin de Ré