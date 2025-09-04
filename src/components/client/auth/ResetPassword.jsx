import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updatePassword } from "../../../api/auth.js";
import "../../../assets/css/VerifyOtp.css";


export default function ResetPassword() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const email = state?.email || "";

    useEffect(() => {
        if (!email) navigate("/forgot");
    }, [email, navigate]);

    const [pwd, setPwd] = useState("");
    const [pwd2, setPwd2] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [showPwd2, setShowPwd2] = useState(false);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const [msg, setMsg] = useState("");

    const strongEnough = (s) => s.length >= 8;
    const canSubmit = email && strongEnough(pwd) && pwd === pwd2 && !loading;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr(""); setMsg("");
        if (!canSubmit) return;
        try {
            setLoading(true);
            await updatePassword(email, pwd);
            setMsg("Password updated successfully. Please sign in.");
            setTimeout(() => navigate("/login"), 800);
        } catch (e2) {
            const m = e2?.response?.data || "Verification expired. Please verify again.";
            setErr(m);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="container d-flex justify-content-center align-items-center"
            style={{ minHeight: "100dvh", paddingBlock: 16, overflowY: "auto" }}
        >
            <div className="w-100" style={{ maxWidth: 420 }}>
                {msg && <div className="alert alert-success py-2">{msg}</div>}
                {err && <div className="alert alert-danger  py-2">{err}</div>}

                <div className="position-relative d-flex justify-content-center align-items-center">
                <div className="card p-3 text-center custom-card">
                    <h6>Reset your password</h6>
                    <form className="mt-2 w-100 px-2" onSubmit={handleSubmit} noValidate>
                        {/* New password */}
                        <div className="mb-2 text-start">
                            <label className="form-label fw-semibold">New password</label>
                            <div className="input-group">
                                <input
                                    type={showPwd ? "text" : "password"}
                                    className={`form-control ${pwd && !strongEnough(pwd) ? "is-invalid" : ""}`}
                                    placeholder="At least 8 characters"
                                    value={pwd}
                                    onChange={(e) => setPwd(e.target.value)}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowPwd((s) => !s)}
                                >
                                    {showPwd ? "Hide" : "Show"}
                                </button>
                            </div>
                            {pwd && !strongEnough(pwd) && (
                                <div className="invalid-feedback">Password must be at least 8 characters.</div>
                            )}
                        </div>

                        {/* Confirm */}
                        <div className="mb-2 text-start">
                            <label className="form-label fw-semibold">Confirm password</label>
                            <div className="input-group">
                                <input
                                    type={showPwd2 ? "text" : "password"}
                                    className={`form-control ${pwd2 && pwd2 !== pwd ? "is-invalid" : ""}`}
                                    placeholder="Re-enter new password"
                                    value={pwd2}
                                    onChange={(e) => setPwd2(e.target.value)}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowPwd2((s) => !s)}
                                >
                                    {showPwd2 ? "Hide" : "Show"}
                                </button>
                            </div>
                            {pwd2 && pwd2 !== pwd && (
                                <div className="invalid-feedback">Passwords do not match.</div>
                            )}
                        </div>

                        <div className="mt-4">
                            <button className="btn btn-danger px-0 validate" type="submit" disabled={!canSubmit}>
                                {loading ? "Updating..." : "Update Password"}
                            </button>
                        </div>

                    </form>
                </div>
                </div>

                {/* Không cần "Resend" ở bước này nữa vì đã verify xong */}
            </div>
        </div>
    );
}
