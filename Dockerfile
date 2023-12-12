FROM node:14

# Create app directory
WORKDIR /app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
ENV HTTP_PROXY "http://proxylab.ucab.edu.ve:3128"
ENV HTTPS_PROXY "http://proxylab.ucab.edu.ve:3128"
RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev
# Bundle app source
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]
