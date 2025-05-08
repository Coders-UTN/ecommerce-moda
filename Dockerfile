# Usamos la imagen oficial de Node.js
FROM node:18

# Creamos el directorio de trabajo
WORKDIR /app

# Copiamos los archivos package.json y package-lock.json
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto de los archivos del proyecto
COPY . .

# Exponemos el puerto que usará la aplicación
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["node", "backend/server.js"]
