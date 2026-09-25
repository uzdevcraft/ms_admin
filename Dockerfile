FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG VITE_API_BASE_URL
ARG VITE_API_URL
ARG VITE_MEDIA_ORIGIN

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL:-${VITE_API_URL:-https://api.magic-store.uz}}
ENV VITE_MEDIA_ORIGIN=${VITE_MEDIA_ORIGIN:-http://45.80.149.4:9000}

RUN npm run build

FROM nginx:alpine

ENV VITE_API_BASE_URL=https://api.magic-store.uz
ENV VITE_MEDIA_ORIGIN=http://45.80.149.4:9000
ENV NGINX_ENVSUBST_TEMPLATE_VARS="VITE_API_BASE_URL VITE_MEDIA_ORIGIN"

COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
