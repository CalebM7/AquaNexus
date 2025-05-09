// frontend/src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Please log in');
        const response = await fetch('http://localhost:5000/api/user', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch user');
        const data = await response.json();
        setUser(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Dashboard</h1>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Welcome, {user?.email}!</h2>
        <p className="text-gray-600 mb-4">
          Explore water providers or manage your account.
        </p>
        <div className="space-y-4">
          <a
            href="/providers"
            className="block text-center bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            View Providers
          </a>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-gray-500">Water Usage Stats (Coming Soon)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;