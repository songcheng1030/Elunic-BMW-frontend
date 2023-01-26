## Builder
FROM node:14 AS builder
ARG BUILD_ENVIRONMENT

WORKDIR /app

COPY ./package.json package.json
COPY ./package-lock.json package-lock.json
RUN npm i --unsafe-perm

COPY ./ /app/
RUN npm run "build:${BUILD_ENVIRONMENT}"


## Final image
FROM nginx

RUN rm -rf /usr/share/nginx/html/*

COPY _fixtures/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/aiqx-use-cases /usr/share/nginx/html

EXPOSE 8080
