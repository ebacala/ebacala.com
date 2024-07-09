FROM node:20-slim AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --ignore-scripts

COPY . .
RUN pnpm build

##########

FROM nginx:alpine AS final

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]