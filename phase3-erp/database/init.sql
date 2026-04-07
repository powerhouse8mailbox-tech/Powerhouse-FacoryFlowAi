CREATE TABLE erp_product (
    product_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('raw_material', 'finished_goods')),
    minimum_stock_level INT DEFAULT 0,
    unit_cost DECIMAL(10, 2) DEFAULT 0.00
);

CREATE TABLE erp_warehouse (
    warehouse_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL
);

CREATE TABLE erp_inventory_item (
    inventory_id SERIAL PRIMARY KEY,
    product_id VARCHAR(50) REFERENCES erp_product(product_id),
    warehouse_id VARCHAR(50) REFERENCES erp_warehouse(warehouse_id),
    quantity_on_hand INT NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE erp_work_order (
    work_order_id VARCHAR(50) PRIMARY KEY,
    product_id VARCHAR(50) REFERENCES erp_product(product_id),
    quantity_produced INT NOT NULL,
    machine_time_hours DECIMAL(10, 2),
    labor_cost DECIMAL(10, 2),
    material_cost DECIMAL(10, 2),
    total_production_cost DECIMAL(10, 2),
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE erp_purchase_order (
    po_id SERIAL PRIMARY KEY,
    supplier_id VARCHAR(100) NOT NULL,
    product_id VARCHAR(50) REFERENCES erp_product(product_id),
    quantity INT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'shipped', 'received')),
    ordered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE erp_sales_order (
    so_id SERIAL PRIMARY KEY,
    customer_id VARCHAR(100) NOT NULL,
    product_id VARCHAR(50) REFERENCES erp_product(product_id),
    quantity INT NOT NULL,
    status VARCHAR(50) DEFAULT 'created' CHECK (status IN ('created', 'processing', 'shipped', 'delivered')),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE erp_audit_log (
    log_id SERIAL PRIMARY KEY,
    entity_name VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    changed_by VARCHAR(100) NOT NULL, -- For Role-Based Access Tracking
    change_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details JSONB
);

-- Seed Data
INSERT INTO erp_product (product_id, name, type, minimum_stock_level, unit_cost) VALUES 
('WIDGET_A', 'Widget A', 'finished_goods', 100, 50.00),
('RAW_MAT_X', 'Raw Material X', 'raw_material', 500, 5.00);

INSERT INTO erp_warehouse (warehouse_id, name, location) VALUES 
('WH-MAIN', 'Main Distribution Center', 'New York'),
('WH-RAW', 'Raw Materials Storage', 'New Jersey');

INSERT INTO erp_inventory_item (product_id, warehouse_id, quantity_on_hand) VALUES 
('WIDGET_A', 'WH-MAIN', 150),
('RAW_MAT_X', 'WH-RAW', 600);
