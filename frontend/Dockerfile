# Gunakan web server Nginx yang super ringan
FROM nginx:alpine

# Hapus halaman default bawaan Nginx
RUN rm -rf /usr/share/nginx/html/*

# Salin seluruh file HTML frontend kamu ke direktori static web Nginx
COPY . /usr/share/nginx/html

# Ekspos port standar web HTTP
EXPOSE 80

# Jalankan Nginx
CMD ["nginx", "-g", "daemon off;"]