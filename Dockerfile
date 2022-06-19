FROM node:16.14.0-alpine

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

# Create app directory
WORKDIR /usr/src/app
# RUN mkdir -R ~/logs
RUN mkdir -p /var/log/server

# Bundle app source
COPY . /usr/src/app

# permissions for logging
RUN chown -R root:node /var/log/server
RUN chmod -R g+wx /var/log/server
# RUN ls -l .
# RUN npm i -g npm@latest

# Install app dependencies & Build
RUN npm i
RUN npm run build
# RUN npx copy './src/**/*.{json,yaml,html,png}' ./dist/src

EXPOSE 9000
USER node
# RUN mkdir -p ~/logs
RUN mkdir -p /var/log/server

CMD ["npm", "start"]