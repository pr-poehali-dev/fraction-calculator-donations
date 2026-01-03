-- Create table for advertisements
CREATE TABLE IF NOT EXISTS advertisements (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    ad_title VARCHAR(255) NOT NULL,
    ad_description TEXT NOT NULL,
    ad_url VARCHAR(500),
    image_url VARCHAR(500),
    price_per_day DECIMAL(10, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_confirmed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for active ads query
CREATE INDEX idx_active_ads ON advertisements(status, start_date, end_date) 
WHERE status = 'active' AND payment_confirmed = true;