'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../auth.css';


const SigninPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // console.log({email,password})
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      // console.log({email,password})
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Login failed!', {
          position: 'top-center',
        });
        return;
      }

      const data = await response.json();
      toast.success('Login successful!', {
        position: 'top-center',
      });
      console.log('Logged in:', data);


      window.location.href = '/addworkout';



    } catch (error) {
      toast.error('An error occurred during login.', {
        position: 'top-center',
      });
      console.error('Login error:', error);
    }
  };

  return (
    <div className='formpage'>
      <header>
        <h1>Admin Login</h1>
      </header>
      <main>
        <div>
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Sign In</button>
        </div>
      </main>
      <footer>
        <p>© 2025 Fitness Tracker. All rights reserved.</p>
      </footer>
      <ToastContainer />
    </div>
  );
};

export default SigninPage;
