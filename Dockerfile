FROM node:16.14.0-alpine

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app

# RUN npm i -g npm@latest

# Install app dependencies & Build
RUN npm i
RUN npm run build
# RUN npx copy './src/**/*.{json,yaml,html,png}' ./dist/src

EXPOSE 9000

CMD ["npm", "start"]