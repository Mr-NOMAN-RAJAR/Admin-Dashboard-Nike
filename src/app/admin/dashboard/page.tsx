"use client";
import { client } from "@/sanity/lib/client";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { urlFor } from "@/sanity/lib/image";
import {
  FaHome,
  FaClipboardList,
  FaTruck,
  FaCheckCircle,
  FaSun,
  FaMoon,
  FaDollarSign,
  FaShoppingCart,
  FaClock,
  FaCheck,
  FaBars,
  FaTimes,
} from "react-icons/fa";

interface Order {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  address1: string;
  address2: string;
  zipCode: string;
  discount: string;
  orderDate: string;
  status: string | null;
  total: number;
  city: string;
  country: string;
  cartItems: {
    price: number;
    product: any;
    quantity: number;
    productName: string;
    image: string;
  }[];
}

function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    client
      .fetch(
        ` *[_type == 'order']{
          _id,
          firstName,
          lastName,
          email,
          phone,
          address1,
          address2,
          zipCode,
          city,
          country,
          discount,
          status,
          total,
          orderDate,
          "cartItems": cartItems[]{
            "product": product->{
              _id,
              productName,
              image
            },
            quantity,
            price
          }
        }`
      )
      .then((data) => {
        setOrders(
          data.map((order: { cartItems: any }) => ({
            ...order,
            cartItems: order.cartItems || [],
          }))
        );
      })
      .catch((error) => console.log("Error fetching orders", error));
  }, []);

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.status === filter);

  const handleOrderDetails = (orderId: string) => {
    setSelectedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleDelete = async (orderId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      console.log("Deleting order with ID:", orderId);
      await client.delete(orderId);
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
      Swal.fire("Deleted", "Your order has been deleted", "success");
    } catch (error) {
      console.error("Error deleting order:", error);
      Swal.fire(
        "Error",
        "Failed to delete order. " +
          (error instanceof Error ? error.message : "Unknown error"),
        "error"
      );
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      console.log("Updating order status with ID:", orderId, "to", newStatus);
      await client.patch(orderId).set({ status: newStatus }).commit();
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      Swal.fire("Updated", "Order status updated successfully", "success");
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire(
        "Error",
        "Failed to update status. " +
          (error instanceof Error ? error.message : "Unknown error"),
        "error"
      );
    }
  };

  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;
  const successfulOrders = orders.filter(
    (order) => order.status === "Success"
  ).length;

  const handleLogout = () => {
    console.log("Logging out...");

    router.push("/#");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div
      className={`flex flex-col h-screen w-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}
    >
      <header
        className={`p-4 shadow-md flex justify-between items-center ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"} transition duration-500 ease-in-out`}
      >
        <div className="flex items-center space-x-3">
          <Image
            src="/logo.jpg"
            alt="Nike Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <h2 className="text-xl font-semibold">Nike Dashboard</h2>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleDarkMode}
            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-700 transition duration-500 ease-in-out"
          >
            {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
          <button
            onClick={toggleSidebar}
            className="md:hidden bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-700 transition duration-500 ease-in-out"
          >
            {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </header>
      <div className="flex flex-1 flex-col md:flex-row">
        <aside
          className={`w-full md:w-64 p-4 ${darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-black"} ${sidebarOpen ? "block" : "hidden"} md:block transition duration-500 ease-in-out`}
        >
          <nav>
            <ul>
              <li className="mb-2">
                <button
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 transition-all ${
                    filter === "All"
                      ? darkMode
                        ? "bg-gray-700 text-white font-bold"
                        : "bg-gray-300 text-black font-bold"
                      : darkMode
                        ? "text-white"
                        : "text-black"
                  }`}
                  onClick={() => setFilter("All")}
                >
                  <FaHome size={24} />
                  <span>All Orders</span>
                </button>
              </li>
              <li className="mb-2">
                <button
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 transition-all ${
                    filter === "Pending"
                      ? darkMode
                        ? "bg-gray-700 text-white font-bold"
                        : "bg-gray-300 text-black font-bold"
                      : darkMode
                        ? "text-white"
                        : "text-black"
                  }`}
                  onClick={() => setFilter("Pending")}
                >
                  <FaClipboardList size={24} />
                  <span>Pending Orders</span>
                </button>
              </li>
              <li className="mb-2">
                <button
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 transition-all ${
                    filter === "Dispatch"
                      ? darkMode
                        ? "bg-gray-700 text-white font-bold"
                        : "bg-gray-300 text-black font-bold"
                      : darkMode
                        ? "text-white"
                        : "text-black"
                  }`}
                  onClick={() => setFilter("Dispatch")}
                >
                  <FaTruck size={24} />
                  <span>Dispatched Orders</span>
                </button>
              </li>
              <li className="mb-2">
                <button
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 transition-all ${
                    filter === "Success"
                      ? darkMode
                        ? "bg-gray-700 text-white font-bold"
                        : "bg-gray-300 text-black font-bold"
                      : darkMode
                        ? "text-white"
                        : "text-black"
                  }`}
                  onClick={() => setFilter("Success")}
                >
                  <FaCheckCircle size={24} />
                  <span>Successful Orders</span>
                </button>
              </li>
              <li className="mt-4">
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 text-white px-3 py-2 rounded hover:bg-red-700 transition duration-500 ease-in-out"
                >
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </aside>
        <main
          className={`flex-1 p-6 overflow-y-auto ${darkMode ? "bg-gradient-to-r from-gray-700 to-gray-900" : "bg-gradient-to-r from-gray-100 to-gray-300"} transition duration-500 ease-in-out`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div
              className={`p-6 rounded-lg shadow-md flex items-center space-x-3 ${darkMode ? "bg-gradient-to-r from-gray-700 to-gray-900" : "bg-gradient-to-r from-white to-gray-200"} transition duration-500 ease-in-out transform hover:scale-105`}
            >
              <FaDollarSign size={24} color={darkMode ? "white" : "gray"} />
              <div>
                <h3
                  className={`text-lg font-semibold ${darkMode ? "text-green-500" : "text-gray-700"}`}
                >
                  Total Revenue
                </h3>
                <p
                  className={`text-2xl font-bold ${darkMode ? "text-green-400" : "text-gray-900"}`}
                >
                  ${totalRevenue.toFixed(2)}
                </p>
              </div>
            </div>
            <div
              className={`p-4 rounded-lg shadow-md flex items-center space-x-3 ${darkMode ? "bg-gradient-to-r from-gray-700 to-gray-900" : "bg-gradient-to-r from-white to-gray-200"} transition duration-500 ease-in-out transform hover:scale-105`}
            >
              <FaShoppingCart size={24} color={darkMode ? "white" : "gray"} />
              <div>
                <h3
                  className={`text-lg font-semibold ${darkMode ? "text-green-500" : "text-gray-700"}`}
                >
                  Total Orders
                </h3>
                <p
                  className={`text-2xl font-bold ${darkMode ? "text-green-400" : "text-gray-900"}`}
                >
                  {totalOrders}
                </p>
              </div>
            </div>
            <div
              className={`p-4 rounded-lg shadow-md flex items-center space-x-3 ${darkMode ? "bg-gradient-to-r from-gray-700 to-gray-900" : "bg-gradient-to-r from-white to-gray-200"} transition duration-500 ease-in-out transform hover:scale-105`}
            >
              <FaClock size={24} color={darkMode ? "white" : "gray"} />
              <div>
                <h3
                  className={`text-lg font-semibold ${darkMode ? "text-green-500" : "text-gray-700 "}`}
                >
                  Pending Orders
                </h3>
                <p
                  className={`text-2xl font-bold ${darkMode ? "text-green-400" : "text-gray-900"}`}
                >
                  {pendingOrders}
                </p>
              </div>
            </div>
            <div
              className={`p-4 rounded-lg shadow-md flex items-center space-x-3 ${darkMode ? "bg-gradient-to-r from-gray-700 to-gray-900" : "bg-gradient-to-r from-white to-gray-200"} transition duration-500 ease-in-out transform hover:scale-105`}
            >
              <FaCheck size={24} color={darkMode ? "white" : "gray-900"} />
              <div>
                <h3
                  className={`text-lg font-semibold ${darkMode ? "text-green-500" : "text-gray-700"}`}
                >
                  Successful Orders
                </h3>
                <p
                  className={`text-2xl font-bold ${darkMode ? "text-green-400" : "text-gray-900"}`}
                >
                  {successfulOrders}
                </p>
              </div>
            </div>
          </div>
          <div
            className={`rounded-lg shadow-md p-4 ${darkMode ? "bg-gray-800" : "bg-white"} transition duration-500 ease-in-out`}
          >
            <div className="overflow-y-auto max-h-96">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr
                    className={`uppercase text-sm ${darkMode ? "bg-gray-700 text-green-500" : "bg-gray-200 text-gray-600 "}`}
                  >
                    <th className="p-3 ">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <React.Fragment key={order._id}>
                      <tr
                        className={`border-b cursor-pointer justify-between ${darkMode ? "border-gray-700 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-100"} transition duration-500 ease-in-out`}
                        onClick={() => handleOrderDetails(order._id)}
                      >
                        <td
                          className={`p-3 ${darkMode ? "text-white" : "text-black "}`}
                        >
                          {order._id}
                        </td>
                        <td
                          className={`p-3 ${darkMode ? "text-white" : "text-black"}`}
                        >
                          {order.firstName} {order.lastName}
                        </td>
                        <td
                          className={`p-3 ${darkMode ? "text-white" : "text-black"}`}
                        >
                          ${order.total}
                        </td>
                        <td
                          className={`p-3 ${darkMode ? "text-white" : "text-black"}`}
                        >
                          {new Date(order.orderDate).toLocaleDateString()}
                        </td>

                        <td className="p-3">
                          <select
                            value={order.status || ""}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            className={`p-2 rounded-md ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"} transition duration-500 ease-in-out`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Dispatch">Dispatch</option>
                            <option value="Success">Success</option>
                          </select>
                        </td>
                        <td
                          className={`p-3 ${darkMode ? "text-white" : "text-black"}`}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(order._id);
                            }}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition duration-500 ease-in-out"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                      {selectedOrderId === order._id && (
                        <tr
                          className={darkMode ? "bg-gray-700" : "bg-gray-100"}
                        >
                          <td colSpan={6} className="p-4">
                            <h3
                              className={`font-semibold ${darkMode ? "text-white" : "text-black"}`}
                            >
                              Order Details
                            </h3>
                            <p
                              className={darkMode ? "text-white" : "text-black"}
                            >
                              Email: {order.email}
                            </p>
                            <p
                              className={darkMode ? "text-white" : "text-black"}
                            >
                              Phone: {order.phone}
                            </p>
                            <p
                              className={darkMode ? "text-white" : "text-black"}
                            >
                              Address: {order.address1}, {order.address2},{" "}
                              {order.city}, {order.zipCode}, {order.country}
                            </p>
                            <ul>
                              {order.cartItems && order.cartItems.length > 0 ? (
                                order.cartItems.map((item, index) => (
                                  <li
                                    key={item.product?._id || index}
                                    className="flex items-center gap-2"
                                  >
                                    <p>
                                      {item.product?.productName || "No Name"}
                                    </p>
                                    {item.product?.image ? (
                                      <Image
                                        src={
                                          urlFor(item.product.image).url() || ""
                                        }
                                        alt={
                                          item.product?.productName ||
                                          "Product Image"
                                        }
                                        width={100}
                                        height={100}
                                      />
                                    ) : (
                                      <span>No Image Available</span>
                                    )}
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Price: ${item.price}</p>
                                  </li>
                                ))
                              ) : (
                                <p
                                  className={
                                    darkMode ? "text-white" : "text-black"
                                  }
                                >
                                  No items in cart
                                </p>
                              )}
                            </ul>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
      <footer
        className={`p-4 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"} border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}
      >
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>
                &copy; {new Date().getFullYear()} Nike Dashboard. All rights
                reserved.
              </p>
            </div>
            <div className="flex space-x-4">
              <Link href="/privacy-policy" className="hover:underline">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="hover:underline">
                Terms of Service
              </Link>
              <Link href="/contact-us" className="hover:underline">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default AdminDashboard;
