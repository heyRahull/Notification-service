import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DefinitionForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "Auto-generated notification ID",
    name: "",
    deliveryMechanism: "",
    filters: [], // [{ key: '', value: '' }]
    order: "1",
    notificationPreference: "",
    criticality: "Medium",
  });

  // Enrich API related state
  const [enrichOpen, setEnrichOpen] = useState(false);
  const [apiConfigOpen, setApiConfigOpen] = useState(false);

  // Available APIs (matches screenshots); ids kept as strings
  const AVAILABLE_APIS = [
    {
      id: "GetSiteDetailsAPI",
      name: "GetSiteDetailsAPI",
      url: "https://f98cf68e1b6e2e67e16fa1.mockapi.io/api/v1/getSiteDetails/$Event.site_id",
    },
    {
      id: "EnrichAPI",
      name: "EnrichAPI",
      url: "https://90a2df1014a68bf2cc43765.mockapi.io/sendNotif/$Event.deviceId",
    },
    {
      id: "users",
      name: "users",
      url: "https://enlight-dev-qa-emphasecency.com/service/en-notification-core-service/api/emphase/site-users/$Event.site_id",
    },
    { id: "Google", name: "Google", url: "https://www.google.com" },
  ];

  const [selectedApis, setSelectedApis] = useState([]); // array of api ids

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleFilterChange = (index, field, value) => {
    setFormData((prev) => {
      const filters = [...prev.filters];
      filters[index] = {
        ...(filters[index] || { key: "", value: "" }),
        [field]: value,
      };
      return { ...prev, filters };
    });
  };

  // Handlers to add/remove filters (place near your other handlers)
  const addFilter = () => {
    setFormData((prev) => ({
      ...prev,
      filters: [...prev.filters, { key: "", value: "" }],
    }));
  };

  const addFilterAt = (index) => {
    setFormData((prev) => {
      const filters = [...prev.filters];
      filters.splice(index + 1, 0, { key: "", value: "" });
      return { ...prev, filters };
    });
  };

  const removeFilter = (index) => {
    setFormData((prev) => ({
      ...prev,
      filters: prev.filters.filter((_, i) => i !== index),
    }));
  };

  // state for dropdown open
  const [mechOpen, setMechOpen] = useState(false);

  // list of available mechanisms (can be lifted to top-level const)
  const DELIVERY_OPTIONS = [
    { value: "BANNER", label: "Banner" },
    { value: "CAMPAIGN", label: "Campaign" },
    { value: "DIGEST", label: "Digest" },
    { value: "PUSH", label: "PUSH" },
    { value: "SMS", label: "SMS" },
  ];

  const toggleMechanism = (value) => {
    setFormData((prev) => {
      const curr = Array.isArray(prev.deliveryMechanism)
        ? prev.deliveryMechanism
        : [];
      const next = curr.includes(value)
        ? curr.filter((v) => v !== value)
        : [...curr, value];
      return { ...prev, deliveryMechanism: next };
    });
  };

  const clearMechanisms = () => {
    setFormData((prev) => ({ ...prev, deliveryMechanism: [] }));
  };

  const toggleApi = (apiId) => {
    setSelectedApis((prev) =>
      prev.includes(apiId)
        ? prev.filter((id) => id !== apiId)
        : [...prev, apiId]
    );
  };

  const isFormValid = () => {
    if (!formData.name.trim()) return false;
    if (!formData.deliveryMechanism) return false;
    // If there are filters, ensure keys/values are valid (optional)
    for (const f of formData.filters) {
      if (!f) continue;
      if ((f.key && !f.key.trim()) || (f.value && !f.value.trim()))
        return false;
    }
    // Require at least one API selected in Enrich API step before Save & Next
    if (selectedApis.length === 0) return false;
    return true;
  };

  const handleSaveNext = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setSaving(true);
    try {
      // TODO: replace with real API call
      await new Promise((r) => setTimeout(r, 600));

      const payload = { ...formData, selectedApis };
      navigate("/notification-definitions/enrich-api", {
        state: { created: true, data: payload },
      });
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  /* place near other useState declarations */
  const [critOpen, setCritOpen] = useState(false);

  /* helper inside component */
  const CRITICALITY_OPTIONS = [
    { value: "High", label: "High", color: "bg-red-500" },
    { value: "Medium", label: "Medium", color: "bg-orange-500" },
    { value: "Low", label: "Low", color: "bg-green-500" },
  ];

  const setCriticality = (value) => {
    setFormData((f) => ({ ...f, criticality: value }));
    setCritOpen(false);
  };

  const handleBack = () => navigate(-1);

  return (
    <div className="w-full p-6">
      <form
        onSubmit={handleSaveNext}
        className="max-w-xxl mx-auto bg-white shadow-md rounded-md"
      >
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-2xl font-bold">Create Notification Definition</h2>
        </div>

        <div className="p-6 space-y-4">
          {/* Notification ID (read-only) */}

          {/* Name */}
          <div>
            <label htmlFor="name" className="block font-medium mb-1">
              Notification Definition Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter notification definition name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Delivery Mechanism */}
          <div className="relative">
            <label className="block font-medium mb-1">
              Notification Delivery Mechanism *
            </label>

            <button
              type="button"
              onClick={() => setMechOpen((s) => !s)}
              className="w-full flex justify-between items-center border border-gray-300 rounded px-3 py-2 bg-white"
            >
              <div className="text-left truncate">
                {Array.isArray(formData.deliveryMechanism) &&
                formData.deliveryMechanism.length > 0 ? (
                  <>
                    <span className="font-medium">
                      {formData.deliveryMechanism.length} type(s) selected
                    </span>
                    <div className="text-xs text-gray-500">
                      {formData.deliveryMechanism
                        .map(
                          (v) =>
                            DELIVERY_OPTIONS.find((o) => o.value === v)
                              ?.label || v
                        )
                        .join(", ")}
                    </div>
                  </>
                ) : (
                  <span className="text-gray-500">
                    Select notification types
                  </span>
                )}
              </div>

              <div className="ml-2 text-sm text-gray-500">
                {mechOpen ? "▲" : "▼"}
              </div>
            </button>

            {mechOpen && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg">
                <div className="p-3 space-y-2 max-h-60 overflow-auto">
                  {DELIVERY_OPTIONS.map((opt) => {
                    const checked =
                      Array.isArray(formData.deliveryMechanism) &&
                      formData.deliveryMechanism.includes(opt.value);
                    return (
                      <label
                        key={opt.value}
                        className="flex items-center space-x-3 px-2 py-1 hover:bg-gray-50 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleMechanism(opt.value)}
                          className="h-4 w-4"
                        />
                        <div>
                          <div className="font-medium">{opt.label}</div>
                          <div className="text-xs text-gray-500">
                            {opt.value}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between border-t px-3 py-2">
                  <button
                    type="button"
                    onClick={() => setMechOpen(false)}
                    className="px-3 py-1 text-sm text-gray-600 rounded hover:bg-gray-100"
                  >
                    Done
                  </button>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={clearMechanisms}
                      className="px-3 py-1 text-sm text-red-600 rounded hover:bg-red-50"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Message Filter (Key-Value Tags) */}
          {/* Message Filter (updated UI) */}
          <div>
            <label className="block font-medium mb-2">Message Filter</label>
            <div className="space-y-2">
              {formData.filters.length === 0 && (
                <div className="text-sm text-gray-500">
                  No tags added yet. Use the form below to add key-value pairs.
                </div>
              )}

              {formData.filters.map((f, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Field Name"
                    value={f.key}
                    onChange={(e) =>
                      handleFilterChange(idx, "key", e.target.value)
                    }
                    className="flex-1 border border-gray-300 rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={f.value}
                    onChange={(e) =>
                      handleFilterChange(idx, "value", e.target.value)
                    }
                    className="flex-1 border border-gray-300 rounded px-3 py-2"
                  />

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => addFilterAt(idx)}
                      className="px-3 py-2 bg-green-50 text-green-600 rounded hover:bg-green-100"
                      aria-label={`Add filter after ${idx}`}
                      title="Add tag after"
                    >
                      ＋
                    </button>

                    <button
                      type="button"
                      onClick={() => removeFilter(idx)}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                      aria-label={`Remove filter ${idx}`}
                      title="Remove tag"
                    >
                      −
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={addFilter}
                  className="px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 text-sm"
                >
                  ＋ Add Tag
                </button>

                <div className="text-sm text-gray-600">
                  {/* Show a preview of added tags and count like the screenshot */}
                  {formData.filters.length > 0 ? (
                    <>
                      <span className="font-medium">Added Tags:</span>{" "}
                      <span className="ml-2">
                        {formData.filters
                          .filter(Boolean)
                          .map((t) => `${t.key || "—"}:${t.value || "—"}`)
                          .join(", ")}
                      </span>
                      <span className="ml-3 text-gray-500">
                        Total tags: {formData.filters.length}
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-500">No tags added</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order */}
          <div>
            <label htmlFor="order" className="block font-medium mb-1">
              Order
            </label>
            <select
              id="order"
              name="order"
              value={formData.order}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>

          {/* Enrich API (collapsible) */}
          <div className="border rounded">
            <button
              type="button"
              onClick={() => setEnrichOpen((s) => !s)}
              className="w-full flex justify-between items-center px-4 py-3 text-left"
            >
              <span className="font-medium">Enrich API</span>
              <span className="text-sm text-gray-500">
                {enrichOpen ? "▼" : "▶"}
              </span>
            </button>

            {enrichOpen && (
              <div className="px-4 py-3 border-t space-y-3">
                <div className="text-sm text-gray-600">
                  Select an API to enable
                </div>
                <div className="space-y-2">
                  {AVAILABLE_APIS.map((api) => (
                    <label key={api.id} className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedApis.includes(api.id)}
                        onChange={() => toggleApi(api.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{api.name}</div>
                        <div className="text-xs text-gray-500 break-all">
                          {api.url}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* API Configuration (collapsible) */}
          <div className="border rounded">
            <button
              type="button"
              onClick={() => setApiConfigOpen((s) => !s)}
              className="w-full flex justify-between items-center px-4 py-3 text-left"
            >
              <span className="font-medium">API Configuration</span>
              <span className="text-sm text-gray-500">
                {apiConfigOpen ? "▼" : "▶"}
              </span>
            </button>

            {apiConfigOpen && <p></p>}
          </div>

          <div>
            <label className="block font-medium mb-1">
              Notification Preference
            </label>
            <select
              name="notificationPreference"
              value={formData.notificationPreference}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Select notification preference</option>
              <option value="Hardware">Hardware</option>
              <option value="IQ Battery Temperature/Voltage">
                IQ Battery Temperature/Voltage
              </option>
              <option value="Battery Charge">Battery Charge</option>
              <option value="Grid On/Off">Grid On/Off</option>
              <option value="Medium Impact">Medium Impact</option>
              <option value="Cell Temperature & Voltage">
                Cell Temperature & Voltage
              </option>
              <option value="Generator">Generator</option>
              <option value="Load Control">Load Control</option>
              <option value="Enphase Revenue Grade Meter">
                Enphase Revenue Grade Meter
              </option>
              <option value="Communication">Communication</option>
              <option value="Production">Production</option>

              <option value="Monthly Report">Monthly Report</option>
              <option value="New leads and their status changes">
                New leads and their status changes
              </option>
              <option value="Low Impact">Low Impact</option>
              <option value="Activation Notifications">
                Activation Notifications
              </option>
              <option value="Activation Digest">Activation Digest</option>
              <option value="Monthly report with alerts and errors">
                Monthly report with alerts and errors
              </option>
              <option value="Battery Management Unit">
                Battery Management Unit
              </option>
              <option value="Storm Guard">Storm Guard</option>
              <option value="Collar Installation">Collar Installation</option>
              <option value="Battery Charge (PES)">Battery Charge (PES)</option>
              <option value="Temperature Imbalance">
                Temperature Imbalance
              </option>

              <option value="RMA">RMA</option>
              <option value="Grid Power">Grid Power</option>
              <option value="Power Error">Power Error</option>
              <option value="Connectivity Error">Connectivity Error</option>
              <option value="OTA">OTA</option>
              <option value="EV Charger">EV Charger</option>
            </select>
          </div>

          {/* Replace your existing Criticality block with this */}
          <div className="relative">
            <label className="block font-medium mb-1">Criticality</label>

            <button
              type="button"
              onClick={() => setCritOpen((s) => !s)}
              className="w-full flex items-center justify-between border border-gray-300 rounded px-3 py-2 bg-white"
              aria-expanded={critOpen}
            >
              <div className="flex items-center space-x-3">
                <span
                  aria-hidden
                  className={`w-3 h-3 rounded-full ${
                    formData.criticality === "High"
                      ? "bg-red-500"
                      : formData.criticality === "Medium"
                      ? "bg-orange-500"
                      : formData.criticality === "Low"
                      ? "bg-green-500"
                      : "bg-transparent"
                  }`}
                />
                <span
                  className={`${
                    formData.criticality ? "text-gray-800" : "text-gray-500"
                  }`}
                >
                  {formData.criticality || "Select criticality"}
                </span>
              </div>

              <svg
                className={`w-4 h-4 text-orange-500 transform ${
                  critOpen ? "rotate-180" : ""
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M10 12a1 1 0 01-.707-.293l-3-3a1 1 0 111.414-1.414L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3A1 1 0 0110 12z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {critOpen && (
              <ul className="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg max-h-48 overflow-auto">
                {CRITICALITY_OPTIONS.map((opt) => {
                  const selected = formData.criticality === opt.value;
                  return (
                    <li
                      key={opt.value}
                      onClick={() => setCriticality(opt.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") setCriticality(opt.value);
                      }}
                      role="option"
                      tabIndex={0}
                      aria-selected={selected}
                      className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-blue-50 ${
                        selected ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`w-3 h-3 rounded-full ${opt.color}`} />
                        <span
                          className={`${
                            selected
                              ? "font-medium text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {opt.label}
                        </span>
                      </div>

                      {selected && (
                        <svg
                          className="w-4 h-4 text-blue-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="text-sm text-gray-500 mt-2">
              Configure API-specific settings for selected APIs above.
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Back
            </button>

            <button
              type="submit"
              disabled={!isFormValid() || saving}
              className={`px-4 py-2 text-white rounded transition ${
                isFormValid() && !saving
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-300 cursor-not-allowed"
              }`}
            >
              {saving ? "Saving..." : "Save & Next"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
