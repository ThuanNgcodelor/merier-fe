import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const GoogleCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (code) {
            console.log("Google authorization code received:", code);

            axios.post("http://localhost:8080/v1/auth/login/google", { code })
                .then(res => {
                    console.log("Google login successful:", res.data);
                    Cookies.set("accessToken", res.data.token);
                    navigate("/");
                })
                .catch(err => {
                    console.error("Google login error details:", {
                        message: err.message,
                        status: err.response?.status,
                        statusText: err.response?.statusText,
                        data: err.response?.data,
                        config: {
                            url: err.config?.url,
                            method: err.config?.method,
                            data: err.config?.data
                        }
                    });

                    if (err.response?.data) {
                        console.error("Response data details:", {
                            error: err.response.data.error,
                            message: err.response.data.message,
                            timestamp: err.response.data.timestamp,
                            path: err.response.data.path,
                            fullData: err.response.data
                        });
                    }

                    let errorMessage = "Google login failed!";
                    if (err.response?.data?.message) {
                        errorMessage = err.response.data.message;
                    } else if (err.response?.data?.error) {
                        errorMessage = err.response.data.error;
                    } else if (err.message) {
                        errorMessage = err.message;
                    }

                    alert(`Google login failed: ${errorMessage}`);
                    navigate("/login");
                });
        } else {
            console.error("No authorization code found in URL");
            alert("No authorization code received from Google");
            navigate("/login");
        }
    }, [navigate]);

    return <div>Logger in with Google...</div>;
};

export default GoogleCallback;