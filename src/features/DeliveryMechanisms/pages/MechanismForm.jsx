import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "../../../components/common/TextInput";
import CheckboxInput from "../../../components/common/CheckboxInput";
import SelectInput from "../../../components/common/SelectInput";
import BasicSelect from "../../../components/common/BasicSelect";

export default function MechanismForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    type: "SQS",
    httpEntry: "",
    header: "",
    body: "",
    sqsDetails: "",
    notificationPreference: false,
  });

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    const newValue = inputType === "checkbox" ? checked : value;

    if (name === "type") {
      setFormData({
        ...formData,
        type: newValue,
        httpEntry: "",
        header: "",
        body: "",
        sqsDetails: "",
      });
    } else {
      setFormData({ ...formData, [name]: newValue });
    }
  };

  const isFormValid = () => {
    if (!formData.name.trim()) return false;
    if (formData.type === "HTTP")
      return formData.httpEntry && formData.header && formData.body;
    if (formData.type === "SQS") return formData.sqsDetails;
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return alert("Fill all mandatory fields");

    await fetch("http://localhost:5000/api/mechanisms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    navigate("/delivery-mechanisms");
  };

  const handleCancel = () => {
    navigate("/delivery-mechanisms");
  };

  return (
    <div className="w-full p-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-xxl mx-auto bg-white shadow-md rounded-md"
      >
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-2xl font-bold">Create Delivery Mechanism</h2>
        </div>

        <div className="p-6 space-y-4">
          {/* Name */}
          <TextInput
            id="name"
            label="Delivery Mechanism Name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. SMS"
            required
          />

          {/* Type */}
          <SelectInput
            id="type"
            label="Mechanism Type"
            value={formData.type}
            onChange={handleChange}
            required
            options={[
              { value: "HTTP", label: "HTTP" },
              { value: "SQS", label: "SQS" },
            ]}
          />
          {/* <BasicSelect
            id="type"
            label="Mechanism Type"
            value={formData.type}
            onChange={handleChange}
            options={[
              { value: "HTTP", label: "HTTP" },
              { value: "SQS", label: "SQS" },
            ]}
          /> */}

          {/* Conditional fields */}
          {formData.type === "HTTP" ? (
            <>
              <TextInput
                id="httpEntry"
                label="HTTP Entry"
                value={formData.httpEntry}
                onChange={handleChange}
                placeholder="Enter HTTP Url"
                required
              />

              <TextInput
                id="header"
                label="Header"
                value={formData.header}
                onChange={handleChange}
                placeholder="Enter Header"
                required
              />

              <TextInput
                id="body"
                label="Body"
                value={formData.body}
                onChange={handleChange}
                placeholder="Enter Body"
                required
              />
            </>
          ) : (
            <TextInput
              id="sqsDetails"
              label="SQS Details"
              value={formData.sqsDetails}
              onChange={handleChange}
              placeholder="Enter SQS Details"
              required
            />
          )}

          {/* Notification Preference */}
          <CheckboxInput
            id="notificationPreference"
            label="Notification Preference"
            checked={formData.notificationPreference}
            onChange={handleChange}
          />

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
              Add
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
