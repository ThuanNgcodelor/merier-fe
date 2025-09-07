import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {getUserRole, isAuthenticated, login, register} from "../../api/auth.js";
import {checkEmailExists} from "../../api/user.js";

export default function Auth(){
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    const [registerData, setRegisterData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [,setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";


    const handleGoogleLogin = () => {
        const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
        const params = new URLSearchParams({
            client_id: "941069814660-or8vut20mcc30h2lp3lgdrfqd48j4qkc.apps.googleusercontent.com",
            redirect_uri: "http://localhost:5173/oauth2/callback",
            response_type: "code",
            scope: "openid email profile",
            access_type: "offline",
            prompt: "consent",
        });

        window.location.href = `${googleAuthUrl}?${params.toString()}`;
    };
    useEffect(() => {
        if (isAuthenticated()) {
            const roles = getUserRole();

            if (Array.isArray(roles)) {
                if (roles.includes("ROLE_ADMIN") || roles.includes("ROLE_DESIGNER")) {
                    navigate("/admin");
                } else if (roles.includes("ROLE_USER")) {
                    navigate("/information");
                }
            }
        }
    }, [from,navigate]);

    const handleLogin = async (e) => {
        setLoginData({
            ...loginData,
            [e.target.name] : e.target.value,
        });
    };

    const handleRegister = async (e) => {
        setRegisterData({
            ...registerData,
            [e.target.name] : e.target.value,
        });
    };

    const handleForgotPassword = () => {
        navigate("/forgot");
    }

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        if(loginData.email === '' || loginData.password === ''){
            setError("Please fill in all fields.");
            return;
        }

        try {
            await login(loginData);
            const role = getUserRole();
            const roles = Array.isArray(role) ? role : [role].filter(Boolean);

            if(roles.includes("ROLE_ADMIN") || roles.includes("ROLE_DESIGNER")) {
                navigate("/admin");
            } else if (roles.includes("ROLE_USER")) {
                navigate("/information");
            }

        } catch(error){
            console.log(loginData);

            setError(error.response?.data?.message || "Login failed. Please check your email and password.");
        } finally {
            setLoading(false);
        }
    }

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (registerData.password !== registerData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (registerData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        try {
            const exists = await checkEmailExists(registerData.email);
            if (exists) {
            setError("Email already exists. Please use a different email.");
            return;
            }

            await register(registerData);
            setSuccess("Registration successful! You can now login.");
            setRegisterData({ username: "", email: "", password: "", confirmPassword: "" });
        } catch (err) {
            const apiMsg =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message;
            setError(apiMsg || "Register error. Please check your registration information.");
        } finally {
            setLoading(false);
        }
    };




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
                            <h5 className="showing-pagination-results">Login / Register</h5>
                        </div>
                    </div>
                </div>
            </section>

            <section className="login-register-area section-space">
                <div className="container">
                    {error && (
                        <div className="row">
                            <div className="col-12">
                                <div className="alert alert-danger" style={{
                                    backgroundColor: "#ffebee",
                                    color: "#c62828",
                                    padding: "15px",
                                    borderRadius: "4px",
                                    marginBottom: "20px",
                                    border: "1px solid #ffcdd2",
                                    textAlign: "center"
                                }}>
                                    <strong>Error:</strong> {error}
                                </div>
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className="row">
                            <div className="col-12">
                                <div className="alert alert-success" style={{
                                    backgroundColor: "#e8f5e8",
                                    color: "#2e7d32",
                                    padding: "15px",
                                    borderRadius: "4px",
                                    marginBottom: "20px",
                                    border: "1px solid #c8e6c9",
                                    textAlign: "center"
                                }}>
                                    <strong>Success:</strong> {success}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="row">
                        {/*login*/}
                        <div className="col-md-5 login-register-border">
                            <div className="login-register-content">
                                <div className="login-register-title mb-30">
                                    <h2>Login</h2>
                                    <p>Welcome back! Please enter your email and password to login. </p>
                                </div>
                                <div className="login-register-style login-register-pr">
                                    <form action="" method="post">
                                        <div className="login-register-input">
                                            <input type="text"
                                                   id="login-email"
                                                   name="email"
                                                   value={loginData.email}
                                                   onChange={handleLogin}
                                                   placeholder="Email address"
                                            />
                                        </div>
                                        <div className="login-register-input">
                                            <input type="password"
                                                   id="login-password"
                                                   name="password"
                                                   value={loginData.password}
                                                   onChange={handleLogin}
                                                   placeholder="Password"
                                            />
                                            <div className="forgot">
                                                <a onClick={handleForgotPassword}>Forgot?</a>
                                            </div>
                                        </div>
                                        <div className="remember-me-btn">
                                            <input type="checkbox" />
                                            <label>Remember me</label>
                                        </div>
                                        <div className="btn-register">
                                            <button className="btn-register-now"
                                                    onClick={handleLoginSubmit}>Login
                                            </button>
                                        </div>
                                        <br/>
                                        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                                            <button
                                                type="button"
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    backgroundColor: "#fff",
                                                    color: "#444",
                                                    border: "1px solid #ddd",
                                                    borderRadius: "4px",
                                                    padding: "8px 18px",
                                                    cursor: "pointer",
                                                    fontWeight: "bold"
                                                }}
                                                onClick={handleGoogleLogin}
                                            >
                                                <img
                                                    src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
                                                    alt="Google"
                                                    style={{ width: 26, height: 14, marginRight: 19 }}
                                                />
                                                Google Login
                                            </button>

                                            <button
                                                type="button"
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    backgroundColor: "#4267B2",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "4px",
                                                    padding: "8px 18px",
                                                    cursor: "pointer",
                                                    fontWeight: "bold"
                                                }}
                                                onClick={() => window.location.href = "/api/auth/facebook"}
                                            >
                                                <img
                                                    src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
                                                    alt="Facebook"
                                                    style={{ width: 12, height: 14, marginRight: 19 }}
                                                />
                                                Facebook Login
                                            </button>

                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-7">
                            <div className="login-register-content login-register-pl">
                                <div className="login-register-title mb-30">
                                    <h2>Register</h2>
                                    <p>Create new account today to reap the benefits of a personalized shopping experience. </p>
                                </div>
                                <div className="login-register-style">
                                    <form method="post">
                                        <div className="login-register-input">
                                            <input type="text"
                                                   id="register-username"
                                                   name="username"
                                                   value={registerData.username}
                                                   placeholder="Username"
                                                   onChange={handleRegister}
                                            />
                                        </div>
                                        <div className="login-register-input">
                                            <input type="text"
                                                   id="register-email"
                                                   name="email"
                                                   value={registerData.email}
                                                   placeholder="E-mail address"
                                                   onChange={handleRegister}
                                            />
                                        </div>
                                        <div className="login-register-input">
                                            <input type="password"
                                                   id="register-password"
                                                   name="password"
                                                   value={registerData.password}
                                                   placeholder="Password"
                                                   onChange={handleRegister}
                                            />
                                        </div>

                                        <div className="login-register-input">
                                            <input type="password"
                                                   id="register-confirmPassword"
                                                   name="confirmPassword"
                                                   value={registerData.confirmPassword}
                                                   placeholder="Confirm Password"
                                                   onChange={handleRegister}
                                            />
                                        </div>
                                        <div className="login-register-paragraph">
                                            <p>Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our <a href="#">privacy policy.</a></p>
                                        </div>
                                        <div className="btn-register">
                                            <button className="btn-register-now" onClick={handleRegisterSubmit}>
                                                Register
                                            </button>
                                        </div>
                                    </form>
                                    <div className="register-benefits">
                                        <h3>Sign up today and you will be able to :</h3>
                                        <p>The Loke Buyer Protection has you covered from click to delivery. Sign up <br />or sign in and you will be able to:</p>
                                        <ul>
                                            <li><i className="fa fa-check-circle-o"></i> Speed your way through checkout</li>
                                            <li><i className="fa fa-check-circle-o"></i> Track your orders easily</li>
                                            <li><i className="fa fa-check-circle-o"></i> Keep a record of all your purchases</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}