
import Header from "../components/Header";
import axios from 'axios';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { renderPostsByCategory } from "../components/ReusableFunction";


function ScreeningPage (){
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
   <div className ='screening-page'>
    <div >
    <Header/>
    </div>



    <div className = "mt-28 ">

      <div className = "text-center "> 

      <p className = " text-4xl font-bold "> Screenings </p>
      <p className = " font-semibold mb-12 "> 
        “Early detection saves lives.
         Discover free and paid health screenings available near you.
         Stay proactive about your health with regular checkups and programs.” </p>
      </div>
     
      <div className="gap-2 px-4 md:px-6 lg:px-8">
      {renderPostsByCategory(posts, "screenings", navigate)}
      </div>
     

    </div>

        </div>
  );

}

export default ScreeningPage;

