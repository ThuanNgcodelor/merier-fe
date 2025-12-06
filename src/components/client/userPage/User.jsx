import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUserRole, isAuthenticated, logout } from "../../../api/auth.js";
import { getUser } from "../../../api/user.js";
import Address from "./Address.jsx";
import AccountInfo from "./AccountInfo.jsx";
import RoleRequestForm from "./RoleRequestForm.jsx";
import OrderList from "./OrderList.jsx";
import NotificationPage from "./NotificationPage.jsx";

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
            {/* Header Section */}
            <section style={{ background: '#F5F5F5', padding: '0', margin: '0' }}>
                <div className="container" style={{ maxWidth: '1200px', padding: '0' }}>
                    {/* User Profile Bar */}
                    <div
                        style={{
                            background: 'linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 100%)',
                            padding: '20px 16px',
                            marginBottom: '12px'
                        }}
                    >
                        <div className="d-flex align-items-center gap-3">
                            {/* Avatar */}
                            <div
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    background: '#E8ECEF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '2px solid white',
                                    flexShrink: 0
                                }}
                            >
                                <i className="fa fa-user" style={{ fontSize: '20px', color: '#457B9D' }}></i>
                            </div>
                            {/* User Info */}
                            <div>
                                <div style={{ fontSize: '16px', fontWeight: 600, color: '#1D3557', marginBottom: '2px' }}>
                                    _{userData?.username || 'User'}
                                </div>
                                <div style={{ fontSize: '13px', color: '#457B9D' }}>
                                    <i className="fa fa-pencil me-1" style={{ fontSize: '11px' }}></i> Edit Profile
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="row g-3" style={{ marginBottom: '24px' }}>
                        {/* Sidebar */}
                        <div className="col-12 col-lg-3">
                            <div style={{ background: 'white', borderRadius: '4px', overflow: 'hidden' }}>
                                {/* Menu Items */}
                                <div>
                                    <button
                                        onClick={() => handleTabClick("dashboard")}
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px',
                                            border: 'none',
                                            background: activeTab === "dashboard" ? '#FFF6F0' : 'transparent',
                                            color: activeTab === "dashboard" ? '#EE4D2D' : '#555',
                                            textAlign: 'left',
                                            borderLeft: activeTab === "dashboard" ? '3px solid #EE4D2D' : '3px solid transparent',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (activeTab !== "dashboard") {
                                                e.currentTarget.style.background = '#F9FAFB';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (activeTab !== "dashboard") {
                                                e.currentTarget.style.background = 'transparent';
                                            }
                                        }}
                                    >
                                        <i className="fa fa-user" style={{ width: '20px', textAlign: 'center' }}></i>
                                        My Account
                                    </button>

                                    <div style={{ paddingLeft: '48px' }}>
                                        <button
                                            onClick={() => handleTabClick("account-info")}
                                            style={{
                                                width: '100%',
                                                padding: '10px 0',
                                                border: 'none',
                                                background: 'transparent',
                                                color: activeTab === "account-info" ? '#EE4D2D' : '#555',
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                fontSize: '13px',
                                                transition: 'color 0.2s'
                                            }}
                                        >
                                            Profile
                                        </button>
                                        <button
                                            onClick={() => handleTabClick("address")}
                                            style={{
                                                width: '100%',
                                                padding: '10px 0',
                                                border: 'none',
                                                background: 'transparent',
                                                color: activeTab === "address" ? '#EE4D2D' : '#555',
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                fontSize: '13px',
                                                transition: 'color 0.2s'
                                            }}
                                        >
                                            Address
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => handleTabClick("orders")}
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px',
                                            border: 'none',
                                            background: activeTab === "orders" ? '#FFF6F0' : 'transparent',
                                            color: activeTab === "orders" ? '#EE4D2D' : '#555',
                                            textAlign: 'left',
                                            borderLeft: activeTab === "orders" ? '3px solid #EE4D2D' : '3px solid transparent',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (activeTab !== "orders") {
                                                e.currentTarget.style.background = '#F9FAFB';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (activeTab !== "orders") {
                                                e.currentTarget.style.background = 'transparent';
                                            }
                                        }}
                                    >
                                        <i className="fa fa-shopping-bag" style={{ width: '20px', textAlign: 'center' }}></i>
                                        My Orders
                                    </button>

                                    <button
                                        onClick={() => handleTabClick("notifications")}
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px',
                                            border: 'none',
                                            background: activeTab === "notifications" ? '#FFF6F0' : 'transparent',
                                            color: activeTab === "notifications" ? '#EE4D2D' : '#555',
                                            textAlign: 'left',
                                            borderLeft: activeTab === "notifications" ? '3px solid #EE4D2D' : '3px solid transparent',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (activeTab !== "notifications") {
                                                e.currentTarget.style.background = '#F9FAFB';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (activeTab !== "notifications") {
                                                e.currentTarget.style.background = 'transparent';
                                            }
                                        }}
                                    >
                                        <i className="fa fa-bell" style={{ width: '20px', textAlign: 'center' }}></i>
                                        Notifications
                                    </button>

                                    <button
                                        onClick={() => handleTabClick("role-request")}
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px',
                                            border: 'none',
                                            background: activeTab === "role-request" ? '#FFF6F0' : 'transparent',
                                            color: activeTab === "role-request" ? '#EE4D2D' : '#555',
                                            textAlign: 'left',
                                            borderLeft: activeTab === "role-request" ? '3px solid #EE4D2D' : '3px solid transparent',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (activeTab !== "role-request") {
                                                e.currentTarget.style.background = '#F9FAFB';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (activeTab !== "role-request") {
                                                e.currentTarget.style.background = 'transparent';
                                            }
                                        }}
                                    >
                                        <i className="fa fa-user-tie" style={{ width: '20px', textAlign: 'center' }}></i>
                                        Role Request
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="col-12 col-lg-9">
                            <div style={{ background: 'white', borderRadius: '4px', minHeight: '400px' }}>
                                {/* Dashboard Tab */}
                                {activeTab === "dashboard" && (
                                    <div className="p-4">
                                        <h5 style={{ color: '#1D3557', marginBottom: '16px' }}>Dashboard</h5>
                                        <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6' }}>
                                            Xin chào, <strong>{userData?.username}</strong>!
                                        </p>
                                        <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6' }}>
                                            Từ trang quản lý tài khoản, bạn có thể xem đơn hàng gần đây, quản lý địa chỉ giao hàng và chỉnh sửa thông tin cá nhân.
                                        </p>
                                    </div>
                                )}

                                {/* Orders Tab */}
                                {activeTab === "orders" && (
                                    <OrderList />
                                )}

                                {/* Address Tab */}
                                {activeTab === "address" && (
                                    <div className="p-4">
                                        <Address />
                                    </div>
                                )}

                                {/* Account Info Tab */}
                                {activeTab === "account-info" && (
                                    <div className="p-4">
                                        <AccountInfo />
                                    </div>
                                )}

                                {/* Role Request Tab */}
                                {activeTab === "role-request" && (
                                    <div className="p-4">
                                        <RoleRequestForm />
                                    </div>
                                )}

                                {/* Notifications Tab */}
                                {activeTab === "notifications" && (
                                    <div className="p-4">
                                        <NotificationPage />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}