// HospitalStatisticLogic.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useHospitalStatisticLogic = (hospitalId) => {
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  
  const token = localStorage.getItem('token');
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // Fetch hospital data
  const fetchHospital = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching hospital with ID:', hospitalId);
      
      const response = await axios.get(
        `${API_BASE}/hospitals/${hospitalId}/` ,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Token ${token}` })
          },
          timeout: 10000
        }
      );
      
      console.log('Hospital data received:', response.data);
      setHospital(response.data);
      
      if (token) {
        await checkFollowStatus(response.data);
      }
      
    } catch (err) {
      console.error('Fetch error details:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
        url: err.config?.url
      });
      
      let errorMessage = 'Failed to load hospital data';
      if (err.response?.status === 404) {
        errorMessage = 'Hospital not found';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please check your connection.';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }
      
      setError(errorMessage);
      setHospital(null);
    } finally {
      setLoading(false);
    }
  };


  const checkFollowStatus = async (hospitalData) => {
    if (!token || !hospitalData.id) return;
    
    try {
      const followResponse = await axios.get(
        `${API_BASE}/follows/hospitals/${hospitalData.id}/follow/`, // Keep this as is
        { headers: { Authorization: `Token ${token}` } }
      );
      setIsFollowing(!!followResponse.data.id);
    } catch (err) {
      console.log('Follow status check failed:', err);
      setIsFollowing(false);
    }
  };

  // Handle follow/unfollow hospital
  const handleFollow = async () => {
    if (!token) {
      setError('You must be logged in to follow');
      return;
    }

    if (!hospital?.id) {
      setError('Hospital information not available');
      return;
    }

    try {
      setFollowLoading(true);
      setError('');
      
      const response = await axios.post(
        `${API_BASE}/follows/hospitals/${hospital.id}/follow/`,
        {},
        { headers: { Authorization: `Token ${token}` } }
      );
      
      setIsFollowing(!isFollowing);
      console.log('Follow action successful:', response.data);
      
    } catch (err) {
      console.error('Follow error:', err);
      setError(err.response?.data?.error || 'Failed to follow hospital');
    } finally {
      setFollowLoading(false);
    }
  };

  useEffect(() => {
    if (hospitalId) {
      fetchHospital();
    } else {
      setError('No hospital ID provided');
      setLoading(false);
    }
  }, [hospitalId, token]);

  return {
    hospital,
    loading,
    error,
    isFollowing,
    followLoading,
    token,
    handleFollow,
    setError
  };
};