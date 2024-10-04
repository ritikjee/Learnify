FROM node:18-alpine AS base

RUN apk update
RUN apk upgrade
RUN apk add --no-cache ffmpeg

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .

RUN npm install

COPY src/ src/
COPY input/ input/
COPY output/ output/


RUN npm run build

CMD [ "npm","start" ]

