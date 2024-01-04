/* eslint-disable react/no-unescaped-entities */
import { useFormik } from 'formik';
import axios from 'axios';

const ProductForm = () => {
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      image: '',
      category: '',
      price: 0,
      oldPrice: 0,
      quantity: 1,
    },
    onSubmit: async (values) => {
      try {
        await axios.post('http://localhost:3001/api/products', values);
        alert('Product saved successfully.');
        formik.resetForm();
      } catch (error) {
        console.error(error);
        alert('Failed to save product.');
      }
    },
  });

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-gray-300 rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
        BAUHINIA
      </h2>

      {/* Form for Adding a New Product */}
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-600">
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
          <label htmlFor="description" className="block text-sm font-medium text-gray-600">
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
          <label htmlFor="image" className="block text-sm font-medium text-gray-600">
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

        {/* Category Selection */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-600">
            Category:
          </label>
          <select
            id="category"
            name="category"
            onChange={formik.handleChange}
            value={formik.values.category}
            className="mt-1 p-2 w-full border rounded-md"
          >
            <option value="">Select a category</option>
            <option value="Discount">Discount</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
          </select>
        </div>

        {/* Price Input */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-600">
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

      {/* Old Price Input (for discount products) */}
      {formik.values.category === 'Discount' && (
        <div>
          <label htmlFor="oldPrice" className="block text-sm font-medium text-gray-600">
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
      )}
      {/* Quantity Input */}
      <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-600">
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

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300 transition duration-300"
        >
          Save Product
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
