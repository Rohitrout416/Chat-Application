FROM node:22 AS BASE


WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci

WORKDIR /app
COPY . .

EXPOSE 3000

WORKDIR /app/backend
CMD ["npm", "start"]

