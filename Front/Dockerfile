FROM node:22.9.0-alpine3.19

WORKDIR /app/

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 5173

RUN npm run build

CMD ["npm", "run", "dev"]