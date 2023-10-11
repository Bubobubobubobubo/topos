FROM node:lts-alpine as dev

WORKDIR /app
COPY ./ /app

# install dependencies
RUN yarn install

# Run dev
ENTRYPOINT [ "yarn", "run", "dev" ]

FROM node:lts-alpine as build

WORKDIR /app

# copy node modules from dev stage
COPY --from=dev /app/ /app/

# build
RUN yarn run build

FROM nginx:alpine as prod

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]