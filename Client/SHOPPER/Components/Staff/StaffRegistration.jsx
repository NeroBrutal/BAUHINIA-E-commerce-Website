import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";

const StaffRegister = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [telephone, setTelephone] = useState("");
  const [emptyFields, setEmptyFields] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [shortPassword, setShortPassword] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const isPasswordValid = (password) => {
    const isLengthValid = password.length >= 6;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return isLengthValid && hasLowercase && hasUppercase && hasSpecialCharacter;
  };

  const handleRegistration = async () => {
    if (
      firstName &&
      lastName &&
      email &&
      password &&
      confirmPassword &&
      role &&
      password === confirmPassword &&
      isPasswordValid(password)
    ) {
      try {
        // Send staff registration request to the server
        const staffResponse = await axios.post("http://localhost:3001/api/staff/register", {
          firstName,
          lastName,
          email,
          password,
          role,
          telephone,
        });

        // Extract staff ID and message from the response
        const { staffId, message } = staffResponse.data;

        // Save staff ID and message in cookies
        Cookies.set("staffId", staffId, { expires: 7 });

        console.log(message);
        alert(message);
        navigate("/staffLogin");
      } catch (error) {
        console.error(error);

        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          alert(error.response.data.message);
        } else {
          alert("Registration failed. Please try again later.");
        }
      }
    } else {
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
        <h2 className="text-3xl font-semibold mb-6 text-center">Staff Registration</h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                id="firstName"
                className={`w-full p-2 border rounded-md bg-white ${emptyFields && !firstName ? "border-red-500" : ""}`}
                placeholder="Your First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {emptyFields && !firstName && (
                <p className="text-red-500 text-xs mt-1">First Name cannot be empty</p>
              )}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                id="lastName"
                className={`w-full p-2 border rounded-md bg-white ${emptyFields && !lastName ? "border-red-500" : ""}`}
                placeholder="Your Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {emptyFields && !lastName && (
                <p className="text-red-500 text-xs mt-1">Last Name cannot be empty</p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className={`w-full p-2 border rounded-md bg-white ${emptyFields && !email ? "border-red-500" : ""}`}
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emptyFields && !email && (
              <p className="text-red-500 text-xs mt-1">Email cannot be empty</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={`w-full p-2 border rounded-md bg-white ${emptyFields && !password ? "border-red-500" : ""} ${shortPassword || invalidPassword ? "border-red-500" : ""}`}
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
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
              <p className="text-red-500 text-xs mt-1">Password must be at least 6 characters</p>
            )}
            {invalidPassword && (
              <p className="text-red-500 text-xs mt-1">Password must contain at least one lowercase letter, one uppercase letter, and one special character</p>
            )}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className={`w-full p-2 border rounded-md bg-white ${(emptyFields || passwordMismatch) && !confirmPassword ? "border-red-500" : ""}`}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                className="absolute top-2 right-2 mt-1 cursor-pointer transition-transform transform-gpu hover:scale-105"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {(emptyFields || passwordMismatch) && !confirmPassword && (
              <p className="text-red-500 text-xs mt-1">Confirm Password cannot be empty</p>
            )}
            {passwordMismatch && confirmPassword && (
              <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
            )}
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Staff Role</label>
            <select
              id="role"
              className={`w-full p-2 border rounded-md bg-white ${emptyFields && !role ? "border-red-500" : ""}`}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="" disabled>Select Staff Role</option>
              <option value="ProductionManager">Production Manager</option>
              <option value="InventoryHandlingClerk">Inventory Handling Clerk</option>
              <option value="ChiefAccountantManager">Chief Accountant Manager</option>
              <option value="Owner">Owner</option>
            </select>
            {emptyFields && !role && (
              <p className="text-red-500 text-xs mt-1">Staff Role cannot be empty</p>
            )}
          </div>
          <div>
            <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">Telephone</label>
            <input
              type="text"
              id="telephone"
              className={`w-full p-2 border rounded-md bg-white ${emptyFields && !telephone ? "border-red-500" : ""}`}
              placeholder="Your Telephone Number"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
            />
            {emptyFields && !telephone && (
              <p className="text-red-500 text-xs mt-1">Telephone cannot be empty</p>
            )}
          </div>
          <button
            type="submit"
            onClick={handleRegistration}
            className="bg-black hover:bg-gray-900 text-white font-semibold rounded py-2 px-4 w-full transition-transform transform-gpu hover:scale-105"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/StaffLogin" className="text-black font-bold cursor-pointer text-lg underline transition-transform transform-gpu hover:scale-105 duration-300">
            Log in here
          </Link>
        </p>
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

export default StaffRegister;
