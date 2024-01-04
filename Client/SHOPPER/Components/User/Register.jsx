import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [telephone1, setTelephone1] = useState("");
  const [telephone2, setTelephone2] = useState("");
  const [address, setAddress] = useState("");
  const [emptyFields, setEmptyFields] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [shortPassword, setShortPassword] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();


  // Function to check if the password meets the criteria
  const isPasswordValid = (password) => {
    const isLengthValid = password.length >= 6;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return isLengthValid && hasLowercase && hasUppercase && hasSpecialCharacter;
  };

  const handleRegistration = async () => {
    // Validate form inputs
    if (
      firstName &&
      lastName &&
      email &&
      password &&
      confirmPassword &&
      password === confirmPassword &&
      isPasswordValid(password)
    ) {
      try {
        // Send registration request to the server
        const response = await axios.post("http://localhost:3001/api/register", {
          firstName,
          lastName,
          email,
          password,
          telephone1,
          telephone2,
          address,
          cart: [],
          orders: [],
        });

        // Extract user ID and JWT token from the response
        const { userId, message } = response.data;

        // Save username, user ID, and token in cookies
        Cookies.set("username", `${firstName} ${lastName}`, { expires: 7 });
        Cookies.set("userId", userId, { expires: 7 });

        console.log(message);
        alert(message);
        navigate("/login");
      } catch (error) {
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
          alert("Registration failed. Please try again later.");
        }
      }
    } else {
      // Set validation flags for form errors
      setEmptyFields(true);
      setPasswordMismatch(password !== confirmPassword);
      setShortPassword(password.length < 6);
      setInvalidPassword(!isPasswordValid(password));
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="w-1/2 flex items-center justify-center">
        {/* Image of a man wearing branded clothing */}
        <img
          src="https://img.freepik.com/free-photo/young-handsome-man-choosing-clothes-shop_1303-19719.jpg"
          alt="Man Wearing Branded Clothing"
          className="object-cover w-full h-screen"
        />
      </div>
      <div className="w-1/2 bg-white p-8  rounded-md shadow-md">
        {/* Registration form */}
        <h2 className="text-3xl font-semibold mb-6 text-center">Welcome!</h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {/* First Name and Last Name inputs in the first row */}
          <div className="grid grid-cols-2 gap-4">
            {/* First Name input */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                className={`w-full p-2 border rounded-md bg-white ${emptyFields && !firstName ? "border-red-500" : ""
                  }`}
                placeholder="Your First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {emptyFields && !firstName && (
                <p className="text-red-500 text-xs mt-1">First Name cannot be empty</p>
              )}
            </div>
            {/* Last Name input */}
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                className={`w-full p-2 border rounded-md bg-white ${emptyFields && !lastName ? "border-red-500" : ""
                  }`}
                placeholder="Your Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {emptyFields && !lastName && (
                <p className="text-red-500 text-xs mt-1">Last Name cannot be empty</p>
              )}
            </div>
          </div>
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
          {/* Telephone 1 and Telephone 2 inputs in the same row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Telephone 1 input */}
            <div>
              <label
                htmlFor="telephone1"
                className="block text-sm font-medium text-gray-700"
              >
                Telephone 1
              </label>
              <input
                type="text"
                id="telephone1"
                className={`w-full p-2 border rounded-md bg-white`}
                placeholder="Your Telephone Number"
                value={telephone1}
                onChange={(e) => setTelephone1(e.target.value)}
              />
            </div>
            {/* Telephone 2 input */}
            <div>
              <label
                htmlFor="telephone2"
                className="block text-sm font-medium text-gray-700"
              >
                Telephone 2
              </label>
              <input
                type="text"
                id="telephone2"
                className={`w-full p-2 border rounded-md bg-white`}
                placeholder="Your Telephone Number"
                value={telephone2}
                onChange={(e) => setTelephone2(e.target.value)}
              />
            </div>
          </div>
          {/* Address input */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Shipping Address
            </label>
            <input
              type="text"
              id="address"
              className={`w-full p-2 border rounded-md bg-white`}
              placeholder="Your Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          {/* Password and Confirm Password inputs in the same row */}
          <div className="grid grid-cols-2 gap-4">
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
                    } ${shortPassword || invalidPassword ? "border-red-500" : ""}`}
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
                <p className="text-red-500 text-xs mt-1">Password cannot be empty</p>
              )}
              {shortPassword && password && (
                <p className="text-red-500 text-xs mt-1">
                  Password must be at least 6 characters
                </p>
              )}
              {invalidPassword && (
                <p className="text-red-500 text-xs mt-1">
                  Password must contain at least one lowercase letter, one uppercase letter, and one special character
                </p>
              )}
            </div>
            {/* Confirm Password input */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  className={`w-full p-2 border rounded-md bg-white ${(emptyFields || passwordMismatch) && !confirmPassword
                      ? "border-red-500"
                      : ""
                    }`}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {/* Eye icon to toggle confirm password visibility */}
                <span
                  className="absolute top-2 right-2 mt-1 cursor-pointer transition-transform transform-gpu hover:scale-105"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {(emptyFields || passwordMismatch) && !confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  Confirm Password cannot be empty
                </p>
              )}
              {passwordMismatch && confirmPassword && (
                <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
              )}
            </div>
          </div>
          {/* Submit button */}
          <button
            type="submit"
            onClick={handleRegistration}
            className="bg-black hover:bg-gray-900 text-white font-semibold rounded py-2 px-4 w-full transition-transform transform-gpu hover:scale-105"
          >
            Sign Up
          </button>
        </form>
        {/* Login link */}
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-black font-bold cursor-pointer text-lg underline transition-transform transform-gpu hover:scale-105 duration-300">
            Log in here
          </Link>
        </p>
        {/* Trademark or Copyright information */}
        <div className="absolute bottom-4 text-gray-500">
          &copy; 2024 BAUHINIA |{" "}
          <span className="text-black">
            <a href="#">Privacy Policy</a> | <a href="#">Shipping & Returns</a> |{" "}
            <a href="#">Terms & Conditions</a> | <a href="#">Where are we?</a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
