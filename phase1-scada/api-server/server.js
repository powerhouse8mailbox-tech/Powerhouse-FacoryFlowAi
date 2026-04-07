const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// In-memory store
const machineDataStore = [];

app.post('/api/machine-data', (req, res) => {
    try {
        const data = req.body;
        
        // Basic validation
        if (!data.machine_id) {
            return res.status(400).json({ error: 'machine_id is required' });
        }

        // Add timestamp
        const record = {
            ...data,
            timestamp: new Date().toISOString()
        };

        machineDataStore.push(record);
        
        // Keep only last 100 records to prevent memory leak
        if (machineDataStore.length > 100) {
            machineDataStore.shift();
        }

        console.log(`[${record.timestamp}] Received Data:`, JSON.stringify(record));
        res.status(201).json({ message: 'Data received successfully', record });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/machine-data', (req, res) => {
    res.json(machineDataStore);
});

app.listen(port, () => {
    console.log(`API Server listening on port ${port}`);
});
