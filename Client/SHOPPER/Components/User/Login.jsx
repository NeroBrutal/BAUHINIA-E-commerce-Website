/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { ReactSession } from "react-client-session";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emptyFields, setEmptyFields] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onPageLoad = () => {
      var isLogged = ReactSession.get("isLogged");
      if (isLogged) {
        ReactSession.set("isLogged", false);
      }
    };

    if (document.readyState === "complete") {
      onPageLoad();
    } else {
      window.addEventListener("load", onPageLoad, false);
      return () => window.removeEventListener("load", onPageLoad);
    }
  }, []);

  const handleLogin = async () => {
    // Validate form inputs
    if (email && password) {
      try {
        // Send login request to the server
        const response = await axios.post("http://localhost:3001/api/login", {
          email,
          password,
        });

        // Extract user details from the response
        const { userId, username, message } = response.data;

        // Save user details in cookies and session
        Cookies.set("email", email, { expires: 7 });
        // Set the login state to true
        ReactSession.set("isLogged", true);

        // Log the success message
        console.log(message);

        // Navigate to the user page (you need to define the route for the user page)
        navigate("/");
      } catch (error) {
        // Handle login failure
        console.error(error);

        // Check if the error response contains a message
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          // Display the error message to the user
          alert(error.response.data.message);
        } else {
          // Display a generic error message
          alert("Login failed. Please try again later.");
        }
      }
    } else {
      // Set validation flags for form errors
      setEmptyFields(true);
    }
  };

  const handleForgotPassword = () => {
    // Implement logic for handling forgot password
    // For example, send a password reset link to the user's email
    // You can open a modal or redirect to a separate forgot password page
    console.log("Forgot Password");
    setShowForgotPasswordModal(true);
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="w-1/2 flex items-center justify-center">
        {/* Image of a person using a laptop */}
        <img
          src="https://img.freepik.com/premium-photo/beautiful-black-jacket-young-guy-modern-store-with-new-clothes-elegant-expensive-wear-men_146671-48568.jpg"
          alt="Person Using Laptop"
          className="object-cover w-full h-screen"
        />
      </div>
      <div className="w-1/2 bg-white p-8  rounded-md shadow-md">
        {/* Login form */}
        <h2 className="text-3xl font-semibold mb-6 text-center">
          Welcome Back!
        </h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {/* Email input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`w-full p-2 border rounded-md bg-white ${emptyFields && !email ? "border-red-500" : ""
                }`}
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emptyFields && !email && (
              <p className="text-red-500 text-xs mt-1">Email cannot be empty</p>
            )}
          </div>
          {/* Password input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={`w-full p-2 border rounded-md bg-white ${emptyFields && !password ? "border-red-500" : ""
                  }`}
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* Eye icon to toggle password visibility */}
              <span
                className="absolute top-2 right-2 mt-1 cursor-pointer transition-transform transform-gpu hover:scale-105"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {emptyFields && !password && (
              <p className="text-red-500 text-xs mt-1">
                Password cannot be empty
              </p>
            )}
          </div>
          {/* Submit button */}
          <button
            type="submit"
            onClick={handleLogin}
            className="bg-black hover:bg-gray-900 text-white font-semibold rounded py-2 px-4 w-full transition-transform transform-gpu hover:scale-105"
          >
            Log In
          </button>
        </form>
        {/* Forgot Password link */}
        <p className="mt-2 text-center">
          <span
            className="text-black cursor-pointer underline"
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </span>
        </p>
        {/* Signup link */}
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-black font-bold cursor-pointer text-lg underline transition-transform transform-gpu hover:scale-105 duration-300"
          >
            Sign up here
          </Link>
        </p>
        {/* Trademark or Copyright information */}
        <div className="absolute bottom-4 text-gray-500">
          &copy; 2024 BAUHINIA |{" "}
          <span className="text-black">
            <a href="#">Privacy Policy</a> | <a href="#">Shipping & Returns</a>{" "}
            | <a href="#">Terms & Conditions</a> | <a href="#">Where are we?</a>
          </span>
        </div>

        {/* Modal for Forgot Password */}
        {showForgotPasswordModal && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-md shadow-md">
              <h2 className="text-2xl font-semibold mb-6 text-center">
                Forgot Password
              </h2>
              <p className="text-gray-700 mb-4">
                Enter your email address, and we'll send you a link to reset
                your password.
              </p>
              {/* Add your form elements for password recovery here */}
              <div className="flex justify-between">
                <button
                  onClick={() => setShowForgotPasswordModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full"
                >
                  Close
                </button>
                {/* Add your button or form submission for password recovery */}
                <button className="bg-black hover:bg-gray-900 text-white font-semibold rounded-full py-2 px-4">
                  Send Reset Link
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
