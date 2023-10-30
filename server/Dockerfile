FROM node:20
RUN mkdir -p /app
WORKDIR /app

COPY package.json package-lock.json .
RUN npm install

COPY . .
EXPOSE 5000
CMD [ "node", "server.mjs"]
