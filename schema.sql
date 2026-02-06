-- Database Schema for FarmLokal

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data (Sample Products)
INSERT INTO products (name, category, price, stock) VALUES
('Organic Tomatoes', 'Vegetables', 45.00, 100),
('Fresh Potato', 'Vegetables', 30.00, 200),
('Desi Ghee', 'Dairy', 650.00, 50),
('Cow Milk (1L)', 'Dairy', 60.00, 50),
('Basmati Rice', 'Grains', 120.00, 150),
('Wheat Flour (10kg)', 'Grains', 450.00, 30),
('Green Chilli', 'Vegetables', 80.00, 80),
('Fresh Paneer', 'Dairy', 350.00, 40),
('Red Onions', 'Vegetables', 50.00, 120),
('Garlic', 'Vegetables', 140.00, 60);
