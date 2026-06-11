# Gunakan node versi LTS (cocok dengan package.json kamu)
FROM node:18-alpine

# Tentukan direktori kerja di dalam container
WORKDIR /app

# Salin package.json untuk install dependencies dahulu (agar build lebih cepat)
COPY package*.json ./
RUN npm install --production

# Salin seluruh kode backend ke dalam container
COPY . .

# Ekspos port yang digunakan oleh server.js kamu (misal port 5000)
EXPOSE 5000

# Jalankan server utama
CMD ["node", "server.js"]