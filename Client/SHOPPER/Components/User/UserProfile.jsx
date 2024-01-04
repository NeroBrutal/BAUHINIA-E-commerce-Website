// UserProfile.js
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { FaHome, FaShoppingCart, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ReactSession } from "react-client-session";
ReactSession.setStoreType("localStorage");

const UserProfile = () => {
  const [cookies] = useCookies(["email"]);
  const emailFromCookies = cookies.email;

  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  // State variables for editable fields
  const [editableFields, setEditableFields] = useState({
    firstName: "",
    lastName: "",
    address: "",
    telephone1: "",
    telephone2: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!emailFromCookies) {
      // Handle the case where email is not available in cookies
      return;
    }

    const fetchUserData = async () => {
      try {
        const userResponse = await fetch(
          `http://localhost:3001/api/customer/${emailFromCookies}`
        );
        const userData = await userResponse.json();
        setUserData(userData);

        const ordersResponse = await fetch(
          `http://localhost:3001/api/orders/${emailFromCookies}`
        );
        const ordersData = await ordersResponse.json();
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserData();
  }, [emailFromCookies]);

  useEffect(() => {
    const onPageLoad = () => {
      var isLogged = ReactSession.get("isLogged");
      if (!isLogged) {
        window.alert("Not Logged In");
        navigate("/login");
      }
    };
    if (document.readyState === "complete") {
      onPageLoad();
    } else {
      window.addEventListener("load", onPageLoad, false);
      return () => window.removeEventListener("load", onPageLoad);
    }
  }, [navigate]);

  const handleEditProfile = () => {
    setEditModalOpen(true);

    setEditableFields({
      firstName: userData.firstName,
      lastName: userData.lastName,
      address: userData.address,
      telephone1: userData.telephone1,
      telephone2: userData.telephone2,
    });
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/updateCustomer/${emailFromCookies}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editableFields),
        }
      );

      if (response.ok) {
        setUserData((prevUserData) => ({
          ...prevUserData,
          ...editableFields,
        }));
        setEditModalOpen(false);
      } else {
        console.error("Error updating user details:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Background Image */}
      <div
        className="w-1/2 bg-cover bg-center h-screen"
        style={{
          backgroundImage:
            'url("https://www.themanual.com/wp-content/uploads/sites/9/2023/07/Levis-501-store.jpg?fit=3000%2C2000&p=1")',
        }}
      />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white p-6 shadow-md flex justify-between items-center z-10">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-gray-800 mr-4">
            BAUHINIA
          </span>
        </div>

        <div className="flex items-center">
          <FaHome
            className="text-gray-800 mr-8 cursor-pointer"
            onClick={() => navigate("/")}
          />
          <FaShoppingCart
            className="text-gray-800 mr-8 cursor-pointer"
            onClick={() => navigate("/CartUi")}
          />
          <FaUser className="text-gray-800 cursor-pointer" />
        </div>
      </nav>

      {/* User Details Section */}
      <div className="container mx-auto mt-20 p-4 flex-1 flex relative mr-10">
        {/* User Details */}
        <div className="w-1/2 mr-8 z-10">
          <h2 className="text-2xl font-semibold">User Details</h2>
          {userData ? (
            <>
              {isEditModalOpen ? (
                <>
                  <div className="mb-4 mt-3">
                    <strong>Name:</strong>{" "}
                    <input
                      type="text"
                      value={editableFields.firstName}
                      onChange={(e) =>
                        setEditableFields({
                          ...editableFields,
                          firstName: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      value={editableFields.lastName}
                      onChange={(e) =>
                        setEditableFields({
                          ...editableFields,
                          lastName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-4">
                    <strong>Email:</strong> {userData.email}
                  </div>
                  <div className="mb-4">
                    <strong>Shipping Address:</strong>{" "}
                    <input
                      type="text"
                      value={editableFields.address}
                      onChange={(e) =>
                        setEditableFields({
                          ...editableFields,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-4">
                    <strong>Telephone 1:</strong>{" "}
                    <input
                      type="text"
                      value={editableFields.telephone1}
                      onChange={(e) =>
                        setEditableFields({
                          ...editableFields,
                          telephone1: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-4">
                    <strong>Telephone 2:</strong>{" "}
                    <input
                      type="text"
                      value={editableFields.telephone2}
                      onChange={(e) =>
                        setEditableFields({
                          ...editableFields,
                          telephone2: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4 mt-3">
                    <strong>Name:</strong>{" "}
                    {userData.firstName} {userData.lastName}
                  </div>
                  <div className="mb-4">
                    <strong>Email:</strong> {userData.email}
                  </div>
                  <div className="mb-4">
                    <strong>Shipping Address:</strong> {userData.address}
                  </div>
                  <div className="mb-4">
                    <strong>Telephone 1:</strong> {userData.telephone1}
                  </div>
                  <div className="mb-4">
                    <strong>Telephone 2:</strong> {userData.telephone2}
                  </div>
                </>
              )}
              <div className="mb-4">
                {isEditModalOpen ? (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    onClick={handleSaveProfile}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    onClick={handleEditProfile}
                  >
                    Edit
                  </button>
                )}
              </div>
            </>
          ) : (
            <p>Loading user details...</p>
          )}
        </div>

        {/* Orders Section */}
        <div className="w-1/2 pl-4 z-10">
          <h2 className="text-2xl font-semibold mb-4">Order History</h2>
          {orders.length > 0 ? (
            <ul className="list-disc pl-4">
              {orders.map((order) => (
                <li key={order._id} className="mb-2">
                  <strong>Order Date:</strong>{" "}
                  {new Date(order.orderDate).toLocaleString()}
                  <br />
                  <strong>Status:</strong> {order.status}
                  <br />
                  <strong>Total:</strong> Rs-{calculateOrderTotal(order)}
                </li>
              ))}
            </ul>
          ) : (
            <p>No orders found.</p>
          )}
        </div>
      </div>
    </div>
  );

  function calculateOrderTotal(order) {
    return order.products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  }
};

export default UserProfile;
