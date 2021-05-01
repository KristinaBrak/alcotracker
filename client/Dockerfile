FROM node:14.16-alpine3.10

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

COPY . .

# RUN yarn build
EXPOSE 3000

CMD ["yarn", "start"]