CREATE TABLE client (
    client_id SERIAL PRIMARY KEY,        
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    addr_line1 VARCHAR(100) NOT NULL,
    addr_line2 VARCHAR(100),
    phone_number VARCHAR(15) NOT NULL,
    bank_acct_no VARCHAR(20)
);

CREATE TABLE payment_entry (
    payment_id SERIAL PRIMARY KEY,
    client_id INT NOT NULL REFERENCES client(client_id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    rcpt_first_name VARCHAR(50) NOT NULL,
    rcpt_last_name VARCHAR(50) NOT NULL,
    rcpt_bank_name VARCHAR(100) NOT NULL,
    rcpt_acct_no VARCHAR(20) NOT NULL,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'Pending'
);

CREATE INDEX idx_client_last_name ON client(last_name);
CREATE INDEX idx_payment_client_id ON payment_entry(client_id);