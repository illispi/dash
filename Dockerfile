FROM node:22-alpine AS build


WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

RUN chmod +x ./entrypoint.sh

ENV NODE_ENV=production

EXPOSE 3000

ENV PORT 3000

ENTRYPOINT ["./entrypoint.sh"]
CMD ["run"]

# CMD ["node", "server.js"]