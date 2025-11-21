import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Campaign() {
  const navigate = useNavigate();

  // Dummy defs used when backend is empty/unreachable
  const DUMMY_DEFS = [
    { id: '1', name: 'Grid Outage', exampleRequest: { push: true, outageId: 'OUT-123' } },
    { id: '2', name: 'Push', exampleRequest: { push: true, message: 'Test push' } },
  ];

  const [definitions, setDefinitions] = useState(DUMMY_DEFS);
  const [selectedId, setSelectedId] = useState('');
  const [requestBody, setRequestBody] = useState('');
  const [loadingDefs, setLoadingDefs] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let aborted = false;
    const load = async () => {
      setLoadingDefs(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:5000/api/notification-definitions');
        if (!res.ok) throw new Error(`Failed to load (${res.status})`);
        const data = await res.json();

        // Normalize ids to strings for consistent comparisons
        const normalized = Array.isArray(data)
          ? data.map((d) => ({ ...d, id: String(d.id) }))
          : [];

        if (!aborted) setDefinitions(normalized.length ? normalized : DUMMY_DEFS);
      } catch (err) {
        if (!aborted) {
          console.error('Load defs error', err);
          setDefinitions(DUMMY_DEFS);
          setError(null); // keep UI clean; user can still use dummy defs
        }
      } finally {
        if (!aborted) setLoadingDefs(false);
      }
    };
    load();
    return () => { aborted = true; };
  }, []);

  // Auto-fill requestBody when a definition is selected
  useEffect(() => {
    if (!selectedId) {
      setRequestBody('');
      return;
    }
    const selected = definitions.find((d) => String(d.id) === String(selectedId));
    if (selected) {
      if (selected.exampleRequest) {
        try {
          const formatted = typeof selected.exampleRequest === 'string'
            ? JSON.parse(selected.exampleRequest)
            : selected.exampleRequest;
          setRequestBody(JSON.stringify(formatted, null, 2));
        } catch {
          setRequestBody(String(selected.exampleRequest));
        }
      } else {
        setRequestBody(JSON.stringify({ filters: {}, metadata: {} }, null, 2));
      }
    } else {
      setRequestBody('');
    }
  }, [selectedId, definitions]);

  const isFormValid = () => {
    if (!selectedId) return false;
    if (!requestBody || !requestBody.trim()) return false;
    try {
      JSON.parse(requestBody);
      return true;
    } catch {
      return false;
    }
  };

  const handleTrigger = async (e) => {
    e.preventDefault();
    setError(null);
    if (!isFormValid()) {
      setError('Please select a definition and provide valid JSON request body.');
      return;
    }

    let parsedBody;
    try {
      parsedBody = JSON.parse(requestBody);
    } catch {
      setError('Request body must be valid JSON.');
      return;
    }

    setTriggering(true);
    try {
      const res = await fetch('http://localhost:5000/api/campaigns/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ definitionId: selectedId, requestBody: parsedBody }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `Trigger failed (${res.status})`);
      }
      navigate(-1);
    } catch (err) {
      console.error('Trigger error', err);
      setError(err.message || 'Trigger failed');
    } finally {
      setTriggering(false);
    }
  };

  const handleCancel = () => navigate(-1);

  return (
    <div className="w-full p-6">
      <form onSubmit={handleTrigger} className="max-w-xxl mx-auto bg-white shadow-md rounded-md">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-2xl font-bold">Campaign</h2>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block font-medium mb-1">Notification Definition Name</label>
            <select
              value={String(selectedId)}
              onChange={(e) => setSelectedId(String(e.target.value))}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">{loadingDefs ? 'Loading definitions...' : 'Select notification definition name'}</option>
              {definitions.map((def) => (
                <option key={def.id} value={String(def.id)}>
                  {def.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Request Body</label>
            <textarea
              rows={10}
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              placeholder="Select a notification to auto-fill filters as JSON"
              className="w-full border border-gray-300 rounded px-3 py-2 font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Request body must be valid JSON</p>
          </div>

          {error && <div className="text-red-600">{error}</div>}

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Back
            </button>

            <button
              type="submit"
              disabled={!isFormValid() || triggering}
              className={`px-4 py-2 text-white rounded transition ${
                isFormValid() && !triggering ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'
              }`}
            >
              {triggering ? 'Triggering...' : 'Trigger'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
