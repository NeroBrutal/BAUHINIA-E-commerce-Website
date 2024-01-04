// StaffProfile.js
import { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import Cookies from "js-cookie";

const StaffProfile = () => {
  const [cookies] = useCookies(["StaffEmail"]);
  const email = cookies.StaffEmail;
  

  const [staffDetails, setStaffDetails] = useState(null);

  useEffect(() => {
    if (!email) {
      // Handle the case where staff email is not available in cookies
      return;
    }

    // Fetch staff details based on the email
    const fetchStaffDetails = async () => {
      console.log(email)
      try {
        const response = await axios.get(
          `http://localhost:3001/api/staff/${email}`
        );
        setStaffDetails(response.data);
        Cookies.set("role", staffDetails.role, { expires: 7 });

      } catch (error) {
        console.error("Error fetching staff details:", error);
      }
    };

    fetchStaffDetails();
  }, [email,staffDetails]);

  if (!staffDetails) {
    return <div>Loading staff details...</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-3xl font-semibold mb-4">Staff Profile</h2>
      <div>
        <p>Email: {staffDetails.email}</p>
        <p>First Name: {staffDetails.firstName}</p>
        <p>Last Name: {staffDetails.lastName}</p>
        <p>Role: {staffDetails.role}</p>
      </div>
    </div>
  );
};

export default StaffProfile;
