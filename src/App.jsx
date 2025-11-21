// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';

import DefinitionsPage from './features/NotificationDefinitions/pages/DefinitionsPage';
import MechanismsPage from './features/DeliveryMechanisms/pages/MechanismsPage';
import EditMechanismForm from './features/DeliveryMechanisms/pages/EditMechanismForm';
import UrlConfigPage from './features/UrlConfiguration/pages/UrlConfigPage';
import ContextApiForm from './features/UrlConfiguration/pages/ContextApiForm'
import CampaignsPage from './features/Campaign/pages/CampaignsPage';
import DefinitionForm from './features/NotificationDefinitions/pages/DefinitionForm';
import MechanismForm from './features/DeliveryMechanisms/pages/MechanismForm';

function App() {
  const [mechanisms, setMechanisms] = useState([
    { id: 1, name: 'SMS', type: 'SQS', created: '2023-11-13 4:48AM PST', updated: '2023-11-13 4:48AM PST' },
    { id: 2, name: 'Banner', type: 'HTTP', created: '2023-11-13 4:50AM PST', updated: '2023-11-13 4:50AM PST' },
    { id: 3, name: 'PUSH', type: 'HTTP', created: '2023-11-13 4:51AM PST', updated: '2023-11-13 4:51AM PST' },
  ]);

  // NEW: state for URL configs
  const [configUrls, setConfigUrls] = useState([
    {
      id: 1,
      apiName: 'GetSiteDetailsAPI',
      hostUrl: 'https://689fc68f1e8b26e2fc71d6a11.mockapi.io/api/',
      method: 'GET',
      headers: '',
    },
    {
      id: 2,
      apiName: 'EnrichAPI',
      hostUrl: 'https://690ae021446b9bcc243765.mockapi.io/scm/',
      method: 'GET',
      headers: '',
    },
  ]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DefinitionsPage />} /> 
          <Route path="definitions" element={<DefinitionsPage />} />
          <Route path="definitions/new" element={<DefinitionForm />} />
          <Route path="definitions/:id/edit" element={<DefinitionForm />} />

          {/* Delivery Mechanisms Routes */}
          <Route path="delivery-mechanisms" element={<MechanismsPage mechanisms={mechanisms} />} />
          <Route path="delivery-mechanisms/new" element={<MechanismForm mechanisms={mechanisms} setMechanisms={setMechanisms} />} />
          <Route path="delivery-mechanisms/:id/edit" element={<EditMechanismForm mechanisms={mechanisms} setMechanisms={setMechanisms} />} />

          <Route path="url-configuration" element={<UrlConfigPage configUrls={configUrls} setConfigUrls={setConfigUrls}/>} />
          <Route path="url-configs/new" element={<ContextApiForm configUrls={configUrls} setConfigUrls={setConfigUrls}/>} />
          <Route path="url-configs/:id/edit" element={<ContextApiForm configUrls={configUrls} setConfigUrls={setConfigUrls}/>} />
          <Route path="campaigns" element={<CampaignsPage />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
