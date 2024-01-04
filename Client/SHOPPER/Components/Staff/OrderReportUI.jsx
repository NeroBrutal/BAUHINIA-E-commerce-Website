import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const OrderReportUI = () => {
  const [orderData, setOrderData] = useState([]);

  const fetchOrderData = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/allOrders");
      setOrderData(response.data);
    } catch (error) {
      console.error("Error fetching order data:", error);
      alert("Failed to fetch order data.");
    }
  }, []); 

  useEffect(() => {
    fetchOrderData();
  }, [fetchOrderData]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      console.log("Updating order status:", orderId, newStatus);

      const response = await axios.put(
        `http://localhost:3001/api/updateOrderStatus/${orderId}`,
        {
          status: newStatus,
        }
      );

      console.log("Update successful. Response:", response);

      const updatedOrderData = orderData.map((order) =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      );

      setOrderData(updatedOrderData);
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status.");
    }
  };

  // Group orders by date
  const groupedOrders = orderData.reduce((acc, order) => {
    const date = formatDate(order.orderDate);
    acc[date] = acc[date] || [];
    acc[date].push(order);
    return acc;
  }, {});

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Order Report</h2>
      {Object.entries(groupedOrders).map(([date, orders]) => (
        <div key={date} className="mb-4">
          <h3 className="text-xl font-semibold mb-2">{date}</h3>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Order ID</th>
                <th className="py-2 px-4 border-b">Product Details</th>
                <th className="py-2 px-4 border-b">Total Price</th>
                <th className="py-2 px-4 border-b">Customer Name</th>
                <th className="py-2 px-4 border-b">Customer Address</th>
                <th className="py-2 px-4 border-b">Contact Numbers</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId}>
                  <td className="py-2 px-4 border-b">{order.orderId}</td>
                  <td className="py-2 px-4 border-b">
                    {renderProductDetails(order.products)}
                  </td>
                  <td className="py-2 px-4 border-b">{order.totalPrice}</td>
                  <td className="py-2 px-4 border-b">{order.customerName}</td>
                  <td className="py-2 px-4 border-b">
                    {order.customerAddress}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {order.customerNumber1} {order.customerNumber2}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.orderId, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

const renderProductDetails = (products) => {
  return (
    <div>
      {products.map((product, index) => (
        <div key={index} className="mb-2">
          <span className="font-semibold">{product.name}</span>
          <span className="ml-2 text-gray-600">{`(Quantity: ${product.quantity}, Price: ${product.price})`}</span>
        </div>
      ))}
    </div>
  );
};

const formatDate = (date) => {
  // Format date as "YYYY-MM-DD"
  return new Date(date).toISOString().split("T")[0];
};

export default OrderReportUI;
