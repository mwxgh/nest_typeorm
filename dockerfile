
###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-bookworm-slim As development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node yarn.lock ./

RUN yarn install --frozen-lockfile

COPY --chown=node:node . .

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-bookworm-slim As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node yarn.lock ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN yarn build

ENV NODE_ENV production

RUN yarn install --immutable --immutable-cache --check-cache --production --ignore-scripts && yarn cache clean

USER node

###################
# PRODUCTION
###################

FROM node:18-bookworm-slim As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node package.json ./

CMD [ "node", "dist/main.js" ]
