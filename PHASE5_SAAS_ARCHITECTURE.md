# Phase 5: SaaS Platform + AI Intelligence + Production Deployment

## 🏗️ 1. SaaS Multi-Tenant Architecture

We use a **Shared Database, Isolated Schema** approach for PostgreSQL (ERP/MES) and a **Shared Database with `tenant_id`** approach for TimescaleDB (SCADA telemetry) to balance scalability and isolation.

### Tenant Data Model (PostgreSQL)
```sql
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    plan VARCHAR(50) DEFAULT 'basic',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example of a tenant-aware table
CREATE TABLE machines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    status VARCHAR(50)
);

-- Row Level Security (RLS) for Tenant Isolation
ALTER TABLE machines ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON machines
    USING (tenant_id = current_setting('app.current_tenant')::UUID);
```

---

## 🧠 2. AI Services (FastAPI + Scikit-Learn/TensorFlow)

**File: `/ai-services/main.py`**
```python
from fastapi import FastAPI, Depends, HTTPException, Header
from pydantic import BaseModel
import numpy as np
import joblib
from typing import List

app = FastAPI(title="FactoryFlow AI Services")

# Load pre-trained models (Mock paths)
# model_predictive = joblib.load("models/predictive_maintenance.pkl")
# model_anomaly = joblib.load("models/anomaly_detection.pkl")

class MachineTelemetry(BaseModel):
    machine_id: str
    temperature: float
    vibration: float
    cycle_time: float

class DemandHistory(BaseModel):
    product_id: str
    historical_sales: List[int]

def verify_tenant(x_tenant_id: str = Header(...)):
    if not x_tenant_id:
        raise HTTPException(status_code=401, detail="Missing Tenant ID")
    return x_tenant_id

@app.post("/api/ai/predictive-maintenance")
async def predict_failure(data: MachineTelemetry, tenant_id: str = Depends(verify_tenant)):
    # Feature extraction
    features = np.array([[data.temperature, data.vibration, data.cycle_time]])
    
    # Mock prediction logic (replace with model_predictive.predict_proba)
    risk_score = (data.temperature * 0.4 + data.vibration * 0.6) / 100.0
    failure_probability = min(max(risk_score, 0.0), 1.0)
    
    return {
        "machine_id": data.machine_id,
        "failure_probability": failure_probability,
        "status": "Critical" if failure_probability > 0.8 else "Healthy",
        "estimated_days_to_failure": int((1.0 - failure_probability) * 100)
    }

@app.post("/api/ai/anomaly-detection")
async def detect_anomaly(data: MachineTelemetry, tenant_id: str = Depends(verify_tenant)):
    # Mock Isolation Forest prediction
    is_anomaly = data.vibration > 8.5 or data.temperature > 95.0
    return {
        "machine_id": data.machine_id,
        "anomaly_detected": is_anomaly,
        "confidence": 0.92 if is_anomaly else 0.99
    }

@app.post("/api/ai/demand-forecast")
async def forecast_demand(data: DemandHistory, tenant_id: str = Depends(verify_tenant)):
    # Mock ARIMA/LSTM forecasting
    avg_sales = sum(data.historical_sales) / len(data.historical_sales) if data.historical_sales else 0
    forecast = [int(avg_sales * (1 + (i * 0.05))) for i in range(1, 5)] # Next 4 weeks
    
    return {
        "product_id": data.product_id,
        "forecast_next_4_weeks": forecast
    }
```

---

## 🚀 3. Deployment Architecture (Kubernetes)

**File: `/deployment/k8s/ai-services-deployment.yaml`**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: factoryflow-ai-services
  namespace: factoryflow-prod
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ai-services
  template:
    metadata:
      labels:
        app: ai-services
    spec:
      containers:
      - name: ai-services
        image: registry.factoryflow.io/ai-services:v1.2.0
        ports:
        - containerPort: 8000
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
        env:
        - name: MODEL_STORAGE_PATH
          value: "/models"
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ai-services-hpa
  namespace: factoryflow-prod
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: factoryflow-ai-services
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 75
```

---

## 🔄 4. CI/CD Pipeline (GitHub Actions)

**File: `/.github/workflows/production.yml`**
```yaml
name: Production Deployment

on:
  push:
    branches: [ "main" ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
      
    - name: Login to Container Registry
      uses: docker/login-action@v2
      with:
        registry: registry.factoryflow.io
        username: ${{ secrets.REGISTRY_USER }}
        password: ${{ secrets.REGISTRY_PASSWORD }}
        
    - name: Build and Push AI Services
      uses: docker/build-push-action@v4
      with:
        context: ./ai-services
        push: true
        tags: registry.factoryflow.io/ai-services:${{ github.sha }}
        
    - name: Set up Kubectl
      uses: azure/setup-kubectl@v3
      
    - name: Deploy to Kubernetes
      run: |
        kubectl set image deployment/factoryflow-ai-services ai-services=registry.factoryflow.io/ai-services:${{ github.sha }} -n factoryflow-prod
        kubectl rollout status deployment/factoryflow-ai-services -n factoryflow-prod
```

---

## 💳 5. Billing & Subscription System

**File: `/billing-service/models.js`**
```javascript
const PLANS = {
  BASIC: {
    id: 'plan_basic',
    name: 'Basic',
    price: 499, // $499/mo
    features: ['Up to 5 Machines', 'Standard Dashboards', '7-day Data Retention'],
    limits: { machines: 5, users: 10 }
  },
  PRO: {
    id: 'plan_pro',
    name: 'Pro',
    price: 1299, // $1299/mo
    features: ['Up to 20 Machines', 'AI Predictive Maintenance', '30-day Data Retention', 'ERP Integration'],
    limits: { machines: 20, users: 50 }
  },
  ENTERPRISE: {
    id: 'plan_enterprise',
    name: 'Enterprise',
    price: 3999, // $3999/mo
    features: ['Unlimited Machines', 'Custom AI Models', 'Unlimited Data Retention', 'Dedicated Support'],
    limits: { machines: 9999, users: 9999 }
  }
};
```

---

## 🔐 6. Security & API Gateway

We use **Kong** or **NGINX Ingress** as the API Gateway to handle:
1. **SSL/TLS Termination**
2. **JWT Validation** (verifying the token signature before routing to microservices)
3. **Rate Limiting** (preventing DDoS and enforcing billing limits)

**Example Kong Plugin Config for JWT:**
```yaml
apiVersion: configuration.konghq.com/v1
kind: KongPlugin
metadata:
  name: jwt-auth
config:
  claims_to_verify:
  - exp
  key_claim_name: kid
plugin: jwt
```
