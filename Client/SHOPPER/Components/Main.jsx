/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaSearch, FaHome, FaUser } from "react-icons/fa";
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PropTypes from "prop-types";
import Cookies from "js-cookie";

// Custom arrow component
const CustomArrow = ({ direction, onClick }) => (
  <div
    className={`absolute top-1/2 ${
      direction === "left" ? "left-2" : "right-2"
    } transform -translate-y-1/2 cursor-pointer bg-gray-800 text-white rounded-full p-2 z-10`}
    onClick={onClick} // Make sure onClick is provided
  >
    {direction === "left" ? "<" : ">"}
  </div>
);

CustomArrow.propTypes = {
  direction: PropTypes.oneOf(["left", "right"]).isRequired,
  onClick: PropTypes.func.isRequired,
};

function Main() {
  const navigate = useNavigate();
  const [discountSalesProducts, setDiscountSalesProducts] = useState([]);
  const [mensProducts, setMensProducts] = useState([]);
  const [womenProducts, setWomenProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Fetch products from the backend
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/allProducts");
        const data = await response.json();

        // Separate products based on category
        const discountProducts = data.filter(
          (product) => product.category === "Discount"
        );
        const mensProducts = data.filter(
          (product) => product.category === "Men"
        );
        const womenProducts = data.filter(
          (product) => product.category === "Women"
        );

        setDiscountSalesProducts(discountProducts);
        setMensProducts(mensProducts);
        setWomenProducts(womenProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = async (product) => {
    try {
      const userEmail = Cookies.get("email");
  
      // Send a request to your server to get the user's cart
      const response = await axios.get(`http://localhost:3001/api/customer/${userEmail}`);
      const userData = response.data;
  
      // Check if the product is already in the cart
      const existingCartItem = userData.cart.find((cartItem) => cartItem.product._id === product._id);
  
      if (existingCartItem) {
        // If the product is already in the cart, update the quantity
        const updatedCart = userData.cart.map((cartItem) => {
          if (cartItem.product._id === product._id) {
            return {
              ...cartItem,
              quantity: cartItem.quantity + 1,
            };
          }
          return cartItem;
        });
  
        // Send a request to your server to update the cart
        await axios.put(`http://localhost:3001/api/updateCart/${userEmail}`, { cart: updatedCart });
      } else {
        // If the product is not in the cart, add it
        await axios.post("http://localhost:3001/api/addToCart", {
          userEmail,
          cartItems: [
            {
              product: product._id,
              quantity: 1,
              price: product.price,
              name: product.name,
              image: product.image, // Pass the image URL to the server
            },
          ],
        });
      }
  
      // Show a success message to the user
      alert("Product added to the cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      // Handle the error as needed
      alert("Failed to add the product to the cart. Please Log in or Register.");
    }
  };
  
  
  

  CustomArrow.propTypes = {
    direction: PropTypes.oneOf(["left", "right"]).isRequired,
    onClick: PropTypes.func.isRequired,
  };

  const discountSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <CustomArrow direction="right" />,
    prevArrow: <CustomArrow direction="left" />,
    zIndex: 1,
  };

  const mensSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <CustomArrow direction="right" />,
    prevArrow: <CustomArrow direction="left" />,
  };

  const womensSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <CustomArrow direction="right" />,
    prevArrow: <CustomArrow direction="left" />,
  };

  const handleSearch = () => {
    // Perform scroll to the corresponding section on the same page
    if (searchTerm.toLowerCase() === "men") {
      scrollToSection("men-section");
    } else if (searchTerm.toLowerCase() === "women") {
      scrollToSection("women-section");
    } else {
      alert(`No section found for search term: ${searchTerm}`);
    }
  };
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop,
        behavior: "smooth",
      });
    }
  };

  const handleInputChange = (input) => {
    setSearchTerm(input);

    // Provide suggestions based on the input
    if (input.toLowerCase() === "me") {
      setSuggestions(["Men", "Women"]);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);

    if (suggestion.toLowerCase() === "men") {
      scrollToSection("men-section");
    } else if (suggestion.toLowerCase() === "women") {
      scrollToSection("women-section");
    } else {
      alert(`No section found for suggestion: ${suggestion}`);
    }
  };

  useEffect(() => {
    // Close the suggestion dropdown when the component unmounts
    return () => {
      setSuggestions([]);
    };
  }, []);

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
          <div className="relative">
            <FaSearch
              className="text-gray-800 mr-8 cursor-pointer"
              onClick={() => setShowSearchInput(!showSearchInput)}
            />
            {showSearchInput && (
              <div className="absolute top-0 right-0 mt-16 w-64 flex items-center flex-col">
                <input
                  type="text"
                  placeholder="Search..."
                  className="border border-gray-300 p-2 rounded-t-md w-full"
                  value={searchTerm}
                  onChange={(e) => handleInputChange(e.target.value)}
                />
                {suggestions.length > 0 && (
                  <ul className="border border-gray-300 rounded-b-md w-full">
                    {suggestions.map((suggestion) => (
                      <li
                        key={suggestion}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  className="bg-gray-800 text-white p-2 rounded-b-md w-full"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
            )}
          </div>
          <FaUser
            className="text-gray-800 cursor-pointer"
            onClick={() => navigate("/UserProfile")}
          />
        </div>
      </nav>
      {/* Main content */}
      <div className="mt-20">
        {/* Big Picture after Navbar */}
        <div
          className="w-full h-96 bg-cover bg-center mb-8"
          style={{
            backgroundImage:
              'url("https://www.themanual.com/wp-content/uploads/sites/9/2023/07/Levis-501-store.jpg?fit=3000%2C2000&p=1")',
            backgroundColor: "black",
            height: "576px",
          }}
        ></div>

        <div className="text-black text-center mt-2">
          <p className="text-3xl font-bold mt-3">
            We're a Premium Clothing Brand
          </p>
          <p className="text-xl mt-3">
            Get dressed for yourself, we are inspiring men worldwide to be
            unique, be brave and be divine.
          </p>
        </div>

        <h2 className="text-3xl font-semibold mb-6 mt-10 text-center">
          Discount Sales
        </h2>

        {/* Discount Sales Section Slider */}
        <Slider {...discountSettings}>
          {discountSalesProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white p-4 rounded-md shadow-md"
            >
              <img
                src={product.image}
                alt={product.name}
                className="mb-4 w-full h-96 rounded-md"
              />
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-700">{product.description}</p>
              <p className="text-gray-800 font-semibold mb-1">
                Price: Rs-{product.price}
              </p>
              {product.oldPrice && (
                <p className="text-gray-500 line-through">
                  Old Price: Rs-{product.oldPrice}
                </p>
              )}
              <button
                className="mt-2 bg-gray-800 text-white rounded px-4 py-2"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </Slider>

        {/* Explanation about Men's Clothing */}
        <div className="flex justify-center items-center mb-8 mt-10 ml-4">
          <div className="w-1/2">
            {/* Add the men's image here */}
            <img
              src="https://www.werd.com/wp-content/uploads/2023/10/relwen.jpg"
              alt="Men's Clothing"
              className="object-cover w-full h-106 rounded-md shadow-md"
            />
          </div>
          <div className="w-1/2 text-center">
            <h2 className="text-3xl font-semibold mb-6">Men's Clothing</h2>
            <p>
              Here at BAUHINIA, we care about providing men’s clothes and men’s
              style that are sure to complement and flatter the modern gent. So,
              why not take a peek at this range of menswear.
            </p>
          </div>
        </div>
        {/* Men's Clothing Section Slider */}
        <Slider {...mensSettings}>
          {mensProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white p-4 rounded-md shadow-md"
            >
              <img
                src={product.image}
                alt={product.name}
                className="mb-4 object-cover w-full h-72 rounded-md"
              />
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-700">{product.description}</p>
              <p className="text-gray-800 font-semibold mb-2">
                Price: Rs-{product.price}
              </p>
              <button
                className="mt-2 bg-gray-800 text-white rounded px-4 py-2"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </Slider>
        {/* Women's Clothing Section Intro */}
        <div className="flex justify-center items-center mb-8 mt-10 mr-4">
          <div className="w-1/2 text-center">
            <h2 className="text-3xl font-semibold mb-6 mr">Women's Clothing</h2>
            <p>
              Discover the latest trends in women's fashion. Our collection is
              designed to empower and inspire you. Explore our range of stylish
              and comfortable clothing.
            </p>
          </div>
          <div className="w-1/2 pl-4">
            <img
              src="https://d2line.com/thatlook/wp-content/uploads/sites/4/2022/09/women-clothing-fashion-designerstyle-by-d2line.png"
              alt="Women's Clothing"
              className="object-cover w-full h-106 rounded-md shadow-md"
            />
          </div>
        </div>
        <Slider {...womensSettings}>
          {womenProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white p-4 rounded-md shadow-md"
            >
              <img
                src={product.image}
                alt={product.name}
                className="mb-4 object-cover w-full h-72 rounded-md"
              />
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-700">{product.description}</p>
              <p className="text-gray-800 font-semibold mb-2">
                Price: Rs-{product.price}
              </p>
              <button
                className="mt-2 bg-gray-800 text-white rounded px-4 py-2"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </Slider>
      </div>
      
    </div>
    
  );
}

export default Main;
