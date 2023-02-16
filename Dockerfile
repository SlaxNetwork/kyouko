# build
FROM node:19

WORKDIR /build

COPY tsconfig.json ./tsconfig.json
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json

COPY prisma ./prisma
COPY src ./src

RUN npm install && npm install typescript -g

RUN npx prisma generate
RUN tsc -b

# run
FROM node:19

WORKDIR /app

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json

# RUN npm install --production

COPY --from=0 /build/node_modules ./node_modules
COPY --from=0 /build/dist ./dist

EXPOSE 3000

CMD [ "npm", "start" ]