-- Niramaya Database Schema
-- Run this in PostgreSQL after creating the database

CREATE DATABASE niramaya_db;
\c niramaya_db;

CREATE TYPE severity_level AS ENUM ('CRITICAL', 'HIGH', 'MODERATE', 'LOW');
CREATE TYPE sos_status AS ENUM ('PENDING', 'DISPATCHED', 'EN_ROUTE', 'ARRIVED', 'RESOLVED');

CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INTEGER,
    blood_group VARCHAR(10),
    phone VARCHAR(20),
    medical_history TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE hospitals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    total_beds INTEGER DEFAULT 0,
    available_beds INTEGER DEFAULT 0,
    icu_beds INTEGER DEFAULT 0,
    phone VARCHAR(20),
    specializations TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE ambulances (
    id SERIAL PRIMARY KEY,
    vehicle_number VARCHAR(50) UNIQUE NOT NULL,
    driver_name VARCHAR(255),
    driver_phone VARCHAR(20),
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    hospital_id INTEGER REFERENCES hospitals(id)
);

CREATE TABLE sos_requests (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    patient_lat FLOAT NOT NULL,
    patient_lng FLOAT NOT NULL,
    symptoms TEXT,
    severity severity_level DEFAULT 'MODERATE',
    triage_summary TEXT,
    status sos_status DEFAULT 'PENDING',
    assigned_ambulance_id INTEGER REFERENCES ambulances(id),
    assigned_hospital_id INTEGER REFERENCES hospitals(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE TABLE medical_records (
    id SERIAL PRIMARY KEY,
    sos_id INTEGER REFERENCES sos_requests(id),
    patient_id INTEGER REFERENCES patients(id),
    diagnosis TEXT,
    treatment TEXT,
    medications TEXT,
    doctor_notes TEXT,
    hospital_id INTEGER REFERENCES hospitals(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_sos_status ON sos_requests(status);
CREATE INDEX idx_sos_patient ON sos_requests(patient_id);
CREATE INDEX idx_ambulance_available ON ambulances(is_available);
CREATE INDEX idx_hospital_active ON hospitals(is_active);

-- Sample seed data
INSERT INTO hospitals (name, address, latitude, longitude, total_beds, available_beds, icu_beds, phone, specializations)
VALUES
    ('AIIMS Bhubaneswar', 'Sijua, Patrapada, Bhubaneswar', 20.2960, 85.8245, 500, 45, 12, '06742476789', 'Trauma,Cardiology,Neurology'),
    ('SCB Medical College', 'Manglabag, Cuttack', 20.4686, 85.8830, 800, 102, 20, '06712414000', 'General,Ortho,Pediatrics'),
    ('Capital Hospital', 'Unit 6, Bhubaneswar', 20.2673, 85.8382, 300, 30, 8, '06742391983', 'Emergency,Surgery');

INSERT INTO ambulances (vehicle_number, driver_name, driver_phone, latitude, longitude, is_available)
VALUES
    ('OD-02-AB-1234', 'Ramesh Kumar', '9876543210', 20.2961, 85.8180, TRUE),
    ('OD-02-CD-5678', 'Suresh Nayak', '9876543211', 20.2700, 85.8400, TRUE),
    ('OD-02-EF-9012', 'Priya Das', '9876543212', 20.2800, 85.8300, TRUE);
