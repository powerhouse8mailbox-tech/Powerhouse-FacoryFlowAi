CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    part_number VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE machine (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    line VARCHAR(100) NOT NULL,
    machine_code VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE work_order (
    id SERIAL PRIMARY KEY,
    wo_number VARCHAR(100) UNIQUE NOT NULL,
    product_id INT REFERENCES product(id),
    planned_quantity INT NOT NULL,
    completed_quantity INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'planned' -- planned, in_progress, completed
);

CREATE TABLE production_record (
    id SERIAL PRIMARY KEY,
    machine_id INT REFERENCES machine(id),
    work_order_id INT REFERENCES work_order(id),
    status VARCHAR(50),
    cycle_time INT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- Work Order Automation Logic (Trigger)
-- ==========================================
-- IF machine status = "completed"
-- THEN: Increase completed_quantity & Update work order status

CREATE OR REPLACE FUNCTION update_work_order_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' THEN
        -- 1. Increase completed quantity
        UPDATE work_order
        SET completed_quantity = completed_quantity + 1
        WHERE id = NEW.work_order_id;

        -- 2. Update status to 'completed' if target reached
        UPDATE work_order
        SET status = 'completed'
        WHERE id = NEW.work_order_id AND completed_quantity >= planned_quantity;

        -- 3. Update status to 'in_progress' if just started
        UPDATE work_order
        SET status = 'in_progress'
        WHERE id = NEW.work_order_id AND completed_quantity > 0 AND completed_quantity < planned_quantity AND status = 'planned';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_wo
AFTER INSERT ON production_record
FOR EACH ROW
EXECUTE FUNCTION update_work_order_status();

-- Insert Initial Seed Data
INSERT INTO product (name, part_number) VALUES ('Widget A', 'PN-1001'), ('Widget B', 'PN-1002');
INSERT INTO machine (name, line, machine_code) VALUES ('Assembly Robot 1', 'Line 1', 'LINE_01');
INSERT INTO work_order (wo_number, product_id, planned_quantity, status) VALUES ('WO_1001', 1, 500, 'planned');
