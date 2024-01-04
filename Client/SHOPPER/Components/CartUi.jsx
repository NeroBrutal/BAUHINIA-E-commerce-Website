import { useEffect, useState } from "react";
import { FaShoppingCart, FaHome, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ReactSession } from "react-client-session";
ReactSession.setStoreType("localStorage");
import Modal from "react-modal";

const CartUI = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ cart: [] });
  const [cookies] = useCookies(["email"]);
  const emailFromCookies = cookies.email;
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

  const handleProceedToPay = () => {
    // Open the payment modal
    setPaymentModalOpen(true);
  };

  const handleConfirmPayment = async () => {
    try {
      // Send a request to the backend to save the order
      const response = await fetch(`http://localhost:3001/api/createOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailFromCookies,
          cart: userData.cart,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create order.');
      }
  
      // Close the payment modal
      setPaymentModalOpen(false);
  
      // Update the local state to reflect the cleared cart
      setUserData((prevUserData) => ({
        ...prevUserData,
        cart: [],
      }));
  
      // Navigate to the payment success page or any other page you want
      navigate('/UserProfile');
    } catch (error) {
      console.error('Error confirming payment:', error);
    }
  };

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (emailFromCookies) {
          const response = await fetch(
            `http://localhost:3001/api/customer/${emailFromCookies}`
          );
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserData();
  }, [emailFromCookies]);

  const handleDelete = async (product) => {
    try {
      // Send a request to the backend to delete the product from the cart
      await fetch(`http://localhost:3001/api/removeFromCart`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailFromCookies,
          product,
        }),
      });
      console.log(product);
      // Update the local state to reflect the removed product
      setUserData((prevUserData) => ({
        ...prevUserData,
        cart: prevUserData.cart.filter((item) => item.product !== product),
      }));
    } catch (error) {
      console.error("Error deleting product from cart:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white p-6 shadow-md flex justify-between items-center">
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
          <FaUser
            className="text-gray-800 cursor-pointer"
            onClick={() => navigate("/UserProfile")}
          />
        </div>
      </nav>

      {/* Main content */}
      <div className="mt-20 p-4">
        <h2 className="text-3xl font-semibold mb-6">Shopping Cart</h2>

        {/* Check if the cart is empty */}
        {userData.cart.length === 0 ? (
          <div className="text-center">
            <img
              src="https://www.99fashionbrands.com/wp-content/uploads/2020/12/empty_cart.png"  
              alt="Empty Cart"
              className="mx-auto mb-4"
            />
          </div>
        ) : (
          // Render the table if the cart is not empty
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Product</th>
                <th className="py-2 px-4 border-b text-right">Price</th>
                <th className="py-2 px-4 border-b text-right">Quantity</th>
                <th className="py-2 px-4 border-b text-center"></th>
              </tr>
            </thead>
            <tbody>
              {userData.cart.map((cartItem) => (
                <tr key={cartItem.product._id}>
                  <td className="py-2 px-4 border-b text-left">
                    <div className="flex items-center">
                      {cartItem.image && (
                        <img
                          src={cartItem.image}
                          alt={cartItem.name}
                          className="w-12 h-12 object-cover mr-4"
                        />
                      )}
                      {cartItem.name}
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b text-right">
                    Rs-{cartItem.price}
                  </td>
                  <td className="py-2 px-10 border-b text-right">
                    {cartItem.quantity}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      onClick={() => handleDelete(cartItem.product)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Display total and proceed to pay button */}
        {userData.cart.length > 0 && (
          <div className="mt-4">
            <p className="text-xl font-semibold text-center ml-72">
              Total: Rs-{calculateTotal()}
            </p>
            <button
              className="mt-4 bg-gray-800 text-white rounded px-4 py-2"
              onClick={handleProceedToPay}
            >
              Proceed to Pay
            </button>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onRequestClose={() => setPaymentModalOpen(false)}
        contentLabel="Payment Modal"
      >
        <h2>Payment Confirmation</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Product</th>
              <th className="py-2 px-4 border-b">Price</th>
              <th className="py-2 px-4 border-b">Quantity</th>
              <th className="py-2 px-4 border-b">Total</th>
            </tr>
          </thead>
          <tbody>
            {userData.cart.map((cartItem) => (
              <tr key={cartItem.product._id}>
                <td className="py-2 px-4 border-b">
                  {cartItem.image && (
                    <img
                      src={cartItem.image}
                      alt={cartItem.name}
                      className="w-12 h-12 object-cover mr-4"
                    />
                  )}
                  {cartItem.name}
                </td>
                <td className="py-2 px-4 border-b">Rs-{cartItem.price}</td>
                <td className="py-2 px-4 border-b">{cartItem.quantity}</td>
                <td className="py-2 px-4 border-b">
                  Rs-{cartItem.price * cartItem.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Display User Information */}
        <div className="mb-4 mt-4">
          <strong>Name:</strong> {userData.firstName} {userData.lastName}
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

        <div className="mt-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-gray-600"
            />
            <span className="ml-2">Cash on Delivery</span>
          </label>
          <button
            className="bg-gray-800 text-white rounded px-4 py-2 mt-4 ml-2"
            onClick={handleConfirmPayment}
          >
            Confirm Payment
          </button>
        </div>
      </Modal>
    </div>
  );

  function calculateTotal() {
    return userData.cart.reduce(
      (total, cartItem) => total + cartItem.price * cartItem.quantity,
      0
    );
  }
};

export default CartUI;
