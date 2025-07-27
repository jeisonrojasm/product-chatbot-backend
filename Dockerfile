FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g @nestjs/cli

EXPOSE 3000

CMD ["npm", "run", "start:dev"]