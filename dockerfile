FROM node:20.11.0

# RUN apk add g++ make
# RUN apk add openssl-dev

RUN mkdir -p /app
WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm install
RUN npx playwright install

RUN npx playwright install-deps 

COPY . .

# Start the app
CMD ["npm", "test"]