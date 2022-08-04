FROM node:16.14.0-alpine AS builder

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:16.14.0-alpine AS server

ENV NODE_ENV=production
ENV PATH=$PATH:/home/node/.npm-global/bin
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

# Create app directory
WORKDIR /usr/src/app
# RUN mkdir -p /var/log/server

# Bundle app source
COPY .env .
COPY package* .
# COPY . /usr/src/app

# Install app dependencies & Build
RUN npm i --production
# RUN npm run build
# RUN npx copy './src/**/*.{json,yaml,html,png}' ./dist/src

# COPY --from=builder /usr/src/app/public .
COPY --from=builder /usr/src/app/build ./build

EXPOSE 9000

RUN mkdir public logs
RUN chown node:node logs
RUN chown node:node public
RUN ls -la

USER node
# RUN mkdir -p ~/logs

CMD ["node", "build/src/index.js"]