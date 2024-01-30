FROM node:18.19-alpine

RUN apk add g++ make
RUN apk add openssl-dev

RUN mkdir -p /app
WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm install
RUN npx playwright install

COPY . .

EXPOSE 9323

# Start the app
CMD ["npm", "test”]