import React, { useEffect, useState } from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import { getUserRole, isAuthenticated, logout } from "../../../api/auth.js";
import { getUser } from "../../../api/user.js";
import Address from "./Address.jsx";
import AccountInfo from "./AccountInfo.jsx";
import RoleRequestForm from "./RoleRequestForm.jsx";
import MyPest from "./MyPest.jsx";

export default function User() {
    const [, setUserInfo] = useState(null);
    const location = useLocation();
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("dashboard");

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate("/login");
        } else {
            const role = getUserRole();
            setUserInfo(role);
        }
    }, [navigate]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await getUser();
                setUserData(response);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        fetchUserInfo();
    }, []);

    useEffect(() => {
        const path = location.pathname.split("/")[2];
        if (path) {
            setActiveTab(path);
        } else {
            setActiveTab("dashboard");
        }
    }, [location.pathname]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        navigate(`/information/${tab}`);
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    }

    return (
        <>
            <section className="page-header-area" style={{ backgroundColor: '#f8eefa' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-8">
                            <div className="page-header-content">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="">David-Nguyen</Link></li>
                                </ol>
                                <h2 className="page-header-title">My Account</h2>
                            </div>
                        </div>
                        <div className="col-sm-4 d-sm-flex justify-content-end align-items-end">
                            <h5 className="showing-pagination-results"> / Information</h5>
                        </div>
                    </div>
                </div>
            </section>

            <section className="account-area section-space">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="myaccount-page-wrapper">
                                <div className="row">
                                    <div className="col-lg-3 col-md-4">
                                        <nav>
                                            <div className="myaccount-tab-menu nav nav-tabs" id="nav-tab" role="tablist">
                                                <button
                                                    className={`nav-link${activeTab === "dashboard" ? " active" : ""}`}
                                                    onClick={() => handleTabClick("dashboard")}
                                                >
                                                    Dashboard
                                                </button>
                                                <button
                                                    className={`nav-link${activeTab === "orders" ? " active" : ""}`}
                                                    onClick={() => handleTabClick("orders")}
                                                >
                                                    Orders
                                                </button>
                                                <button
                                                    className={`nav-link${activeTab === "my-pet" ? " active" : ""}`}
                                                    onClick={() => handleTabClick("my-pet")}
                                                >
                                                    My pet
                                                </button>
                                                <button className={`nav-link${activeTab === "address" ? " active" : ""}`} 
                                                    onClick={() => handleTabClick("address")}>
                                                    Address
                                                </button>
                                                <button
                                                    className={`nav-link${activeTab === "account-info" ? " active" : ""}`}
                                                    onClick={() => handleTabClick("account-info")}
                                                >
                                                    Account Details
                                                </button>
                                                <button
                                                    className={`nav-link${activeTab === "role-request" ? " active" : ""}`}
                                                    onClick={() => handleTabClick("role-request")}
                                                >
                                                    Role Request
                                                </button>
                                                
                                                <button
                                                    className="nav-link"
                                                    onClick={handleLogout}
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        </nav>
                                    </div>
                                    <div className="col-lg-9 col-md-8">
                                        <div className="tab-content">
                                            {/* Dashboard Tab */}
                                            {activeTab === "dashboard" && (
                                                <div className="tab-pane fade show active">
                                                    <div className="myaccount-content">
                                                        <h3>Dashboard</h3>
                                                        <div className="welcome">
                                                            <p>
                                                                Hello, <strong>{userData?.username}</strong> (If Not <strong>{userData?.username} !</strong>
                                                                <a href="" className="logout"> Logout</a>)
                                                            </p>
                                                        </div>
                                                        <p className="mb-0">
                                                            From your account dashboard. you can easily check & view your recent orders, manage your shipping and billing addresses and edit your password and account details.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Orders Tab */}
                                            {activeTab === "orders" && (
                                                <div className="tab-pane fade show active">
                                                    <div className="myaccount-content">
                                                        <h3>Orders</h3>
                                                        <div className="myaccount-table table-responsive text-center">
                                                            <table className="table table-bordered">
                                                                <thead className="thead-light">
                                                                    <tr>
                                                                        <th>Order</th>
                                                                        <th>Date</th>
                                                                        <th>Status</th>
                                                                        <th>Total</th>
                                                                        <th>Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>1</td>
                                                                        <td>Aug 22, 2021</td>
                                                                        <td>Pending</td>
                                                                        <td>$3000</td>
                                                                        <td><a href="shop-cart.html" className="check-btn sqr-btn ">View</a></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>2</td>
                                                                        <td>July 22, 2021</td>
                                                                        <td>Approved</td>
                                                                        <td>$200</td>
                                                                        <td><a href="shop-cart.html" className="check-btn sqr-btn ">View</a></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>3</td>
                                                                        <td>June 12, 2017</td>
                                                                        <td>On Hold</td>
                                                                        <td>$990</td>
                                                                        <td><a href="shop-cart.html" className="check-btn sqr-btn ">View</a></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Payment Method Tab */}
                                            {activeTab === "my-pet" && (
                                                <MyPest/>
                                            )}

                                            {/* Address Edit Tab */}
                                            {activeTab === "address" && (
                                                <Address />
                                            )}

                                            {/* Account Info Tab */}
                                            {activeTab === "account-info" && (
                                                <AccountInfo />
                                            )}

                                            {/* Role Request Tab */}
                                            {activeTab === "role-request" && (
                                                <div className="tab-pane fade show active">
                                                    <RoleRequestForm />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h6 className="visually-hidden">My Account</h6>
                </div>
            </section>
        </>
    );
}