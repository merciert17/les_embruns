#!/usr/bin/env python3
"""
Start script minimal pour Les Embruns
Lance backend et frontend dans des fenêtres séparées et affiche les retours
"""

import os
import subprocess
from pathlib import Path

# Détection des dossiers
script_dir = Path(__file__).parent
backend_dir = next((p.parent for p in script_dir.rglob('server.py')), script_dir / "backend")
frontend_dir = next((p.parent for p in script_dir.rglob('package.json')), script_dir / "frontend")

print(f"Lancement du backend depuis: {backend_dir}")
print(f"Lancement du frontend depuis: {frontend_dir}")

# Lancer le backend (py server.py) dans une nouvelle fenêtre
try:
    subprocess.Popen(['cmd', '/c', 'start', 'cmd', '/k', 'py', 'server.py'], cwd=backend_dir)
    print("✅ Backend lancé (py server.py)")
except Exception as e:
    print(f"❌ Échec lancement backend: {e}")

# Lancer le frontend (npm start) dans une nouvelle fenêtre
try:
    subprocess.Popen(['cmd', '/c', 'start', 'cmd', '/k', 'npm', 'start'], cwd=frontend_dir)
    print("✅ Frontend lancé (npm start)")
except Exception as e:
    print(f"❌ Échec lancement frontend: {e}")
