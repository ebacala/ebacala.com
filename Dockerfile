FROM nginx:stable-alpine-slim
COPY ./src /usr/share/nginx/html
COPY ./ebacala.conf /etc/nginx/sites-enabled
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
