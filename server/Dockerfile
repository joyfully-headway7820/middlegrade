FROM node:22.13.0-alpine

WORKDIR ./
COPY ./ ./

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]