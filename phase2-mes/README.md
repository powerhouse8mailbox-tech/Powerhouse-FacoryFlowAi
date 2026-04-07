# Factory Automation Phase 2: MES Integration

This repository contains Phase 2 of the factory automation system, integrating Rapid SCADA with qcadoo MES via Node-RED.

## 🏗️ Architecture & Integration Flow

`PLC` -> `Rapid SCADA` -> `Node-RED` -> `qcadoo MES API` -> `PostgreSQL Database`

1. **SCADA Layer:** Rapid SCADA reads Modbus data from the PLC.
2. **Integration Layer (Node-RED):** Node-RED receives raw SCADA data, detects when a machine completes a cycle, and transforms the data into the MES JSON format.
3. **MES Layer (qcadoo):** Node-RED calls the qcadoo REST API (`POST /api/production-records`).
4. **Database Layer (PostgreSQL):** The database stores the record. A SQL Trigger automatically increments the `completed_quantity` on the active Work Order and updates its status (`planned` -> `in_progress` -> `completed`).

---

## 1. qcadoo Installation & Setup

We provide a Docker Compose setup for the MES database and application.

1. Navigate to `/phase2-mes/qcadoo/`
2. Run the stack:
   ```bash
   docker-compose up -d
   ```
3. **Database Initialization:** The PostgreSQL container will automatically execute `/database/init.sql` on first startup, creating the schema, triggers, and seed data.
4. **Default Access:** 
   - URL: `http://localhost:8080`
   - Username: `admin`
   - Password: `admin`

---

## 2. Node-RED Configuration

1. Import `/phase2-mes/node-red-flows/mes-integration.json` into your Node-RED instance.
2. **Flow Features:**
   - **Data Mapping:** Converts SCADA variables to MES entities.
   - **Error Handling & Retries:** If the qcadoo API is down, the `Catch` node intercepts the error. The flow retries up to 3 times with a 5-second delay.
   - **Dead-Letter Queue:** If all retries fail, the data is logged to a local file (`/data/dead-letter-queue.log`) to prevent data loss.

---

## 3. Dashboard UI (qcadoo Customization)

In qcadoo, navigate to the custom dashboards to view:
- **Production Dashboard:** Real-time OEE, cycle times, and machine states.
- **Work Order Progress:** A Kanban-style or list view showing `Planned`, `In Progress`, and `Completed` orders with progress bars based on `completed_quantity / planned_quantity`.
- **Machine Status Board:** Live view of `LINE_01` and others.

*(Note: In the AI Studio preview, we have simulated this dashboard in the React frontend).*

---

## 4. Scalability Suggestions

1. **Message Queues (Kafka/RabbitMQ):** Replace the Node-RED HTTP calls with a message broker. Node-RED publishes to `mes.production.records`, and a microservice consumes it to write to qcadoo. This ensures zero data loss during MES downtime.
2. **Database Sharding:** As production records grow massively, partition the `production_record` table by date (e.g., monthly partitions in PostgreSQL).
3. **Caching:** Use Redis to cache active Work Orders to reduce database lookups during high-frequency API calls.
