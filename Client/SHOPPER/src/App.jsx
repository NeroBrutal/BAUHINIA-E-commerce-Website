import "react";
import Register from "../Components/User/Register";
import Login from "../Components/User/Login";
import Main from "../Components/Main";
import ProductManagement from "../Components/Staff/ProductManagement";
import UserProfile from "../Components/User/UserProfile";
import CartUi from "../Components/CartUi";
import StaffRegistration from "../Components/Staff/StaffRegistration";
import StaffLogin from "../Components/Staff/StaffLogin";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/ProductManagement" element={<ProductManagement />} />
          <Route path="/UserProfile" element={<UserProfile />} />
          <Route path="/CartUi" element={<CartUi />} />
          <Route path="/StaffRegistration" element={<StaffRegistration />} />
          <Route path="/StaffLogin" element={<StaffLogin />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
