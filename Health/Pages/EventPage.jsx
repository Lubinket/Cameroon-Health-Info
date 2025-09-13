
import Header from "../components/Header";
import axios from 'axios';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { renderPostsByCategory } from "../components/ReusableFunction";


function EventPage (){
  const [posts, setPosts] = useState([]);
  //const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/posts/list/`
        );
        setPosts(response.data);
      } catch (err) {
        setError('Failed to load posts');
      }
    };
    fetchPosts();
  }, []);
  

  return (
   <div className ='event-page'>
    <div >
    <Header/>
    </div>



    <div className = "mt-28 ">

      <div className = "text-center "> 

      <p className = " text-4xl font-bold "> Events </p>
      <p className = " font-semibold mb-12 "> "Browse upcoming hospital events, workshops, and health programs. Keep track of what’s happening in your community."</p>
      </div>
     
      <div className="gap-2 px-4 md:px-6 lg:px-8">
      {renderPostsByCategory(posts, "events", navigate)}
      </div>
     





    </div>

        </div>
  );

}

export default EventPage;

