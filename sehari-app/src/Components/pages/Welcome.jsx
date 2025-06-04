// src/pages/loginpage.js
import React from 'react';
import bgimage from '../images/bg.png';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSign = (e) => {
    e.preventDefault(); // mencegah reload halaman
    // Di sini kamu bisa tambahkan validasi atau autentikasi kalau ada
    navigate('/sign'); 
  };
  const handleSubmit = (e) => {
    e.preventDefault(); // mencegah reload halaman
    // Di sini kamu bisa tambahkan validasi atau autentikasi kalau ada
    navigate('/home'); // redirect ke halaman /home
  };


  return (
    <div className="relative w-full h-screen">
    {/* Background image */}
    <img className="absolute w-full h-full object-cover" alt="bg" src={bgimage} />

    {/* Form wrapper */}
    <div className="absolute z-10 w-full flex min-h-screen items-center justify-center">
      <div className="bg-white/60 rounded-lg shadow-lg px-8 py-16 w-full max-w-md backdrop-blur text-xl">
        <h2 className="text-2xl mb-6 text-center font-judul">Welcome Back!</h2>

        {/* Form Login */}
        <form className='font-isi'>
            <label className="block   mb-1">Work Email</label>
            <div className="flex items-center border rounded-lg mb-1 px-3 py-2 backdrop-blur-md bg-white/30 shadow-sm">
              <span className="mr-2 "></span>
              <input
                type="email"
                placeholder="Enter your work email"
                className="outline-none w-full bg-transparent text-gray-800 placeholder-gray-500"
              />
            </div>

            <label className="block  mb-1">Password</label>
            <div className="flex items-center border rounded-lg mb-1 px-3 py-2 backdrop-blur-md bg-white/30 shadow-sm">
              <span className="mr-2 "></span>
              <input
                type="password"
                placeholder="Enter password"
                className="outline-none w-full bg-transparent text-gray-800 placeholder-gray-500"
              />
          </div>
          <div className="text-center  mb-4 mt-4 cursor-pointer hover:underline" onClick={handleSign}>
            Don't have an account? <a className='text-blue-700'>Sign up</a>
          </div>

          <button
            type="submit"
            className="bg-black hover:bg-white hover:text-black text-white py-2 w-full rounded mb-3  font-semibold" onClick={handleSubmit}
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  </div>
);
};

export default LoginPage;
