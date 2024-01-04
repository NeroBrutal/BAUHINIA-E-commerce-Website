import { useState, useEffect } from "react";
import Adminmain from "./Adminmain";
import AdminList from "./AdminList";
import ReportUI from "./ReportUI";
import OrderReportUI from "./OrderReportUI";
import MonthlyIncomeReportUI from "./MonthlyIncomeReportUI";
import StaffProfile from "./StaffProfile";
import { useCookies } from "react-cookie";

const ProductManagement = () => {
  const [activeTab, setActiveTab] = useState("staffProfile");
  const [userRole, setUserRole] = useState("");
  const [cookies] = useCookies(["role"]);
  const role = cookies.role;

  useEffect(() => {
    setUserRole(role);
  }, [role]);

  const allowedTabsByRole = {
    owner: [
      "addProduct",
      "viewProducts",
      "product_availability",
      "orderReport",
      "monthlyIncomeReport",
      "staffProfile",
    ],
    productionManager: ["orderReport", "product_availability", "staffProfile"],
    inventoryClerk: ["addProduct", "viewProducts", "staffProfile"],
    chiefAccountant: ["monthlyIncomeReport", "staffProfile"],
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Check if userRole is valid
  if (!(userRole in allowedTabsByRole)) {
    return <div>Error: Invalid user role</div>;
  }

  return (
    <div className="min-h-screen bg-cover bg-slate-300">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-semibold mb-8 text-black">
          BAUHINIA Product Management
        </h1>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-4">
            {allowedTabsByRole[userRole].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`py-2 px-4 ${
                  activeTab === tab
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                } rounded-md focus:outline-none`}
              >
                {tab === "addProduct" && "Add Product"}
                {tab === "viewProducts" && "Manage Products"}
                {tab === "product_availability" && "Product Availability"}
                {tab === "orderReport" && "Order Report"}
                {tab === "monthlyIncomeReport" && "Monthly Income Report"}
                {tab === "staffProfile" && "Staff Profile"}
              </button>
            ))}
          </div>
        </div>

        {/* Content based on active tab */}
        <div>
          {activeTab === "addProduct" && <Adminmain />}
          {activeTab === "viewProducts" && <AdminList />}
          {activeTab === "product_availability" && (
            <ReportUI onClose={() => handleTabChange("viewProducts")} />
          )}
          {activeTab === "orderReport" && (
            <OrderReportUI onClose={() => handleTabChange("viewProducts")} />
          )}
          {activeTab === "monthlyIncomeReport" && <MonthlyIncomeReportUI />}
          {activeTab === "staffProfile" && <StaffProfile />}
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
