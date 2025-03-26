FROM node:18-alpine 
WORKDIR /app
COPY . .
RUN npm install --no-save
EXPOSE 5173
CMD ["npm", "start", "--", "--host", "0.0.0.0"]
