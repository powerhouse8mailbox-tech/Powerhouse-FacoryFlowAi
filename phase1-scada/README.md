# Factory Automation Phase 1

This repository contains a complete Phase 1 implementation for a factory automation system using Rapid SCADA, Node-RED, and a simulated PLC.

## Architecture

`PLC (Simulated Modbus TCP)` -> `Rapid SCADA` -> `Node-RED` -> `REST API Server`

## 1. Rapid SCADA Setup

### Installation (Windows/Linux)

1. **Download:** Go to [Rapid SCADA Official Website](https://rapidscada.org/download/) and download version 6.x.
2. **Install:** 
   - **Windows:** Run the installer and follow the wizard. Ensure IIS and ASP.NET Core Hosting Bundle are installed.
   - **Linux:** Follow the official guide to install via `apt` or use the official Docker image.
3. **Open Administrator:** Launch the "Administrator" application to configure the project.

### Configuration

#### A. Communication Line (Modbus TCP)
1. In the Administrator, go to **Communication Lines**.
2. Create a new line named `Line 01 - Modbus`.
3. Set **Communication channel type** to `TCP client`.
4. Set **IP address** to your PLC simulator IP (e.g., `127.0.0.1` or the Docker container IP) and **Port** to `5020`.

#### B. Device Template
1. Go to **Device Templates** -> Create new template `Machine_Template.xml`.
2. Add a **Device Group** (e.g., Holding Registers).
3. Add the following elements (Tags):
   - `Status` (Address: 0, Type: UShort)
   - `Temperature` (Address: 1, Type: UShort)
   - `Cycle Time` (Address: 2, Type: UShort)
   - `Production Count` (Address: 3, Type: UShort)

#### C. Input Channels (Tags Mapping)
In the **Channels** table, map the device tags.

| CnlNum | Name | CnlType | Format | Unit | Formula |
|--------|------|---------|--------|------|---------|
| 101 | Machine ID | String | Text | - | "LINE_01" (Static) |
| 102 | Status | Discrete | Enum (0=Stopped, 1=Running) | - | - |
| 103 | Temperature | Analog | Real | °C | Val / 10 |
| 104 | Cycle Time | Analog | Integer | sec | - |
| 105 | Production Count | Analog | Integer | units | - |

*(Note: The formula `Val / 10` for Temperature scales the integer 452 back to 45.2)*

---

## 2. Running the Environment (Docker)

We have provided a `docker-compose.yml` that spins up:
1. **PLC Simulator** (Python Modbus TCP Server on port 5020)
2. **Node-RED** (Port 1880)
3. **API Server** (Express.js on port 3000)

### Steps to Run:

1. Ensure Docker and Docker Compose are installed.
2. Navigate to the `phase1-scada` directory.
3. Run the following command:
   ```bash
   docker-compose up --build -d
   ```
4. Check the logs:
   ```bash
   docker-compose logs -f
   ```

---

## 3. Node-RED Setup

Node-RED is automatically provisioned via Docker with the required nodes (`node-red-contrib-modbus`, `node-red-dashboard`).

1. Open Node-RED: `http://localhost:1880`
2. The flow is pre-loaded from `/node-red/flows.json`.
3. **Flow Explanation:**
   - **Modbus Read:** Polls the PLC Simulator every 2 seconds.
   - **Format JSON:** Transforms the raw Modbus array into the required JSON format.
   - **Send to API:** Makes an HTTP POST request to the API Server.
   - **Dashboard Nodes:** Visualizes the data.

### Dashboard UI
Access the dashboard at: `http://localhost:1880/ui`
You will see:
- Machine Status (Text)
- Temperature (Line Chart)
- Production Count (Gauge)

---

## 4. API Server

The API server is a simple Node.js/Express application.
- **Endpoint:** `POST http://localhost:3000/api/machine-data`
- **View Data:** `GET http://localhost:3000/api/machine-data`

### Example Payload Received:
```json
{
  "machine_id": "LINE_01",
  "status": "running",
  "temperature": 45.2,
  "cycle_time": 30,
  "production_count": 120
}
```

---

## Scalability & Production Suggestions

1. **Message Broker (MQTT):** Instead of direct HTTP POSTs from Node-RED, publish data to an MQTT broker (like Mosquitto or EMQX). The API server or a microservice can subscribe to this broker. This decouples the architecture and handles high throughput better.
2. **Time-Series Database:** Store the machine data in InfluxDB or TimescaleDB instead of in-memory arrays.
3. **Edge Computing:** Deploy Node-RED on an industrial Edge Gateway (e.g., Advantech, Siemens IoT2050) close to the PLC to reduce latency and bandwidth.
4. **Security:** Implement TLS/SSL for Modbus (Modbus Secure) and HTTPS for the REST APIs. Add authentication to Node-RED.
