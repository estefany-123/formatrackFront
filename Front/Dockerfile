FROM node:alpine

COPY  package*.json .

COPY  . /app

WORKDIR /app

RUN npm i

EXPOSE 5173

CMD ["npm", "run", "dev"]