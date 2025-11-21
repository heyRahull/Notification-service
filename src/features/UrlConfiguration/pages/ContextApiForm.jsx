import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

export default function ContextApiForm({ configUrls = [], setConfigUrls }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isEdit = Boolean(id);

  // Prefer instant prefill from navigation state if present
  const stateItem = location.state?.item || null;

  // Normalize id to number
  const parsedId = useMemo(() => (isEdit ? Number(id) : null), [id, isEdit]);

  // Find existing config: prefer stateItem, then shared list
  const existingConfig = useMemo(() => {
    if (!isEdit) return null;
    if (stateItem) return stateItem;
    if (!Array.isArray(configUrls) || configUrls.length === 0) return null;
    return configUrls.find((c) => Number(c.id) === parsedId) || null;
  }, [isEdit, parsedId, configUrls, stateItem]);

  const normalizeHeaders = (headers) => {
    if (headers == null) return [""];
    if (Array.isArray(headers)) return headers.length ? headers : [""];
    const trimmed = String(headers).trim();
    return trimmed ? [trimmed] : [""];
  };

  const [formData, setFormData] = useState({
    apiName: "",
    hostUrl: "",
    method: "GET",
    headers: [""],
    requestBody: "",
    isPaginated: false,
  });

  // Prefill once existingConfig is available
  useEffect(() => {
    if (isEdit && existingConfig) {
      setFormData({
        apiName: existingConfig.apiName || "",
        hostUrl: existingConfig.hostUrl || "",
        method: existingConfig.method || "GET",
        headers: normalizeHeaders(existingConfig.headers),
        requestBody: existingConfig.requestBody || "",
        isPaginated: !!existingConfig.isPaginated || "",
      });
    }
  }, [isEdit, existingConfig]);

  // Fallback: fetch by id if opened directly (hard reload) and existingConfig is missing
  useEffect(() => {
    const loadIfMissing = async () => {
      if (isEdit && !existingConfig && parsedId != null) {
        try {
          const res = await fetch(
            `http://localhost:5000/api/configs/${parsedId}`
          );
          if (!res.ok) return;
          const data = await res.json();
          setFormData({
            apiName: data.apiName || "",
            hostUrl: data.hostUrl || "",
            method: data.method || "GET",
            headers: normalizeHeaders(data.headers),
            requestBody: data.requestBody || "",
            isPaginated: data.isPaginated || "",
          });
        } catch (err) {
          console.error("Failed to load config by id:", err);
        }
      }
    };
    loadIfMissing();
  }, [isEdit, existingConfig, parsedId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleHeaderChange = (index, value) => {
    const updated = [...formData.headers];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, headers: updated }));
  };

  const addHeaderField = () => {
    setFormData((prev) => ({ ...prev, headers: [...prev.headers, ""] }));
  };

  const isFormValid = () =>
    formData.apiName.trim().length > 0 && formData.hostUrl.trim().length > 0;

  // Submit: POST for create, PUT for update (updates shared state after server success)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert("Please fill out all required fields.");
      return;
    }

    const payload = {
      apiName: formData.apiName.trim(),
      hostUrl: formData.hostUrl.trim(),
      method: formData.method,
      headers: formData.headers.filter((h) => h && h.trim()),
      requestBody: formData.requestBody,
      isPaginated: formData.isPaginated,
    };

    try {
      if (isEdit) {
        const targetId = Number(stateItem?.id ?? parsedId);
        const res = await fetch(
          `http://localhost:5000/api/configs/${targetId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        if (!res.ok) throw new Error("Failed to update configuration");
        const updated = await res.json();
        setConfigUrls((prev) =>
          prev.map((c) => (Number(c.id) === Number(targetId) ? updated : c))
        );
      } else {
        const res = await fetch("http://localhost:5000/api/configs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create configuration");
        const created = await res.json();
        setConfigUrls((prev) => [...prev, created]);
      }

      navigate("/url-configuration");
    } catch (err) {
      console.error(err);
      alert(err.message || "Request failed");
    }
  };

  const handleCancel = () => navigate("/url-configuration");

  return (
    <div className="w-full p-6">
      <form
        key={isEdit ? `edit-${id}` : "create"}
        onSubmit={handleSubmit}
        className="max-w-xxl mx-auto bg-white shadow-md rounded-md"
      >
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-2xl font-bold">
            {isEdit ? "Edit Config URL" : "Create Config URL"}
          </h2>
        </div>

        <div className="p-6 space-y-4">
          {/* API Name */}
          <div>
            <label htmlFor="apiName" className="block font-medium mb-1">
              API Name *
            </label>
            <input
              id="apiName"
              name="apiName"
              type="text"
              placeholder="Enter API name"
              value={formData.apiName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Host URL */}
          <div>
            <label htmlFor="hostUrl" className="block font-medium mb-1">
              Host URL *
            </label>
            <input
              id="hostUrl"
              name="hostUrl"
              type="text"
              placeholder="Enter Host URL"
              value={formData.hostUrl}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Method */}
          <div>
            <label htmlFor="method" className="block font-medium mb-1">
              Method
            </label>
            <select
              id="method"
              name="method"
              value={formData.method}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          {/* Headers */}
          <div>
            <label className="block font-medium mb-1">Headers</label>
            {formData.headers.map((header, index) => (
              <input
                key={index}
                type="text"
                placeholder="Enter Header"
                value={header}
                onChange={(e) => handleHeaderChange(index, e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
              />
            ))}
            <button
              type="button"
              onClick={addHeaderField}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              ＋ Add Header
            </button>
          </div>

          {/* Request Body */}
          <div>
            <label htmlFor="requestBody" className="block font-medium mb-1">
              Request Body
            </label>
            <input
              id="requestBody"
              name="requestBody"
              type="text"
              placeholder="Enter Request Body"
              value={formData.requestBody}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Pagination */}
          <div className="flex items-center">
            <input
              id="isPaginated"
              name="isPaginated"
              type="checkbox"
              checked={!!formData.isPaginated}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isPaginated: e.target.checked,
                }))
              }
              className="mr-2 h-4 w-4"
            />
            <label htmlFor="pagination" className="font-medium mb-0">
              Pagination
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid()}
              className={`px-4 py-2 text-white rounded transition ${
                isFormValid()
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-300 cursor-not-allowed"
              }`}
            >
              {isEdit ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
