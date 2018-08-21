FROM node:8.11.3-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# install mongodb 2.2.33
RUN npm install mongodb@2.2.33

# Bundle app source
COPY . .
COPY mock /usr/src/

EXPOSE 8080
CMD [ "npm", "start" ]
