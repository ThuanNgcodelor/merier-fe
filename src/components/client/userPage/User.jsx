import React, { useEffect, useState } from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import { getUserRole, isAuthenticated, logout } from "../../../api/auth.js";
import { getUser } from "../../../api/user.js";
import Address from "./Address.jsx";
import AccountInfo from "./AccountInfo.jsx";
import RoleRequestForm from "./RoleRequestForm.jsx";
import OrderList from "./OrderList.jsx";
import NotificationPage from "../../../pages/client/NotificationPage.jsx";

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
                                                    <i className="fas fa-home me-2"></i>
                                                    Dashboard
                                                </button>
                                                <button
                                                    className={`nav-link${activeTab === "orders" ? " active" : ""}`}
                                                    onClick={() => handleTabClick("orders")}
                                                >
                                                    <i className="fas fa-shopping-bag me-2"></i>
                                                    Orders
                                                </button>
                                                <button className={`nav-link${activeTab === "address" ? " active" : ""}`}
                                                    onClick={() => handleTabClick("address")}>
                                                    <i className="fas fa-map-marker-alt me-2"></i>
                                                    Address
                                                </button>
                                                <button
                                                    className={`nav-link${activeTab === "account-info" ? " active" : ""}`}
                                                    onClick={() => handleTabClick("account-info")}
                                                >
                                                    <i className="fas fa-user me-2"></i>
                                                    Account Details
                                                </button>
                                                <button
                                                    className={`nav-link${activeTab === "role-request" ? " active" : ""}`}
                                                    onClick={() => handleTabClick("role-request")}
                                                >
                                                    <i className="fas fa-user-tie me-2"></i>
                                                    Role Request
                                                </button>
                                                <button
                                                    className={`nav-link${activeTab === "notifications" ? " active" : ""}`}
                                                    onClick={() => handleTabClick("notifications")}
                                                >
                                                    <i className="fas fa-bell me-2"></i>
                                                    Notifications
                                                </button>
                                                
                                                <button
                                                    className="nav-link"
                                                    onClick={handleLogout}
                                                >
                                                    <i className="fas fa-sign-out-alt me-2"></i>
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
                                                <OrderList />
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

                                            {/* Notifications Tab */}
                                            {activeTab === "notifications" && (
                                                <div className="tab-pane fade show active">
                                                    <NotificationPage />
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