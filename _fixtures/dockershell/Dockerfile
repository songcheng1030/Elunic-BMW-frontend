ARG NODE_VERSION
FROM node:${NODE_VERSION}-buster

ENV PATH /app/node_modules/.bin:$PATH

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -yq google-chrome-stable \
    && apt-get install -yq jq nano bash-completion \
    && npm completion > /etc/bash_completion.d/npm

ARG NG_VERSION
ARG NPM_VERSION
RUN npm install -g "npm@^${NPM_VERSION}" \
    && npm install -g "@angular/cli@^${NG_VERSION}"
