FROM node:latest as base

WORKDIR /home/node/app

COPY package.json ./

RUN npm i

COPY . .

FROM base as production

ENV NODE_PATH=./build

RUN npm i

RUN npm run build

COPY ./src/newrelic.js ./build/newrelic.js

EXPOSE 3100

CMD [ "node", "build/app.js" ]