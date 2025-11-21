import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function DefinitionsPage() {
  const [definitions, setDefinitions] = useState([]);

  // Dummy data taken from your screenshot (IDs kept as strings to avoid type mismatch)
  const DUMMY_DEFS = [
    {
      id: '69202db4688785e29ec7f22c',
      name: 'Test Edit',
      critical: 'N/A',
      preference: 'Medium',
      medium: 'N/A',
      platform: 'Banner',
      status: 'Active',
      created: '2/11/2025 9:06 AM',
      updated: '2/11/2025 9:06 AM',
    },
    {
      id: '69202db4688785e29ec7f22b',
      name: 'test',
      critical: 'Medium',
      preference: 'N/A',
      medium: 'Campaign',
      platform: 'N/A',
      status: 'Active',
      created: '2/11/2025 7:45 AM',
      updated: '2/11/2025 7:45 AM',
    },
    {
      id: '69201fcb4688785e29ec7f22a',
      name: 'testENailsms',
      critical: 'Medium',
      preference: 'N/A',
      medium: 'Campaign',
      platform: 'N/A',
      status: 'Active',
      created: '2/11/2025 7:44 AM',
      updated: '2/11/2025 7:44 AM',
    },
    {
      id: '69200ebd4688785e29ec7f229',
      name: 'push',
      critical: 'Medium',
      preference: 'N/A',
      medium: 'PUSH',
      platform: 'N/A',
      status: 'Active',
      created: '2/11/2025 7:43 AM',
      updated: '2/11/2025 7:43 AM',
    },
    {
      id: '691fb9d3468785e29ec7f228',
      name: 'push',
      critical: 'Medium',
      preference: 'N/A',
      medium: 'PUSH',
      platform: 'N/A',
      status: 'Active',
      created: '2/11/2025 5:40 AM',
      updated: '2/11/2025 5:40 AM',
    },
    {
      id: '691fb9d3468785e29ec7f226',
      name: 'push',
      critical: 'Medium',
      preference: 'N/A',
      medium: 'PUSH',
      platform: 'N/A',
      status: 'Active',
      created: '2/11/2025 4:16 AM',
      updated: '2/11/2025 4:16 AM',
    },
  ];

  useEffect(() => {
    let aborted = false;
    const load = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/notification-definitions');
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        if (!aborted && Array.isArray(data) && data.length) {
          // normalize IDs to strings
          setDefinitions(data.map((d) => ({ ...d, id: String(d.id) })));
        } else if (!aborted) {
          setDefinitions(DUMMY_DEFS);
        }
      } catch (err) {
        console.warn('Could not fetch notification definitions, using dummy data.', err);
        if (!aborted) setDefinitions(DUMMY_DEFS);
      }
    };
    load();
    return () => {
      aborted = true;
    };
  }, []);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center bg-white border-b px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-800">Notification Definitions</h1>
        <Link
          to="/definitions/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ＋ Create New Notification Definition
        </Link>
      </div>

      <div className="p-6">
        <div className="bg-white p-4 shadow-md rounded-lg">
          <table className="min-w-full table-auto border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Critical</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Preference</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Medium</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Platform</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Created</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Updated</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Edit</th>
              </tr>
            </thead>

            <tbody>
              {definitions.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-2 text-sm text-gray-700">{item.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{item.critical}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{item.preference}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{item.medium}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{item.platform}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{item.status}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{item.created}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{item.updated}</td>
                  <td className="px-4 py-2 text-center">
                    <Link
                      to={`/notification-definitions/${item.id}/edit`}
                      state={{ item }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ✏️
                    </Link>
                  </td>
                </tr>
              ))}

              {definitions.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-gray-500" colSpan={10}>
                    No notification definitions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
