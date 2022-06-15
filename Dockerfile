FROM node:16.14.0-alpine

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

# Create app directory
WORKDIR /usr/src/app
RUN mkdir logs

# Bundle app source
COPY . /usr/src/app

# permissions for logging
RUN chgrp -R node /usr/src/app/logs
RUN chmod -R g+wx /usr/src/app/logs
RUN ls -l .
# RUN npm i -g npm@latest

# Install app dependencies & Build
RUN npm i -g npm
RUN npm i npm
RUN npm i
RUN npm run build
# RUN npx copy './src/**/*.{json,yaml,html,png}' ./dist/src

EXPOSE 9000
USER node

CMD ["npm", "start"]