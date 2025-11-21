import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const MechanismsPage = () => {
  const [mechanisms, setMechanisms] = useState([]);

  // Fetch mechanisms from backend
  useEffect(() => {
    fetch('http://localhost:5000/api/mechanisms')
      .then(res => res.json())
      .then(data => setMechanisms(data))
      .catch(err => console.error('Error fetching mechanisms:', err));
  }, []);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center bg-white border-b px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-800">Delivery Mechanisms</h1>
        <Link to="/delivery-mechanisms/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          ＋ Create New Mechanism
        </Link>
      </div>

      <div className="p-6">
        <div className="bg-white p-4 shadow-md rounded-lg">
          <table className="min-w-full table-auto border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">Delivery Mechanism</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Type</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Created</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Updated</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Edit</th>
              </tr>
            </thead>
            <tbody>
              {mechanisms.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-2 text-sm text-gray-700">{item.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{item.type}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{item.created}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{item.updated}</td>
                  <td className="px-4 py-2 text-center">
                    <Link to={`/delivery-mechanisms/${item.id}/edit`} className="text-blue-600 hover:text-blue-800">✏️</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MechanismsPage;
