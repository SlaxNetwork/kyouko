# build
FROM node:19

WORKDIR /build

COPY tsconfig.json ./tsconfig.json
COPY package.json ./package.json

COPY prisma ./prisma
COPY src ./src

RUN npm install && npm install typescript -g
RUN npx prisma generate

RUN tsc -b

# run
FROM node:19

WORKDIR /app

COPY configs ./configs
COPY package.json ./package.json

RUN npm install --production

COPY --from=0 /build/prisma ./prisma
COPY --from=0 /build/dist ./dist

EXPOSE 3000

RUN npx prisma generate
CMD [ "npm", "run", "start:migrate:prod" ]
