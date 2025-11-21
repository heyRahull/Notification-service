const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store (later we can connect DB)
let mechanisms = [
  { id: 1, name: 'SMS', type: 'SQS', created: '2023-11-13 4:48AM PST', updated: '2023-11-13 4:48AM PST' },
  { id: 2, name: 'Banner', type: 'HTTP', created: '2023-11-13 4:50AM PST', updated: '2023-11-13 4:50AM PST' },
];

// GET all mechanisms
app.get('/api/mechanisms', (req, res) => {
  res.json(mechanisms);
});

// GET single mechanism
app.get('/api/mechanisms/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const mechanism = mechanisms.find(m => m.id === id);
  if (!mechanism) return res.status(404).json({ error: 'Not found' });
  res.json(mechanism);
});

// POST create new mechanism
app.post('/api/mechanisms', (req, res) => {
  const newMechanism = {
    id: mechanisms.length + 1,
    ...req.body,
    created: new Date().toLocaleString('en-US', { hour12: true }),
    updated: new Date().toLocaleString('en-US', { hour12: true }),
  };
  mechanisms.push(newMechanism);
  res.status(201).json(newMechanism);
});

// PUT update mechanism
app.put('/api/mechanisms/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = mechanisms.findIndex(m => m.id === id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });

  mechanisms[index] = {
    ...mechanisms[index],
    ...req.body,
    updated: new Date().toLocaleString('en-US', { hour12: true }),
  };
  res.json(mechanisms[index]);
});

// ---------------------- New URL configs store & routes ----------------------
let configs = [
    // 1. STANDARD DATA ENRICHMENT (GET)
    {
        id: 1,
        apiName: 'GET_USER_PROFILE',
        hostUrl: 'https://user-data.internal.com/api/v2/profiles/[user_id]',
        method: 'GET',
        // Authorization token needed for security
        headers: [
            { key: 'Authorization', value: 'Bearer a1b2c3d4e5f6g7h8' }
        ], 
        requestBody: '',
        isPaginated: false, // This is the checkbox value (unchecked)
        
    },
    
    // 2. LOGGING/OUTBOUND EVENT (POST with Request Body)
    {
        id: 2,
        apiName: 'POST_NOTIFICATION_STATUS_LOG',
        hostUrl: 'https://activity-log.internal.com/api/v1/events',
        method: 'POST',
        headers: [
            { key: 'Content-Type', value: 'application/json' }
        ],
        // The body contains the structured data to be sent to the logging service
        requestBody: JSON.stringify({
            event_type: "NOTIFICATION_SENT",
            mechanism_id: "[mechanism_id]",
            user_id: "[user_id]",
            status: "SUCCESS"
        }),
        isPaginated: false,
     
    },
    
    // 3. FETCHING LARGE DATA SETS (GET with Pagination)
    {
        id: 3,
        apiName: 'GET_CAMPAIGN_AUDIENCE',
        hostUrl: 'https://crm.internal.com/api/customers',
        method: 'GET',
        headers: [
             { key: 'x-api-key', value: 'CRM-ABC-123' }
        ],
        requestBody: '',
        isPaginated: true, // This is the checkbox value (checked)
       
    },

    // 4. TRANSACTIONAL DETAILS (GET with Headers)
    {
        id: 4,
        apiName: 'GET_ORDER_TRACKING_DETAILS',
        hostUrl: 'https://fulfillment.internal.com/api/orders/[order_id]/tracking',
        method: 'GET',
        // Accept header ensures the service knows the desired format
        headers: [
            { key: 'Accept', value: 'application/json' }
        ],
        requestBody: '',
        isPaginated: false,
    },

    // 5. COMPLEX FILTERED DATA (POST for complex query)
    {
        id: 5,
        apiName: 'GET_FILTERED_DEVICES',
        hostUrl: 'https://iot.service.com/api/v1/devices/query',
        method: 'POST', 
        headers: [
            { key: 'Content-Type', value: 'application/json' }
        ],
        // Sends complex filter criteria in the body to get a list of devices
        requestBody: JSON.stringify({
            filter_by: "low_battery",
            last_checked: "[current_timestamp]",
            user_region: "[region_code]"
        }),
        isPaginated: false,
  
    }
];

const nextConfigId = () =>
  configs.length ? Math.max(...configs.map(c => Number(c.id))) + 1 : 1;

// GET all configs
app.get('/api/configs', (req, res) => {
  res.json(configs);
});

// GET single config
app.get('/api/configs/:id', (req, res) => {
  const id = Number(req.params.id);
  const found = configs.find(c => Number(c.id) === id);
  if (!found) return res.status(404).json({ error: 'Not found' });
  res.json(found);
});

// POST create config
app.post('/api/configs', (req, res) => {
  const { apiName, hostUrl, method = 'GET', headers = [], requestBody = '', isPaginated = false } = req.body;

  if (!apiName || !hostUrl) {
    return res.status(400).json({ error: 'apiName and hostUrl are required' });
  }

  const newConfig = {
    id: nextConfigId(),
    apiName: String(apiName).trim(),
    hostUrl: String(hostUrl).trim(),
    method,
    headers: Array.isArray(headers) ? headers : (headers ? [headers] : []),
    requestBody,
    isPaginated,
  };

  configs.push(newConfig);
  res.status(201).json(newConfig);
});

// PUT update config
app.put('/api/configs/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = configs.findIndex(c => Number(c.id) === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  const { apiName, hostUrl, method, headers, requestBody, isPaginated } = req.body;

  const updated = {
    ...configs[idx],
    ...(apiName !== undefined ? { apiName: String(apiName).trim() } : {}),
    ...(hostUrl !== undefined ? { hostUrl: String(hostUrl).trim() } : {}),
    ...(method !== undefined ? { method } : {}),
    ...(headers !== undefined
      ? { headers: Array.isArray(headers) ? headers : (headers ? [headers] : []) }
      : {}),
    ...(requestBody !== undefined ? { requestBody } : {}),
    ...(isPaginated !== undefined ? { isPaginated } : {}),
  };

  configs[idx] = updated;
  res.json(updated);
});

// DELETE config (optional)
app.delete('/api/configs/:id', (req, res) => {
  const id = Number(req.params.id);
  const before = configs.length;
  configs = configs.filter(c => Number(c.id) !== id);
  if (configs.length === before) return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
