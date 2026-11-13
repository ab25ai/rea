FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production STOCKY_PORT=4173 STOCKY_HOST=0.0.0.0
COPY --chown=node:node server.mjs index.html app.js styles.css ./
USER node
EXPOSE 4173
CMD ["node", "server.mjs"]
