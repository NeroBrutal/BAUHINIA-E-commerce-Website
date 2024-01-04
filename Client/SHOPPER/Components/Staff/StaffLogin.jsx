import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { ReactSession } from "react-client-session";

const StaffLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emptyFields, setEmptyFields] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onPageLoad = () => {
      var isStaffLogged = ReactSession.get("isStaffLogged");
      if (isStaffLogged) {
        ReactSession.set("isStaffLogged", false);
      }
    };

    if (document.readyState === "complete") {
      onPageLoad();
    } else {
      window.addEventListener("load", onPageLoad, false);
      return () => window.removeEventListener("load", onPageLoad);
    }
  }, []);

  const handleStaffLogin = async () => {
    if (email && password) {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/staff/login",
          {
            email,
            password,
          }
        );

        const { message, role } = response.data;

        Cookies.set("StaffEmail", email, { expires: 7 });
        Cookies.set("role", role, { expires: 7 });
        ReactSession.set("isStaffLogged", true);

        console.log(message);

        // Navigate to the staff dashboard or any other desired route
        navigate("/ProductManagement");
      } catch (error) {
        console.error(error);

        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          alert(error.response.data.message);
        } else {
          alert("Login failed. Please try again later.");
        }
      }
    } else {
      setEmptyFields(true);
    }
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
      <div className="w-1/2 bg-white p-8 rounded-md shadow-md">
        {/* Staff login form */}
        <h2 className="text-3xl font-semibold mb-6 text-center">Staff Login</h2>
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
              className={`w-full p-2 border rounded-md bg-white ${
                emptyFields && !email ? "border-red-500" : ""
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
                className={`w-full p-2 border rounded-md bg-white ${
                  emptyFields && !password ? "border-red-500" : ""
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
            onClick={handleStaffLogin}
            className="bg-black hover:bg-gray-900 text-white font-semibold rounded py-2 px-4 w-full transition-transform transform-gpu hover:scale-105"
          >
            Log In
          </button>
        </form>
        {/* Signup link */}
        <p className="mt-4 text-center">
          New staff member?{" "}
          <Link
            to="/StaffRegistration"
            className="text-black font-bold cursor-pointer text-lg underline transition-transform transform-gpu hover:scale-105 duration-300"
          >
            Register here
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
      </div>
    </div>
  );
};

export default StaffLogin;
