import React from "react";
import Header from "../components/Header";
import Verification from "../assets/verification.png";
import Review1 from "../assets/review1.jpeg";


function HospitalPortal(){
  return(
   <div className = " hospital-portal">
    <Header/>

    <div className = " relative  h-[360px] flex-col mt-24  flex   bg-gradient-to-tl from-[#90D5FF] to-[#FFFFFF]  overflow-hidden   "> 

    <div className="ring  top-1 bottom-10  right-80 w-32 h-32 border-4 "></div>
    <div className="ring  top-20 bottom-10  right-[600px] w-[250px] h-[250px] border-8 "></div>

     <div className = " hospital-row flex  mt-16 gap-9 ml-16 items-center mb-6  text-2xl  "> 
    <p  className = " text-2xl font-bold "> CHU</p>
    <img src={Verification} alt="vericationbadge" className=" mr-10 w-7 h-7 rounded-lg" />
     <p> 4 posts</p>
     <p>6 following  </p>
     </div>

     <div className = " ml-16 space-y-2 "> 
      <p> Location: Yaounde VI</p>
      <p> Weirdass bio : </p>
      <p > dumb link</p>

     </div>



    </div>

    <div className = "border w-[1510px] border-[#90D5FF] font-bold   flex  justify-between items-center  mt-2  h-[60px] rounded-lg  ml-3 mb-3 ">
     
     <buttons className = " ml-14 ">  Events 
     </buttons>
      
       <buttons className = " ">  Vaccinations 
     </buttons>

      <buttons className = " ">  Free Screenings 
     </buttons>

      <buttons className = "mr-12 ">  Donations
     </buttons>

    </div>

     


        <div className = " flex "> 
        <div className = "ngo-card " >  
     
                 <div className = " w-[390px] h-[220px] ">
                  <img src={Review1} alt="review1" className="h-full w-full object-cover rounded-lg" />
                 </div>
            
     
                 <div className = "card-info space-y-3 mt-3  ml-1">
                 <p className = " text-xl font-bold  "> Breast cancer awareness in your area</p>
                 <div className = " flex gap-4"> 
                  
                   <p>  0 views </p>
                   <p> .3weeks ago </p>
                    </div>
                    </div>
                  
               </div>

                <div className = "ngo-card " >  
     
                 <div className = " w-[390px] h-[220px] ">
                  <img src={Review1} alt="review1" className="h-full w-full object-cover rounded-lg" />
                 </div>
            
     
                 <div className = "card-info space-y-3 mt-3  ml-1">
                 <p className = " text-xl font-bold  "> Breast cancer awareness in your area</p>
                 <div className = " flex gap-4"> 
                  
                   <p>  0 views </p>
                   <p> .3weeks ago </p>
                    </div>
                    </div>
                  
               </div>










               </div>

    
   </div>
  );
}

export default HospitalPortal