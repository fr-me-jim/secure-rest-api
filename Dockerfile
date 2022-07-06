FROM node:16.14.0-alpine

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

# Create app directory
WORKDIR /usr/src/app
# RUN mkdir -p /var/log/server

# Bundle app source
COPY . /usr/src/app

# Install app dependencies & Build
RUN npm i
RUN npm run build
ENV NODE_ENV=production
# RUN npx copy './src/**/*.{json,yaml,html,png}' ./dist/src

EXPOSE 9000

RUN mkdir public
RUN chown node:node public

USER node
RUN mkdir -p ~/logs

CMD ["node", "dist/src/index.js"]