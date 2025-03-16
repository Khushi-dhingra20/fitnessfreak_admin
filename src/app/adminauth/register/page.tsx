'use client'
import React,{useState} from 'react'
import '../auth.css';
import { ToastContainer,toast } from 'react-toastify';


const SignupPage = () => {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const[ password,setPassword] = useState("");

  const handleSigup = async () => {  
    try{
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API + "/admin/register",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body: JSON.stringify({name,email,password}),
        credentials:"include"
      })
      const data = await response.json();
      if(data.ok){
        
        console.log("Admin registeration successful",data);
        toast.success("Admin registration successful", {
          position: "top-center", // Use a string for the position
        });
      }
      else{
        console.error("Admin registeration failed",response.statusText);
        toast.error("Admin registration failed", {
          position: "top-center", // Use a string for the position
        });
      }
    } catch(error){
      toast.error("An error occurred during registeration");
      console.error("An error occurred during registeration",error);
    }
  }
  
  return (
    <div className='formpage'>
      <input
      type='text'
      placeholder='Name'
      value={name}
      onChange={(e)=> setName(e.target.value)}
      />
      <input
      type='email'
      placeholder='Email'
      value={email}
      onChange={(e)=> setEmail(e.target.value)}
      />
      <input
      type='password'
      placeholder='Password'
      value={password}
      onChange={(e)=> setPassword(e.target.value)}
      />
      <button 
      onClick={handleSigup}>Sign up</button>
      
    </div>
  )
}

export default SignupPage
