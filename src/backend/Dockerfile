# Backend Dockerfile với hot-reload support
FROM node:20-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy package files
COPY package*.json ./

# Cài đặt dependencies (bao gồm nodemon)
RUN npm install

# Copy toàn bộ source code
COPY . .

# Expose port
EXPOSE 5000

# Sử dụng nodemon để tự động restart khi có thay đổi
CMD ["npm", "run", "dev"]