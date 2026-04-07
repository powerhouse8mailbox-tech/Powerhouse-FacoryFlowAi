# FactoryFlow AI - Backend API Documentation

## Base URL
`http://localhost:3000/api`

## Authentication

All endpoints (except `/auth/register` and `/auth/login`) require a JWT token in the `Authorization` header:
`Authorization: Bearer <token>`

### 1. Register User & Tenant
**POST** `/auth/register`
```json
{
  "email": "admin@factoryflow.io",
  "password": "securepassword",
  "tenant_name": "Stark Industries",
  "role": "factory_admin"
}
```

### 2. Login
**POST** `/auth/login`
```json
{
  "email": "admin@factoryflow.io",
  "password": "securepassword"
}
```

---

## Tenant Management

### 1. Get Current Tenant
**GET** `/tenants/me`
Returns the details of the tenant associated with the authenticated user.

---

## Machine Management

### 1. Get Machines
**GET** `/machines`
Returns a list of machines for the current tenant.

### 2. Add Machine
**POST** `/machines`
```json
{
  "name": "CNC-Milling-01",
  "type": "Milling"
}
```

---

## Production Management

### 1. Get Production Records
**GET** `/production`
Returns production records for the current tenant.

### 2. Update Production
**POST** `/production/update`
```json
{
  "machine_id": "<uuid>",
  "work_order_id": "WO-1001",
  "product_name": "Steel Bracket",
  "quantity_produced": 50,
  "status": "completed"
}
```

---

## Inventory Management

### 1. Get Inventory
**GET** `/inventory`
Returns current inventory levels.

### 2. Update Inventory
**POST** `/inventory/update`
```json
{
  "product_id": "RAW-STEEL-01",
  "type": "raw_material",
  "quantity": 500,
  "location": "Warehouse A"
}
```

---

## AI Services

### 1. Predict Machine Failure
**POST** `/ai/predict`
```json
{
  "machine_id": "<uuid>",
  "temperature": 75.5,
  "vibration": 4.2,
  "cycle_time": 12.5
}
```

---

## SCADA Integration

### 1. Ingest SCADA Telemetry
**POST** `/scada/data`
```json
{
  "machine_id": "<uuid>",
  "temperature": 75.5,
  "vibration": 4.2,
  "cycle_time": 12.5
}
```
*Note: In a production environment, this endpoint would handle high-throughput data, potentially routing it to a message broker like Kafka or MQTT before saving to TimescaleDB.*
