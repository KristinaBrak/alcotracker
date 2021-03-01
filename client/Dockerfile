FROM node:alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json .
COPY yarn.lock .
RUN yarn

COPY . .

RUN yarn build
EXPOSE 3000

CMD ["yarn", "start"]