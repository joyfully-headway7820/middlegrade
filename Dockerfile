FROM node:alpine as Frontend
WORKDIR ./
COPY ./ ./
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]

FROM go:alpine as Backend
WORKDIR ./
COPY ./ ./
RUN go build -o main .

EXPOSE 8080

CMD ["./main"]