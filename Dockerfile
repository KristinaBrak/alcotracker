FROM node:lts-alpine

ENV PORT 4000
ENV NODE_ENV development
ENV DB production
ENV LOG_LEVEL info
ENV REDIS_HOST "redis"
ENV SCHEDULE "5 7 * * *"

WORKDIR /usr/app
COPY package.json .
RUN yarn install
COPY . .
RUN npm run build
CMD "yarn" "start-prod"