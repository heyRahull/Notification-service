import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TAB_LABELS = {
  EMAIL: "Email",
  SMS: "SMS",
  PUSH: "Push",
  BANNER: "Banner",
  CAMPAIGN: "Campaign",
  DIGEST: "Digest",
};

export default function NotificationContentScreen() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Normalize deliveryMechanism to always be an array
  const rawMechanism = state?.data?.deliveryMechanism || [];
  const deliveryMechanism = Array.isArray(rawMechanism)
    ? rawMechanism
    : rawMechanism
    ? [rawMechanism]
    : [];

  const tabs = deliveryMechanism.map((key) => TAB_LABELS[key] || key);
  const [activeTab, setActiveTab] = useState(tabs[0]);

  // Placeholder for content per tab (can be replaced with real form state later)
  const [contentMap, setContentMap] = useState({});

  const handleBack = () => navigate(-1);

  const handleContinue = () => {
    const collectedContent = {
      ...state.data,
      contentPerTab: contentMap,
    };

    navigate("/notification-definitions/workflow", {
      state: { data: collectedContent },
    });
  };

  // Guard: if no mechanisms selected
  if (tabs.length === 0) {
    return (
      <div className="w-full p-6">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6">
          <h2 className="text-xl font-bold mb-4">Compose Notification Content</h2>
          <p className="text-gray-600">No delivery mechanisms selected. Go back and choose at least one.</p>
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-md">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Compose Notification Content</h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b px-6 space-x-6 mt-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 font-medium ${
                activeTab === tab
                  ? "border-b-2 border-orange-500 text-orange-600"
                  : "text-gray-600 hover:text-orange-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "Push" ? (
            <div className="text-gray-700">Push content form goes here</div>
          ) : (
            <div className="text-gray-700">{activeTab} content form goes here</div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-end space-x-4 px-6 pb-6">
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleContinue}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
