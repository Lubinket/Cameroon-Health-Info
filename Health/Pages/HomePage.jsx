
import axios from 'axios';
import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from 'date-fns';
import Herodiv from "../components/Herodiv";
import Header from "../components/Header";
import TestImage from "../assets/testimage1.jpeg";
import Verification from "../assets/verification.png";
import Review1 from "../assets/review1.jpeg";
import Uppermoon from "../assets/uppermoon.jpeg";
import Demon from "../assets/demon.jpeg";
import Footer  from "../components/Footer";
import FAQ from '../components/FAQ';
import { useNavigate } from "react-router-dom";
import "../style/Homepage.css";
import { ArrowRight } from "lucide-react";


function HomePage() {

  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
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




// const filteredPosts = posts.filter(post => post.category === category).slice(0, 4);

 const renderPostsByCategory = ( category) => {
    const filteredPosts = posts.filter(post => post.category === category).slice(0, 4);
  
    if (filteredPosts.length === 0) {
      return <p className="text-center text-gray-500 mt-10">No posts available</p>;
    }
  
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPosts.map(post => (
          <div
            key={post.id}
            className="cursor-pointer transition-transform  hover:scale-105 bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden mb-4"
            onClick={() => navigate(`/information/${post.id}`)}
          >
            <div className=" w-full h-56 ">
             {/* <img
                src={post.image ? `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${post.image}` : TestImage}
                alt={post.title}
                className="w-full h-full object-cover rounded-xl p-1"
              />*/}
               {console.log('Post image value:', post.image)}
              <img
               src={post.image || TestImage}
               alt={post.title}
               className="w-full h-full object-cover rounded-xl p-1"
               />


            </div>
            <div className="p-4 space-y-2">
              <p className="text-lg font-bold">{post.title}</p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600">{post.hospital_name}</p>
                <img src={Verification} alt="verificationbadge" className="w-5 h-5" />
                <p className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  
  




return(
      <div> 
      <Header/>
      <div className = "mt-24">
        <Herodiv/>
      </div>
       <div className =" flex justify-between mt-7 mb-10 "> 
       <p className = "  text-2xl font-bold  ml-32"  > Vaccinations </p>

       <button  className = " button-text"
       onClick={() => navigate("/vaccination-page")}
       >  More Vaccinations 
        <ArrowRight className="w-8 h-8" /> 
        </button>
       </div>
      
      
        <div className = "  gap-2 px-4 md:px-6 lg:px-8">
         {renderPostsByCategory('vaccinations')} 
      

          
        </div>


       <div className = " flex justify-between mt-7 mb-10 "> 
       <p className = " text-2xl font-bold  ml-32 "  > Screenings </p>

       <button  className = " button-text"
        onClick={() => navigate("/screening-page")}

       >  More Screenings 
       
        <ArrowRight className="w-8 h-8" /> 
        </button>
       </div>
      
        


          <div className = " gap-2 px-4 md:px-6 lg:px-8">
          {renderPostsByCategory('screenings')}
        </div>
        
          

       <div className = " flex justify-between mt-7 mb-10 "> 
       <p className = " text-2xl font-bold  ml-32"  > Hospitalevents </p>

       <button  className = " button-text "
       onClick={() => navigate("/event-page")}>  More Events 
        <ArrowRight className="w-8 h-8" /> 
        </button>
       </div>


          <div className = " gap-2 px-4 md:px-6 lg:px-8">
          {renderPostsByCategory('events')}
        </div>



    

        <div className = " flex justify-between mt-7 mb-10 "> 
       <p className = " text-2xl font-bold  ml-32"  > Donations </p>

       <button  className = " button-text">  More Donations 
        <ArrowRight className="w-8 h-8" /> 
        </button>
       </div>


       <div className = "gap-2 px-4 md:px-6 lg:px-8">
          {renderPostsByCategory('donations')}
        </div>


    <div className=" review-section ">
  {/* Heading */}
  <p className=" text-1 ">
    What some of our users say
  </p>
  <p className=" text-2 ">
    Feel free to sign up and tell us what to think
  </p>

  {/* Cards Container */}
  <div className=" cards-container ">
    
    {/* Card 1 */}
    <div className="info-card  ">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={Review1}
          alt="review1"
          className=" profile-pic"
        />
        <p className="font-light">Timah, Batibo</p>
      </div>
      <p className="text-sm md:text-base">
        "I found a free malaria screening hospital nearby using the map and got a notification after subscribing. So easy just on my basic phone."
      </p>
    </div>

    {/* Card 2 */}
    <div className="info-card">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={Demon}
          alt="demon"
          className=" profile-pic"
        />
        <p className="font-light">Timah, Batibo</p>
      </div>
      <p className="text-sm md:text-base">
        "I found a free malaria screening hospital nearby using the map and got a notification after subscribing. So easy just on my basic phone."
      </p>
    </div>

    {/* Card 3 */}
    <div className="info-card ">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={Uppermoon}
          alt="uppermoon"
          className=" profile-pic "
        />
        <p className="font-light">Azenui, Bambili</p>
      </div>
      <p className="text-sm md:text-base">
        "I found a free malaria screening hospital nearby using the map and got a notification after subscribing. So easy just on my basic phone."
      </p>
    </div>

  </div>
</div>

          <div>



            <FAQ/>
           </div>
            <Footer/>

          
</div>
   
  );
}

export default HomePage;
