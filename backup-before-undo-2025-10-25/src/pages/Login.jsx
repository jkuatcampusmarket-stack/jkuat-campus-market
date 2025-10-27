import React from "react";

export default function Login() {
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <p className="text-slate-600 mb-4">We'll add real authentication with Firebase later. For now, click below to simulate login.</p>
      <button onClick={()=>alert('Simulated login — Firebase setup coming soon!')} className="bg-green-600 text-white px-4 py-2 rounded">Sign in (Google)</button>
    </div>
  );
}
