# Build

FROM node:10.12-alpine AS build

RUN apk add --no-cache openssl libressl git make gcc g++ python

WORKDIR /app

COPY . /app

RUN npm install && npm rebuild node-sass

RUN npm run build

RUN cd src/strapi && yarn install

# RUN rm -rf node_modules && npm i --prod

# Production

FROM node:10.12-alpine

COPY --from=build /app /app

WORKDIR /app

ENV NODE_ENV=production

CMD ["npm", "start"]

EXPOSE 1337
