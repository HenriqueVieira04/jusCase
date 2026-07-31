FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY server.js meili.js ./

ENV PORT=4001
ENV MEILI_HOST=http://meilisearch:7700
ENV MEILI_KEY=qM83-WdQqSfdoM6-nOw2nyb8SvZs0v0SRNAl6728f-A

EXPOSE 4001

CMD ["node", "server.js"]
