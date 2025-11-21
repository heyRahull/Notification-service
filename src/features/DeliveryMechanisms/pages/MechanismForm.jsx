import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MechanismForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    type: 'SQS',
    httpEntry: '',
    header: '',
    body: '',
    sqsDetails: '',
    notificationPreference: false,
  });

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    const newValue = inputType === 'checkbox' ? checked : value;

    if (name === 'type') {
      setFormData({
        ...formData,
        type: newValue,
        httpEntry: '',
        header: '',
        body: '',
        sqsDetails: '',
      });
    } else {
      setFormData({ ...formData, [name]: newValue });
    }
  };

  const isFormValid = () => {
    if (!formData.name.trim()) return false;
    if (formData.type === 'HTTP') return formData.httpEntry && formData.header && formData.body;
    if (formData.type === 'SQS') return formData.sqsDetails;
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return alert("Fill all mandatory fields");

    await fetch('http://localhost:5000/api/mechanisms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    navigate('/delivery-mechanisms');
  };

  const handleCancel = () => {
    navigate('/delivery-mechanisms');
  };

  return (
    <div className="w-full p-6">
      <form onSubmit={handleSubmit} className="max-w-xxl mx-auto bg-white shadow-md rounded-md">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-2xl font-bold">Create Delivery Mechanism</h2>
        </div>

        <div className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block font-medium mb-1">Delivery Mechanism Name *</label>
            <input id="name" name="name" type="text" placeholder="e.g. SMS"
              value={formData.name} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>

          {/* Type */}
          <div>
            <label htmlFor="type" className="block font-medium mb-1">Mechanism Type *</label>
            <select id="type" name="type" value={formData.type} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2">
              <option value="HTTP">HTTP</option>
              <option value="SQS">SQS</option>
            </select>
          </div>

          {/* Conditional fields */}
          {formData.type === 'HTTP' ? (
            <>
              <div>
                <label htmlFor="httpEntry" className="block font-medium mb-1">HTTP Entry *</label>
                <input id="httpEntry" name="httpEntry" type="text" placeholder="Enter HTTP Url"
                  value={formData.httpEntry} onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <div>
                <label htmlFor="header" className="block font-medium mb-1">Header *</label>
                <input id="header" name="header" type="text" placeholder="Enter Header"
                  value={formData.header} onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <div>
                <label htmlFor="body" className="block font-medium mb-1">Body *</label>
                <input id="body" name="body" type="text" placeholder="Enter Body"
                  value={formData.body} onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
            </>
          ) : (
            <div>
              <label htmlFor="sqsDetails" className="block font-medium mb-1">SQS Details *</label>
              <input id="sqsDetails" name="sqsDetails" type="text" placeholder="Enter SQS Details"
                value={formData.sqsDetails} onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
          )}

          {/* Notification Preference */}
          <div className="flex items-center">
            <input type="checkbox" id="notificationPreference" name="notificationPreference"
              checked={formData.notificationPreference} onChange={handleChange}
              className="mr-2" />
            <label htmlFor="notificationPreference" className="font-medium">Notification Preference</label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
            <button type="submit" disabled={!isFormValid()}
              className={`px-4 py-2 text-white rounded transition ${
                isFormValid() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'
              }`}>Add</button>
          </div>
        </div>
      </form>
    </div>
  );
}
