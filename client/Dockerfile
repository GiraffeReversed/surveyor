FROM node:20 as build-stage
RUN mkdir -p /app
WORKDIR /app

COPY package.json package-lock.json .
RUN npm install

COPY . .
RUN npm run build

FROM nginx:1.25
COPY --from=build-stage /app/build/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
