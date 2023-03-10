FROM node:16-alpine as builder
WORKDIR /app
COPY . .
RUN yarn install && yarn generate

FROM nginx:stable-alpine as final
COPY --from=builder /app/.output/public /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]