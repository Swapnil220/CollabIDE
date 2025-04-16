FROM node:16

WORKDIR /nodejs

COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "execution_server.js"]