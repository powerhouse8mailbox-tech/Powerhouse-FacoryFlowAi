# qcadoo MES REST API Documentation

## 1. Work Orders API

### Create Work Order
**Endpoint:** `POST /api/workorders`
**Description:** Creates a new work order in the MES.

**Request:**
```json
{
  "wo_number": "WO_1002",
  "product_id": 1,
  "planned_quantity": 1000
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "wo_number": "WO_1002",
  "status": "planned",
  "message": "Work order created successfully"
}
```

### Get Work Orders
**Endpoint:** `GET /api/workorders?status=in_progress`
**Description:** Retrieves a list of work orders.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "wo_number": "WO_1001",
    "product_id": 1,
    "planned_quantity": 500,
    "completed_quantity": 120,
    "status": "in_progress"
  }
]
```

---

## 2. Production Records API

### Submit Production Record
**Endpoint:** `POST /api/production-records`
**Description:** Records a completed cycle from a machine. This triggers the database logic to automatically update the Work Order quantities and status.

**Request:**
```json
{
  "machine_id": "LINE_01",
  "work_order_id": "WO_1001",
  "status": "completed",
  "cycle_time": 30
}
```

**Response (201 Created):**
```json
{
  "id": 4502,
  "machine_id": "LINE_01",
  "work_order_id": "WO_1001",
  "status": "completed",
  "recorded_at": "2026-04-07T08:15:00Z",
  "message": "Production record logged."
}
```

### Get Production Records
**Endpoint:** `GET /api/production-records?machine_id=LINE_01&limit=10`
**Description:** Retrieves recent production records for traceability.

**Response (200 OK):**
```json
[
  {
    "id": 4502,
    "machine_id": "LINE_01",
    "work_order_id": "WO_1001",
    "status": "completed",
    "cycle_time": 30,
    "recorded_at": "2026-04-07T08:15:00Z"
  }
]
```
