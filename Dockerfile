FROM node:latest


COPY ./package*.json /src/

WORKDIR /src
ARG mode="prod"

RUN if [ "${mode}" = "dev" ] ; then npm install ; else npm install --production ; fi

EXPOSE 3000




CMD if [ "$mode" = "dev" ] ; then npm run debug ; else npm run start ; fi