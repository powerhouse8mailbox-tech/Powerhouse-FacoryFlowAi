# Factory Automation Phase 3: ERP Integration

This repository contains Phase 3 of the factory automation system, integrating the qcadoo MES with Apache OFBiz (ERP) via Node-RED.

## 🏗️ Architecture & Integration Flow

`MES (qcadoo)` -> `Node-RED` -> `Apache OFBiz (ERP)` -> `PostgreSQL Database`

1. **MES Layer:** qcadoo manages the shop floor. When a Work Order is completed, it sends a webhook to Node-RED.
2. **Integration Layer (Node-RED):** Node-RED receives the completion event and orchestrates the ERP updates:
   - Maps data to update Finished Goods inventory.
   - Calculates Raw Material consumption (BOM explosion) and updates inventory.
   - Calculates Production Costs (Labor, Machine, Material).
   - Checks Raw Material thresholds and triggers Auto-Procurement if needed.
3. **ERP Layer (Apache OFBiz):** Receives REST API calls to update the general ledger, inventory modules, and procurement modules.
4. **Database Layer:** PostgreSQL stores the ERP entities with full audit logging.

---

## 1. Apache OFBiz Installation & Setup

We provide a Docker Compose setup for the ERP database and application.

1. Navigate to `/phase3-erp/ofbiz/`
2. Run the stack:
   ```bash
   docker-compose up -d
   ```
3. **Database Initialization:** The PostgreSQL container will automatically execute `/database/init.sql` on first startup, creating the schema, multi-warehouse setup, and audit logs.
4. **Default Modules Enabled:** Inventory, Order Management, Accounting, Manufacturing.

---

## 2. Business Logic Defined

### A. Inventory Logic
- **Finished Goods:** Increased automatically when MES reports a completed Work Order.
- **Raw Materials:** Decreased automatically based on the Bill of Materials (BOM) when a Work Order is completed.

### B. Procurement Logic
- **Auto-Reorder:** Node-RED continuously monitors the Raw Material stock levels. If `RAW_MAT_X` falls below the `minimum_stock_level` (e.g., 100 units), Node-RED automatically calls the ERP `/api/purchase/request` endpoint to generate a Purchase Order for the supplier.

### C. Sales Logic
- **Sales Readiness:** Sales Orders can only be fulfilled if the Finished Goods inventory in the ERP is greater than the requested quantity.

---

## 3. Node-RED Configuration

1. Import `/phase3-erp/node-red-flows/erp-integration.json` into your Node-RED instance.
2. **Flow Features:**
   - **Parallel Processing:** Updates inventory, checks thresholds, and calculates costs simultaneously.
   - **Retry Mechanism (Bonus):** If the ERP API is down, the `Catch` node intercepts the error. The flow retries up to 3 times with a 10-second delay.
   - **Dead-Letter Queue:** If all retries fail, the data is logged to `/data/erp-dead-letter-queue.log`.

---

## 4. Bonus Features Implemented

1. **Audit Logs:** The SQL schema includes an `erp_audit_log` table to track every change to inventory or orders, including *who* made the change (Role-Based Access Tracking).
2. **Multi-Warehouse Support:** The SQL schema includes an `erp_warehouse` table. Inventory is tracked per warehouse (e.g., `WH-MAIN` for finished goods, `WH-RAW` for raw materials).
3. **API Retry Logic:** Implemented robustly in the Node-RED flow.
