# Apache OFBiz ERP REST API Documentation

## 1. Inventory Management

### Update Inventory (MES -> ERP)
**Endpoint:** `POST /api/inventory/update`
**Description:** Updates inventory levels. Used by MES to increase finished goods or decrease raw materials.

**Request:**
```json
{
  "product_id": "WIDGET_A",
  "quantity": 1,
  "type": "finished_goods",
  "warehouse_id": "WH-MAIN",
  "action": "increase"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "product_id": "WIDGET_A",
  "new_quantity_on_hand": 151,
  "message": "Inventory updated successfully"
}
```

### Get Inventory Status
**Endpoint:** `GET /api/inventory/status`
**Description:** Retrieves current stock levels across all warehouses.

**Response (200 OK):**
```json
[
  {
    "inventory_id": 1,
    "product_id": "WIDGET_A",
    "quantity_on_hand": 151,
    "warehouse_id": "WH-MAIN"
  }
]
```

---

## 2. Procurement

### Trigger Purchase Request
**Endpoint:** `POST /api/purchase/request`
**Description:** Automatically triggered by Node-RED when raw materials fall below the minimum threshold.

**Request:**
```json
{
  "product_id": "RAW_MAT_X",
  "quantity": 500,
  "supplier_id": "SUPPLIER_GLOBAL_INC"
}
```

**Response (201 Created):**
```json
{
  "po_id": 1001,
  "status": "pending",
  "message": "Purchase order generated successfully"
}
```

---

## 3. Production Costing

### Log Production Cost
**Endpoint:** `POST /api/production/cost`
**Description:** Logs the financial cost of a completed work order.

**Request:**
```json
{
  "work_order_id": "WO_1001",
  "product_id": "WIDGET_A",
  "quantity_produced": 100,
  "machine_time_hours": 5.5,
  "labor_cost": 250.00,
  "material_cost": 500.00
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "total_production_cost": 750.00,
  "message": "Production cost tracked successfully"
}
```
