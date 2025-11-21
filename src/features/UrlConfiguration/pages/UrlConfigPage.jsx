import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function UrlConfigPage({ configUrls = [], setConfigUrls }) {
  const navigate = useNavigate();

  useEffect(() => {
  fetch('http://localhost:5000/api/configs')
    .then(res => res.json())
    .then(data => setConfigUrls(data))
    .catch(console.error);
}, []);


  const handleDelete = (id) => {
    if (!setConfigUrls) return;
    setConfigUrls(configUrls.filter((c) => String(c.id) !== String(id)));
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center bg-white border-b px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-800">ConfigURL Form</h1>

        <Link
          to="/url-configs/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <span className="mr-2 text-lg">＋</span> Create New Config URL
        </Link>
      </div>

      <div className="p-6">
        <div className="bg-white p-4 shadow-md rounded-lg">
          <table className="min-w-full table-auto border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">API Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Host URL</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Method</th>
                {/* <th className="px-4 py-2 text-left text-sm font-medium">Headers</th> */}
                <th className="px-4 py-2 text-center text-sm font-medium">Edit</th>
                <th className="px-4 py-2 text-center text-sm font-medium">Delete</th>
              </tr>
            </thead>
            <tbody>
              {configUrls.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-center text-gray-500" colSpan={6}>
                    No configurations yet. Click “Create New Config URL” to add one.
                  </td>
                </tr>
              ) : (
                configUrls.map((item) => (
                  <tr key={item.id} className="border-t border-gray-200">
                    <td className="px-4 py-2 text-sm text-gray-700">{item.apiName}</td>
                    <td className="px-4 py-2 text-sm text-blue-700 break-all">{item.hostUrl}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{item.method}</td>
                    {/* <td className="px-4 py-2 text-sm text-gray-700">
                      {Array.isArray(item.headers)
                        ? item.headers.filter(Boolean).join('; ')
                        : item.headers || '—'}
                    </td> */}
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => navigate(`/url-configs/${Number(item.id)}/edit`)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        ✏️
                      </button>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
