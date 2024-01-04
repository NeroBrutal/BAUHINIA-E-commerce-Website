import { useState, useEffect } from "react";
import axios from "axios";
import { useFormik } from "formik";
import Modal from "react-modal";

const AdminList = () => {
  const [products, setProducts] = useState([]);
  const [updateProductId, setUpdateProductId] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/allProducts");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      image: "",
      category: "",
      price: 0,
      oldPrice: 0,
      quantity: 1,
    },
    onSubmit: async (values) => {
      try {
        if (updateProductId) {
          // If updateProductId is set, it's an update operation
          await axios.put(
            `http://localhost:3001/api/updateProducts/${updateProductId}`,
            values
          );
          alert("Product updated successfully.");
          setUpdateProductId(null); // Reset the updateProductId after update
          setIsUpdateModalOpen(false); // Close the update modal
        } else {
          // Otherwise, it's an add operation
          await axios.post("http://localhost:3001/api/products", values);
          alert("Product saved successfully.");
        }
        formik.resetForm();
        fetchProducts(); // Fetch the updated product list after save/update
      } catch (error) {
        console.error(error);
        alert("Failed to save product.");
      }
    },
  });

  const handleUpdate = async (productId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/findProducts/${productId}`
      );

      const productData = response.data;

      // Set the form values for update
      formik.setValues({
        name: productData.name,
        description: productData.description,
        image: productData.image,
        category: productData.category,
        price: productData.price,
        oldPrice: productData.oldPrice || 0,
        quantity: productData.quantity || 1,
      });

      setUpdateProductId(productId);
      setIsUpdateModalOpen(true);
    } catch (error) {
      console.error("Error fetching product for update:", error);
      alert("Failed to fetch product for update.");
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:3001/api/products/${productId}`);
      console.log(productId);
      alert("Product deleted successfully.");
      // Fetch the updated product list after deletion
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">All Products</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Image</th>
            <th className="py-2 px-4 border-b">Category</th>
            <th className="py-2 px-4 border-b">Price</th>
            <th className="py-2 px-4 border-b">Old Price</th>
            <th className="py-2 px-4 border-b">quantity</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td className="py-2 px-4 border-b">{product.name}</td>
              <td className="py-2 px-4 border-b">{product.description}</td>
              <td className="py-2 px-4 border-b">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover"
                  style={{ width: "80px", height: "80px" }}
                />
              </td>
              <td className="py-2 px-4 border-b">{product.category}</td>
              <td className="py-2 px-4 border-b">Rs{product.price}</td>
              <td className="py-2 px-4 border-b">
                Rs{product.oldPrice || "-"}
              </td>
              <td className="py-2 px-4 border-b">{product.quantity}</td>{" "}
              {/* Display Quantity */}
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleUpdate(product._id)}
                  className="bg-green-500 mb-2 text-white p-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:border-green-300 transition duration-300"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="ml-1 bg-red-500 text-white p-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300 transition duration-300"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Update Product Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onRequestClose={() => setIsUpdateModalOpen(false)}
        contentLabel="Update Product Modal"
        style={modalStyles}
      >
        <div>
          <h2 className="text-2xl font-semibold mb-4">Update Product</h2>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-600"
              >
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>

            {/* Description Input */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-600"
              >
                Description:
              </label>
              <input
                type="text"
                id="description"
                name="description"
                onChange={formik.handleChange}
                value={formik.values.description}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>

            {/* Image URL Input */}
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-600"
              >
                Image URL:
              </label>
              <input
                type="text"
                id="image"
                name="image"
                onChange={formik.handleChange}
                value={formik.values.image}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-600"
              >
                Category:
              </label>
              <select
                id="category"
                name="category"
                onChange={formik.handleChange}
                value={formik.values.category}
                className="mt-1 p-2 w-full border rounded-md"
              >
                <option value="">Select Category</option>
                <option value="Discount">Discount</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
              </select>
            </div>

            {/* Price Input */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-600"
              >
                Price:
              </label>
              <input
                type="number"
                id="price"
                name="price"
                onChange={formik.handleChange}
                value={formik.values.price}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>

            {/* Old Price Input */}
            <div>
              <label
                htmlFor="oldPrice"
                className="block text-sm font-medium text-gray-600"
              >
                Old Price:
              </label>
              <input
                type="number"
                id="oldPrice"
                name="oldPrice"
                onChange={formik.handleChange}
                value={formik.values.oldPrice}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>
            {/* Quantity Input */}
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-600"
              >
                Quantity:
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                onChange={formik.handleChange}
                value={formik.values.quantity}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1  bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300 transition duration-300"
              >
                Update Product
              </button>
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="flex-1 bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring focus:border-gray-300 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

const modalStyles = {
  content: {
    maxWidth: "400px",
    margin: "auto",
    padding: "20px",
  },
};

export default AdminList;
