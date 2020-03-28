FROM node:10.16.0

ADD . /app

WORKDIR /app

RUN npm config set registry http://registry.npm.taobao.org/

RUN yarn config set registry http://registry.npm.taobao.org/

RUN yarn install --production

ENV NODE_ENV=production

CMD ["yarn", "start"]