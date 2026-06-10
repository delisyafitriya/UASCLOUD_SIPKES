CREATE DATABASE IF NOT EXISTS health_db;
USE health_db;

DROP TABLE IF EXISTS audit_logs, chat_histories, medical_documents, health_records, users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'doctor', 'patient') DEFAULT 'patient',
    status ENUM('pending', 'active') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE health_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    heart_rate INT,
    blood_pressure_sys INT,
    blood_pressure_dia INT,
    temperature DECIMAL(4,2),
    symptoms TEXT,
    ai_analysis TEXT,
    notes TEXT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE medical_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    document_name VARCHAR(255) NOT NULL,
    storage_url VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE chat_histories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    sender ENUM('patient', 'ai') NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    action VARCHAR(100),
    description TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Seed Data
INSERT INTO users (name, email, password_hash, role, status) VALUES 
('Admin Utama', 'admin@mail.com', 'password123', 'admin', 'active'),
('Budi', 'budi@mail.com', 'password123', 'doctor', 'active'),
('Siti', 'siti@mail.com', 'password123', 'doctor', 'pending'),
('Ahmad', 'ahmad@mail.com', 'password123', 'patient', 'active');

INSERT INTO health_records (patient_id, heart_rate, blood_pressure_sys, blood_pressure_dia, temperature, symptoms, ai_analysis) VALUES 
(4, 85, 120, 80, 36.5, 'Sakit kepala sedikit', 'Istirahat yang cukup dan minum air putih.'),
(4, 110, 150, 95, 38.0, 'Demam dan dada berdebar kencang', 'Gejala mengarah pada hipertensi atau demam, segera konsultasikan ke dokter.');
