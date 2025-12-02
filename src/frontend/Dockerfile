# Frontend Dockerfile với Vite HMR (Hot Module Replacement)
FROM node:20-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy package files
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ source code
COPY . .

# Expose port cho Vite dev server
EXPOSE 8080

# Chạy Vite dev server với HMR
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]