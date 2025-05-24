-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    objective VARCHAR(50) NOT NULL CHECK (objective IN ('OUTCOME_TRAFFIC', 'OUTCOME_AWARENESS', 'OUTCOME_ENGAGEMENT', 'OUTCOME_LEADS')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('PAUSED', 'ACTIVE')),
    stop_time BIGINT NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create adsets table
CREATE TABLE IF NOT EXISTS adsets (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    campaign_id VARCHAR(255) NOT NULL,
    daily_budget INTEGER NOT NULL,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
);

-- Create ads table
CREATE TABLE IF NOT EXISTS ads (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    adset_id VARCHAR(255) NOT NULL,
    creative_id VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PAUSED', 'ACTIVE')),
    FOREIGN KEY (adset_id) REFERENCES adsets(id) ON DELETE CASCADE
);

-- Insert sample data
-- First insert a demo user
INSERT INTO users (id, email, password, name) VALUES
('user_demo', 'demo@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Demo User')
ON CONFLICT (email) DO NOTHING;

INSERT INTO campaigns (id, name, objective, status, stop_time, user_id) VALUES
('camp_1', 'Holiday Sale Campaign', 'OUTCOME_TRAFFIC', 'ACTIVE', 1735689600, 'user_demo'),
('camp_2', 'Brand Awareness Q1', 'OUTCOME_AWARENESS', 'ACTIVE', 1711929600, 'user_demo'),
('camp_3', 'Lead Generation Campaign', 'OUTCOME_LEADS', 'PAUSED', 1714521600, 'user_demo')
ON CONFLICT (id) DO NOTHING;

INSERT INTO adsets (id, name, campaign_id, daily_budget) VALUES
('adset_1', 'Desktop Traffic', 'camp_1', 5000),
('adset_2', 'Mobile Traffic', 'camp_1', 3000),
('adset_3', 'Brand Reach', 'camp_2', 2000)
ON CONFLICT (id) DO NOTHING;

INSERT INTO ads (id, name, adset_id, creative_id, status) VALUES
('ad_1', 'Holiday Banner', 'adset_1', 'creative_1', 'ACTIVE'),
('ad_2', 'Mobile Holiday Ad', 'adset_2', 'creative_2', 'ACTIVE'),
('ad_3', 'Brand Video', 'adset_3', 'creative_3', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;