-- Create table for visitor statistics
CREATE TABLE IF NOT EXISTS visitors (
    id SERIAL PRIMARY KEY,
    visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
    visit_count INTEGER NOT NULL DEFAULT 0,
    UNIQUE(visit_date)
);

-- Insert initial record for today
INSERT INTO visitors (visit_date, visit_count) 
VALUES (CURRENT_DATE, 0) 
ON CONFLICT (visit_date) DO NOTHING;