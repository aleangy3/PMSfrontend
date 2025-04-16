FROM node
WORKDIR /vue
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
