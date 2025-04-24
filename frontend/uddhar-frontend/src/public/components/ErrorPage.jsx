import React from "react";
import { plug } from "../../assets/Assests.jsx";

const Errors = [
  {
    id: 1,
    errcode: 404,
    errmessage: "Page Not Found",
  },
  {
    id: 2,
    errcode: 400,
    errmessage: "Bad Request",
  },
  
];

function ErrorPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="text-center">
        <div className="mb-6">
          {/* Plug Image Placeholder - replace with your image if needed */}
          <img
            src={plug}
            alt="Disconnected Plug"
            className="mx-auto w-52 h-auto"
          />
        </div>
        {Errors.map((error) => (
          <div key={error.id} className="text-center mb-6">
            <h1 className="text-6xl font-bold text-red-500 mb-4">
              {error.errcode}
            </h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {error.errmessage}
            </h2>
          </div>
        ))}
        <p className="text-gray-500 mb-6">
          We’re sorry, the page you requested could not be found.
          <br />
          Please go back to the homepage.
        </p>
        <button
          onClick={() => (window.location.href = "/")} // Redirect to home page
          className="px-6 py-3 bg-amber-500 text-white font-medium rounded-full shadow hover:bg-amber-700 transition"
        >
          GO HOME
        </button>
      </div>
    </div>
  );
}

export default ErrorPage;
