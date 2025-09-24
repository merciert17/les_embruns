# Étape 1 : Build de l'application React
FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Étape 2 : Serveur Nginx pour héberger le build
FROM nginx:stable-alpine

# Copier les fichiers React buildés
COPY --from=build /app/build /usr/share/nginx/html

# ⚡ Ajouter la config Nginx custom
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port de Nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
