import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function NotificationWorkflowForm() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const data = state?.data;

  const [workflowEnabled, setWorkflowEnabled] = useState(false);
  const [reviewers, setReviewers] = useState([]);
  const [priority, setPriority] = useState("");
  const [comments, setComments] = useState("");

  const REVIEWER_OPTIONS = [
    "rahul@gamil.com",
    "sam@gamil.com",
    "alice@gamil.com",
    "bob@gamil.com",
  ];

  const addReviewer = (email) => {
    if (email && !reviewers.includes(email)) {
      setReviewers((prev) => [...prev, email]);
    }
  };

  const removeReviewer = (email) => {
    setReviewers((prev) => prev.filter((r) => r !== email));
  };

  const handleBack = () => navigate(-1);

  const handleSubmit = () => {
    const finalPayload = {
      ...data,
      workflow: {
        enabled: workflowEnabled,
        reviewers,
        priority,
        comments,
      },
    };

    console.log("Final submission:", finalPayload);
    alert("Workflow submitted successfully!");
    // Optionally redirect to dashboard
    navigate("/definitions");
  };

  if (!data) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6">
          <h2 className="text-xl font-bold mb-4">Workflow [Step 3/3]</h2>
          <p className="text-gray-600">Missing data. Please go back and complete previous steps.</p>
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
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6 space-y-6">
        <h2 className="text-2xl font-bold">Workflow [Step 3/3]</h2>

        <div className="space-y-4">
          {/* Workflow toggle */}
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={workflowEnabled}
              onChange={(e) => setWorkflowEnabled(e.target.checked)}
            />
            <span className="text-gray-700 font-medium">Enable Workflow</span>
          </label>

          {/* Reviewer multiselect */}
          <div className="relative">
            <label className="block font-medium mb-1">Reviewers</label>

            {/* Selected reviewers as pills */}
            <div className="flex flex-wrap gap-2 mb-2">
              {reviewers.map((email) => (
                <span
                  key={email}
                  className="flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
                >
                  {email}
                  <button
                    type="button"
                    onClick={() => removeReviewer(email)}
                    className="ml-2 text-gray-500 hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Dropdown to add reviewers */}
            <select
              value=""
              onChange={(e) => addReviewer(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Select Reviewer</option>
              {REVIEWER_OPTIONS.map((email) =>
                !reviewers.includes(email) ? (
                  <option key={email} value={email}>
                    {email}
                  </option>
                ) : null
              )}
            </select>
          </div>

          {/* Priority dropdown */}
          <div>
            <label className="block font-medium mb-1">Workflow Queue Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Select priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Comments */}
          <div>
            <label className="block font-medium mb-1">Comments</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Enter comments or remarks..."
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={4}
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
