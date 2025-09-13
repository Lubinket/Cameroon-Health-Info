import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from "../components/Header";
import Verification from "../assets/verification.png";
import { useHospitalStatisticLogic } from './HospitalStatisticLogic';
import { formatDistanceToNow } from 'date-fns';
import { renderPostsByCategory } from "../components/ReusableFunction";

function HospitalStatisticPage() {
  const { hospitalId } = useParams();
  const navigate = useNavigate();
  const {
    hospital,
    loading,
    error,
    isFollowing,
    followLoading,
    token,
    handleFollow,
    setError
  } = useHospitalStatisticLogic(hospitalId);

  // State for posts
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState('');

  // State for selected category
  const [selectedCategory, setSelectedCategory] = useState('screenings'); // Match database

  // Fetch posts from /hospitals/<hospital_id>/posts/
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setPostsLoading(true);
        setPostsError('');

        console.log('Fetching posts from /hospitals/', hospitalId, '/posts/');

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/hospitals/${hospitalId}/posts/`,
          {
            headers: {
              'Content-Type': 'application/json',
              ...(token && { 'Authorization': `Token ${token}` })
            },
            timeout: 10000
          }
        );

        console.log('Posts data received:', response.data);
        console.log('Unique post categories:', [
          ...new Set(response.data.map(post => post.category || 'undefined')),
        ]);
        console.log('Sample post structure:', response.data[0]);

        setPosts(response.data);

      } catch (err) {
        console.error('Posts fetch error:', {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          message: err.message,
        });

        let errorMessage = 'Failed to load posts';
        if (err.response?.status === 404) {
          errorMessage = 'No posts found for this hospital';
        } else if (err.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (err.code === 'ECONNABORTED') {
          errorMessage = 'Request timed out. Please check your connection.';
        } else if (err.response?.data?.error) {
          errorMessage = err.response.data.error;
        }

        setPostsError(errorMessage);
        setPosts([]);
      } finally {
        setPostsLoading(false);
      }
    };

    if (hospitalId) {
      fetchPosts();
    } else {
      setPostsError('No hospital ID provided');
      setPostsLoading(false);
    }
  }, [hospitalId, token]);

  // Handle loading and error states for posts
  const renderPostsContent = () => {
    if (postsLoading) {
      return (
        <div className="text-center mt-10">
          <div className=" spinning-thing inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#57B9FF]"></div>
          <p className="mt-2">Loading posts...</p>
        </div>
      );
    }

    if (postsError) {
      return (
        <div className="text-red-500 text-center mt-10 p-4">
          <p className="mb-4">{postsError}</p>
          <button
            className="bg-[#57B9FF] text-white px-4 py-2 rounded-lg hover:bg-[#517891]"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      );
    }

    if (!posts || posts.length === 0) {
      console.log(`No posts for hospital ${hospitalId}`);
      return <p className="text-center text-gray-500 py-12">No posts available for this hospital</p>;
    }

    // Use your reusable function here
    return renderPostsByCategory(posts, selectedCategory, navigate);
  };

  // Categories matching database
  const categories = ['events', 'screenings', 'vaccinations', 'donations'];

  return (
    <div className='hospital-statistic-page'>
      <Header />
      
      {loading && (
        <div className="text-center mt-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#57B9FF]"></div>
          <p className="mt-2">Loading hospital data...</p>
        </div>
      )}
      
      {error && !loading && (
        <div className="text-red-500 text-center mt-10 p-4">
          <p className="mb-4">{error}</p>
          <button
            className="bg-[#57B9FF] text-white px-4 py-2 rounded-lg hover:bg-[#517891]"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}
      
      {hospital && !loading && (
        <>
          <div className="relative mt-24 h-[350px] flex-col flex justify-start bg-gradient-to-r from-[#a4d9ff] to-[#ddf2ff] overflow-hidden">

            {/*weird shit i'm adding */}

             
      {/* Floating circles */}
      <div className="circle-1 "></div>
      <div className="circle-2 "></div>
      <div className="circle-3"></div>
      <div className="ring-1"></div>
      <div className="ring-2"></div>
      <div className="ring-3"></div>


            <div className="ml-10 flex-col mt-20">
              <div className="flex gap-8 items-center">
                <p className="text-2xl font-bold">{hospital.hospital_name || hospital.name || 'Unknown Hospital'}</p>
                <img src={Verification} alt="verification badge" className="w-7 h-7 rounded-lg" />
                <p className="ml-3">{hospital.post_count || (posts ? posts.length : 0)} posts</p>
                <p>{hospital.follower_count || 0} followers</p>
                
                {token && (
                  <button 
                    className={`border rounded-lg w-20 h-10 transition-colors ${
                      followLoading 
                        ? 'bg-gray-400 cursor-not-allowed border-gray-400' 
                        : isFollowing 
                          ? 'bg-[#57B9FF] text-white border-[#57B9FF] hover:bg-[#517891]'
                          : 'border-[#57B9FF] hover:bg-[#57B9FF] hover:text-white'
                    }`}
                    onClick={handleFollow}
                    disabled={followLoading}
                  >
                    {followLoading ? '...' : isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
                )}
              </div>

              <div className="flex-col ml-72 space-y-2 mt-4">
                <p className="text-gray-700">{hospital.location || 'Location not specified'}</p>
                <p className="text-gray-600">{hospital.bio || 'No bio available'}</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-center mt-4 p-2">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="flex border border-[#57B9FF] mt-2 h-16 items-center justify-center gap-x-96">
            {categories.map(category => (
              <button
                key={category}
                className={`hover:font-bold ${
                  selectedCategory.toLowerCase() === category.toLowerCase() ? 'font-bold text-[#57B9FF]' : ''
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-8">
            <h3 className="text-xl font-bold mb-4">{selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</h3>
            {renderPostsContent()}
          </div>
        </>
      )}
    </div>
  );
}

export default HospitalStatisticPage;


























































