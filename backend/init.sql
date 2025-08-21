-- Initialize IIIT-Una Feed Database
-- This script runs when the MySQL container starts for the first time

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS iiituna_feed CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE iiituna_feed;

-- Create tables (these will be created by JPA, but you can add custom tables here if needed)
-- The application will automatically create the Event and LostFound tables based on the JPA entities

-- Optional: Create indexes for better performance
-- CREATE INDEX idx_event_date ON events(event_date);
-- CREATE INDEX idx_lostfound_type ON lost_found(type);
-- CREATE INDEX idx_lostfound_date ON lost_found(date);

-- Optional: Insert sample data
-- INSERT INTO events (title, description, event_date, location, created_at) VALUES 
-- ('Sample Event 1', 'This is a sample event description', '2024-01-15 10:00:00', 'Main Campus', NOW()),
-- ('Sample Event 2', 'Another sample event description', '2024-01-20 14:00:00', 'Auditorium', NOW());

-- Optional: Insert sample lost and found items
-- INSERT INTO lost_found (title, description, type, date, location, contact_info, created_at) VALUES 
-- ('Lost Laptop', 'Dell XPS 13 laptop with red sticker', 'LOST', '2024-01-10 09:00:00', 'Computer Lab', 'contact@example.com', NOW()),
-- ('Found Keys', 'Set of keys with keychain', 'FOUND', '2024-01-12 16:00:00', 'Library', 'security@example.com', NOW());
