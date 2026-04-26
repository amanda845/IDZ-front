export const BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5002';
const API_URL = `${BASE_URL}/api`;

export const api = {
  // Authentication
  registerCitizen: async (data) => {
    const res = await fetch(`${API_URL}/citizen/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Erreur d'inscription");
    }
    return res.json();
  },

  loginCitizen: async (email, password) => {
    const res = await fetch(`${API_URL}/citizen/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error("Email ou mot de passe incorrect");
    return res.json();
  },

  loginAgent: async (email, password) => {
    const res = await fetch(`${API_URL}/agent/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error("Identifiants agent incorrects");
    return res.json();
  },

  // Requests
  getRequests: async (userId) => {
    const res = await fetch(`${API_URL}/requests/citizen/${userId}`);
    return res.json();
  },
  
  createRequest: async (requestData) => {
    const formData = new FormData();
    
    // Append files
    if (requestData.files) {
      requestData.files.forEach(file => {
        formData.append('files', file);
      });
    }

    // Append other data as JSON string
    const { files, ...otherData } = requestData;
    formData.append('data', JSON.stringify(otherData));

    const res = await fetch(`${API_URL}/requests`, {
      method: 'POST',
      body: formData
    });
    return res.json();
  },
  
  getNotifications: async (userId) => {
    const res = await fetch(`${API_URL}/notifications/${userId}`);
    return res.json();
  },
  
  getHistory: async (userId) => {
    const res = await fetch(`${API_URL}/documents/${userId}`);
    return res.json();
  },
  
  deleteNotification: async (id) => {
    const res = await fetch(`${API_URL}/notifications/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },
  
  updateRequestStatus: async (requestId, status, motif) => {
    const res = await fetch(`${API_URL}/requests/${requestId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut: status, motif })
    });
    return res.json();
  },

  getAllRequests: async () => {
    const res = await fetch(`${API_URL}/requests`);
    return res.json();
  }
};
