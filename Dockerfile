FROM node:16.14.0-alpine

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

# Create app directory
WORKDIR /usr/src/app
RUN mkdir logs
RUN mkdir .certs
RUN chown -R node:node logs/
RUN chown -R node:node .certs/
# RUN mkdir -p /var/log/server

# Bundle app source
COPY . /usr/src/app

# Install app dependencies & Build
RUN npm i
RUN npm run build
# RUN npx copy './src/**/*.{json,yaml,html,png}' ./dist/src

EXPOSE 9000
USER node
RUN mkdir -p ~/logs

CMD ["npm", "start"]