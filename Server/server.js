const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

mongoose.connect(
  "Use ur mongoose url",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to the database.");
});

app.use(cors());
app.use(bodyParser.json());

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  category: String,
  price: Number,
  oldPrice: Number,
  quantity: {
    type: Number,
    default: 1,
  },
});

const customerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  telephone1: String,
  telephone2: String,
  address: String,
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
      price: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      image: {
        type: String, // Assuming the image URL is a string
      },
    },
  ],
  orders: [
    {
      products: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
          quantity: Number,
          price: Number,
          name: String,
          image: String, // Image URL for orders
        },
      ],
      status: {
        type: String,
        enum: ["Pending", "Shipped", "Delivered"],
        default: "Pending",
      },
      orderDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const staffSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  role: {
    type: String,
    enum: [
      "ProductionManager",
      "InventoryHandlingClerk",
      "ChiefAccountantManager",
      "Owner",
    ],
  },
});

const Customer = mongoose.model("Customer", customerSchema);
const Product = mongoose.model("Product", productSchema);
const Staff = mongoose.model("Staff", staffSchema);

app.post("/api/register", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      telephone1,
      telephone2,
      address,
    } = req.body;

    // Check if the email is already registered
    const existingCustomer = await Customer.findOne({ email });

    if (existingCustomer) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    const customer = new Customer({
      firstName,
      lastName,
      email,
      password,
      telephone1,
      telephone2,
      address,
    });

    await customer.save();
    res.status(201).json({ message: "Registration successful." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Staff registration route
app.post("/api/staff/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Check if the email is already registered
    const existingStaff = await Staff.findOne({ email });

    if (existingStaff) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    const staff = new Staff({
      firstName,
      lastName,
      email,
      password, // You should hash the password before saving it in a real application
      role,
    });

    await staff.save();
    res.status(201).json({ message: "Staff registration successful." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Staff login route
app.post("/api/staff/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the staff member by email
    const staff = await Staff.findOne({ email });

    if (!staff) {
      return res.status(404).json({ message: "Staff member not found." });
    }

    // Check if the provided password matches the stored password
    // You should use a proper password hashing library in a real application
    if (password !== staff.password) {
      return res.status(401).json({ message: "Invalid password." });
    }

    // Include the role in the response
    res.status(200).json({
      role: staff.role,
      message: "Login successful.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Get staff details by email route
app.get("/api/staff/:email", async (req, res) => {
  try {
    const email = req.params.email;

    // Find the staff member by email
    const staffMember = await Staff.findOne({ email: email });

    if (!staffMember) {
      return res.status(404).json({ message: "Staff member not found." });
    }

    // Exclude sensitive information like password before sending the response
    const { password, ...staffDetails } = staffMember.toObject();

    res.status(200).json(staffDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Update addToCart route
app.post("/api/addToCart", async (req, res) => {
  try {
    const { userEmail, cartItems } = req.body;

    // Find the customer by email
    const customer = await Customer.findOne({ email: userEmail });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    // Check if the product is already in the cart
    for (const cartItem of cartItems) {
      const existingCartItemIndex = customer.cart.findIndex(
        (item) => item.product.toString() === cartItem.product
      );

      if (existingCartItemIndex !== -1) {
        // If the product is already in the cart, update the quantity
        customer.cart[existingCartItemIndex].quantity += cartItem.quantity;
      } else {
        // If the product is not in the cart, add it
        customer.cart.push({
          product: cartItem.product,
          quantity: cartItem.quantity,
          price: cartItem.price,
          name: cartItem.name,
          image: cartItem.image,
        });
      }
    }

    await customer.save();

    res.status(200).json({ message: "Cart updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.delete("/api/removeFromCart", async (req, res) => {
  try {
    const { email, product } = req.body;

    // Find the customer by email
    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    // Remove the product from the cart
    customer.cart = customer.cart.filter(
      (item) => item.product.toString() !== product
    );
    await customer.save();

    res
      .status(200)
      .json({ message: "Product removed from cart successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/api/createOrder", async (req, res) => {
  try {
    const { email, cart } = req.body;

    // Find the customer by email
    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    // Create a new order with the current cart items
    const order = {
      products: cart.map((cartItem) => ({
        product: cartItem.product,
        quantity: cartItem.quantity,
        price: cartItem.price,
        name: cartItem.name,
        image: cartItem.image,
      })),
      status: "Pending",
      orderDate: new Date(),
    };

    // Add the order to the customer's orders array
    customer.orders.push(order);

    // Clear the cart
    customer.cart = [];

    // Save the changes
    await customer.save();

    res.status(200).json({ message: "Order created successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Add a new route to fetch orders by email
app.get("/api/orders/:email", async (req, res) => {
  try {
    const customerEmail = req.params.email;

    // Find the customer by email
    const customer = await Customer.findOne({ email: customerEmail });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    // Return the orders
    res.status(200).json(customer.orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Add a new route to fetch all orders from all customers
app.get("/api/allOrders", async (req, res) => {
  try {
    // Find all customers and retrieve their orders with detailed product information
    const allCustomers = await Customer.find().populate({
      path: "orders.products.product",
      select: "name quantity price", // Include the price in the selection
    });

    // Extract detailed order information with customer name, address, and status
    const allOrders = allCustomers.reduce(
      (orders, customer) =>
        orders.concat(
          customer.orders.map((order) => ({
            orderId: order._id,
            customerName: `${customer.firstName} ${customer.lastName}`,
            customerAddress: customer.address,
            customerNumber1: customer.telephone1,
            customerNumber2: customer.telephone2,
            products: order.products.map((product) => ({
              name: product.product.name,
              quantity: product.quantity,
              price: product.product.price, // Include the product price
            })),
            orderDate: order.orderDate,
            status: order.status, // Include the order status in the response
            totalPrice: order.products.reduce(
              (total, product) =>
                total + product.quantity * product.product.price,
              0
            ), // Calculate total price
          }))
        ),
      []
    );

    res.status(200).json(allOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.get("/api/monthlyIncomeReport", async (req, res) => {
  try {
    const monthlyOrders = await Customer.aggregate([
      { $unwind: "$orders" },
      {
        $match: {
          "orders.status": "Delivered",
        },
      },
      {
        $project: {
          _id: 0,
          products: "$orders.products",
        },
      },
      {
        $unwind: "$products",
      },
      {
        $lookup: {
          from: "products", // Assuming your products are stored in a collection named "products"
          localField: "products.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $multiply: ["$products.quantity", "$productDetails.price"],
            },
          },
        },
      },
    ]);

    const totalIncome =
      monthlyOrders.length > 0 ? monthlyOrders[0].totalIncome : 0;

    res.status(200).json({ totalIncome });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
});

// Add a new route to update order status
app.put("/api/updateOrderStatus/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { status } = req.body;

    // Find the order by ID and get the existing status
    const existingOrder = await Customer.findOne(
      { "orders._id": orderId },
      { "orders.$": 1 }
    );

    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    const existingStatus = existingOrder.orders[0].status;

    // Update the order status
    await Customer.updateOne(
      { "orders._id": orderId },
      { $set: { "orders.$.status": status } }
    );

    res.status(200).json({
      message: "Order status updated successfully.",
      existingStatus: existingStatus,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the customer by email
    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    // Check if the provided password matches the stored password
    // You should use a proper password hashing library in a real application
    if (password !== customer.password) {
      return res.status(401).json({ message: "Invalid password." });
    }

    // Provide a JWT token for authentication
    // You may want to use a library like jsonwebtoken for this
    const token = "your_jwt_token_here";

    res
      .status(200)
      .json({ customerId: customer._id, message: "Login successful.", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Get customer details by email route
app.get("/api/customer/:email", async (req, res) => {
  try {
    const customerEmail = req.params.email;

    // Find the customer by email
    const customer = await Customer.findOne({ email: customerEmail });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    // Exclude sensitive information like password before sending the response
    const { password, ...customerDetails } = customer.toObject();

    res.status(200).json(customerDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Update user details and shipping address route
app.put("/api/updateCustomer/:email", async (req, res) => {
  try {
    const customerEmail = req.params.email;

    // Find the customer by email
    const customer = await Customer.findOne({ email: customerEmail });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    // Update customer details and shipping address based on the request body
    const {
      firstName,
      lastName,
      password, // Add other fields as needed
      address, // Add shipping address fields
      telephone1,
      telephone2,
    } = req.body;

    if (firstName) {
      customer.firstName = firstName;
    }

    if (lastName) {
      customer.lastName = lastName;
    }

    if (password) {
      // You should hash the password before saving it in a real application
      customer.password = password;
    }

    if (address) {
      customer.address = address;
    }

    if (telephone1) {
      customer.telephone1 = telephone1;
    }

    if (telephone2) {
      customer.telephone2 = telephone2;
    }

    // Save the changes
    await customer.save();

    // Exclude sensitive information like password before sending the response
    const { password: _, ...updatedCustomerDetails } = customer.toObject();

    res.status(200).json({
      message: "Customer details and shipping address updated successfully.",
      updatedCustomerDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const { name, description, image, category, price, oldPrice, quantity } =
      req.body;
    const product = new Product({
      name,
      description,
      image,
      category,
      price,
      oldPrice,
      quantity,
    });
    await product.save();
    res.status(201).json({ message: "Product saved successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Get all products route
app.get("/api/allProducts", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Update product route
app.put("/api/updateProducts/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, image, category, price, oldPrice, quantity } =
      req.body;

    await Product.findByIdAndUpdate(productId, {
      name,
      description,
      image,
      category,
      price,
      oldPrice,
      quantity,
    });

    res.status(200).json({ message: "Product updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Get a single product by ID route
app.get("/api/findProducts/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Delete product route
app.delete("/api/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Find the product by ID and delete it
    await Product.findByIdAndDelete(productId);

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
