# Build To Production
FROM node:16-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
# RUN npm run build
# RUN rm -rf node_modules && mv .env.example .env
# RUN npm install --only=prod

# Strage Prod
FROM node:16-alpine AS production
COPY --from=build /app /app
WORKDIR /app
EXPOSE 3000
CMD ["dist/main.js"]