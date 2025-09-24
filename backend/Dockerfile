# Image Python officielle
FROM python:3.11-slim

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers du backend
COPY . /app

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Exposer le port du backend
EXPOSE 8000

# Lancer le backend avec Gunicorn
CMD ["python", "server.py"]
