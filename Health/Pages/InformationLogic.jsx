// InformationLogic.js - All functionality logic separated
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useInformationLogic = (id) => {
  // All state variables
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  
  const token = localStorage.getItem('token');
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // Function to check follow status
  const checkFollowStatus = async (postData) => {
    if (!token || !postData.hospital) return;
    
    try {
      const followResponse = await axios.get(
        `${API_BASE}/follows/hospitals/${postData.hospital}/follow/`,
        { headers: { Authorization: `Token ${token}` } }
      );
      setIsFollowing(!!followResponse.data.id);
    } catch (err) {
      console.log('Follow status check failed:', err);
      setIsFollowing(false);
    }
  };

  // Function to check subscription status for this specific post notification
  const checkSubscriptionStatus = async () => {
    if (!token || !id) return;
    
    try {
      const subResponse = await axios.get(
        `${API_BASE}/notifications/posts/${id}/subscribe/`,
        { headers: { Authorization: `Token ${token}` } }
      );
      setIsSubscribed(!!subResponse.data.id);
    } catch (err) {
      console.log('Post notification subscription status check failed:', err);
      setIsSubscribed(false);
    }
  };

  // Main fetch post function
  const fetchPost = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching post with ID:', id);
      
      const response = await axios.get(
        `${API_BASE}/posts/${id}/`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Token ${token}` })
          },
          timeout: 10000
        }
      );
      
      console.log('Post data received:', response.data);
      console.log('POST IMAGE VALUE:', response.data.image); // ADD THIS LINE
      console.log('IMAGE TYPE:', typeof response.data.image); 
      setPost(response.data);
      
      // Check follow and subscription status if authenticated
      if (token && response.data) {
        await checkFollowStatus(response.data);
        await checkSubscriptionStatus();
      }
      
    } catch (err) {
      console.error('Fetch error details:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
        url: err.config?.url
      });
      
      let errorMessage = 'Failed to load post';
      if (err.response?.status === 404) {
        errorMessage = 'Post not found';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please check your connection.';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }
      
      setError(errorMessage);
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle follow/unfollow hospital (for new posts notifications)
  const handleFollow = async () => {
    if (!token) {
      setError('You must be logged in to follow');
      return;
    }

    if (!post?.hospital) {
      setError('Hospital information not available');
      return;
    }

    try {
      setFollowLoading(true);
      setError('');
      
      const response = await axios.post(
        `${API_BASE}/follows/hospitals/${post.hospital}/follow/`,
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

  // Handle subscribe/unsubscribe to THIS POST's date notification (2 days before)
  const handleSubscribe = async () => {
    if (!token) {
      setError('You must be logged in to get notifications');
      return;
    }

    try {
      setSubscribeLoading(true);
      setError('');
      
      const response = await axios.post(
        `${API_BASE}/notifications/posts/${id}/subscribe/`,
        {},
        { headers: { Authorization: `Token ${token}` } }
      );
      
      setIsSubscribed(!isSubscribed);
      console.log('Post notification subscription successful:', response.data);
      
    } catch (err) {
      console.error('Post notification subscribe error:', err);
      setError(err.response?.data?.error || 'Failed to subscribe to post notifications');
    } finally {
      setSubscribeLoading(false);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setError('You must be logged in to comment');
      return;
    }
    
    if (!commentText.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    try {
      setCommentLoading(true);
      setError('');
      
      console.log('Submitting comment with token:', token);
      
      const response = await axios.post(
        `${API_BASE}/posts/${id}/comments/`,
        { text: commentText.trim() },
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000
        }
      );
      
      console.log('Comment submitted successfully:', response.data);
      
      // Refetch the post to get updated comments
      const updatedResponse = await axios.get(
        `${API_BASE}/posts/${id}/`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Token ${token}` })
          }
        }
      );
      
      setPost(updatedResponse.data);
      setCommentText('');
      
    } catch (err) {
      console.error('Comment submission error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      
      let errorMessage = 'Failed to post comment';
      if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }
      
      setError(errorMessage);
    } finally {
      setCommentLoading(false);
    }
  };

  // useEffect to fetch post on component mount
  useEffect(() => {
    if (id) {
      fetchPost();
    } else {
      setError('No post ID provided');
      setLoading(false);
    }
  }, [id, token]);

  // Return all state and functions that the UI component needs
  return {
    // State
    post,
    loading,
    error,
    commentText,
    commentLoading,
    isFollowing,
    isSubscribed,
    followLoading,
    subscribeLoading,
    token,
    
    // Functions
    handleFollow,
    handleSubscribe,
    handleCommentSubmit,
    setCommentText,
    setError
  };
};