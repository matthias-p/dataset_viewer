FROM node:18 as build-stage

WORKDIR /frontend

RUN npm install -g @angular/cli
COPY package*.json .
RUN npm install

COPY . .

ARG configuration=production

RUN ng build


FROM nginx:latest
COPY --from=build-stage /frontend/dist/frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf