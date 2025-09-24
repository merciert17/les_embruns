# Étape 1 : Build de l'application React
FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Étape 2 : Serveur Nginx pour héberger le build
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html

# Exposer le port de Nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
