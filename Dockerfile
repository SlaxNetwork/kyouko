# build
FROM node:lts

WORKDIR /build

COPY tsconfig.json ./tsconfig.json
COPY package.json ./package.json

COPY prisma ./prisma
COPY src ./src

RUN yarn && yarn global add typescript
RUN npx prisma generate

RUN tsc -b

# run
FROM node:lts

WORKDIR /app

# COPY configs ./configs
COPY package.json ./package.json

RUN yarn install --production

COPY --from=0 /build/prisma ./prisma
COPY --from=0 /build/dist ./dist

EXPOSE 3000

RUN npx prisma generate
CMD [ "yarn", "start:migrate:prod" ]
