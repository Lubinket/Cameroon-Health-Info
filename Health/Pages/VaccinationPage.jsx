
import Header from "../components/Header";
import axios from 'axios';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { renderPostsByCategory } from "../components/ReusableFunction";


function VaccinationPage (){
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
   <div className ='vaccination-page'>
    <div >
    <Header/>
    </div>



    <div className = "mt-28 ">

      <div className = "text-center "> 

      <p className = " text-4xl font-bold "> Vaccinations </p>
      <p className = " font-semibold mb-12 "> “Protect your little ones with essential vaccines.
Stay informed about newborn and childhood vaccination schedules.
Explore upcoming vaccination events and keep your family healthy.”</p>
      </div>
     
      <div className="gap-2 px-4 md:px-6 lg:px-8">
      {renderPostsByCategory(posts, "vaccinations", navigate)}
      </div>
     





    </div>

        </div>
  );

}

export default VaccinationPage;

