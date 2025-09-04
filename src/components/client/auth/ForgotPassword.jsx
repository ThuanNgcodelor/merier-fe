import React, { useEffect, useRef, useState } from "react";
import "../../../assets/css/VerifyOtp.css";

export default function ForgotPassword({
                                           onSendEmail,
                                           cooldownSec = 60,
                                           maxResends = 3,
                                       }) {
    const [email, setEmail] = useState("");
    const [touched, setTouched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");
    const [resends, setResends] = useState(0);
    const [cooldown, setCooldown] = useState(0);

    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Đếm lùi cooldown
    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setInterval(() => setCooldown((c) => c - 1), 1000);
        return () => clearInterval(t);
    }, [cooldown]);

    const isValidEmail = (v) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

    const canSubmit = isValidEmail(email) && !loading;
    const canResend =
        sent && resends < maxResends && cooldown === 0 && !loading;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched(true);
        setError("");

        if (!isValidEmail(email)) return;

        try {
            setLoading(true);
            await onSendEmail?.(email);
            setSent(true);
            setResends((r) => r + 1);
            setCooldown(cooldownSec);
        } catch (err) {
            setError(
                err?.message || "Could not send reset email. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async (e) => {
        e.preventDefault();
        if (!canResend) return;
        await handleSubmit(e);
    };

    const emailError =
        touched && !isValidEmail(email) ? "Invalid email format" : "";

    return (
        <div
            className="container d-flex justify-content-center align-items-center"
            style={{ minHeight: "100dvh", paddingBlock: 16, overflowY: "auto" }}
        >

        <div className="position-relative">
                <div className="card p-3 text-center custom-card">
                    <h6>
                        Forgot your password? <br />
                    </h6>

                    <form className="mt-3 w-100 px-3" onSubmit={handleSubmit} noValidate>
                        <div className="mb-2 text-start">
                            <label htmlFor="fp-email" className="form-label fw-semibold">
                                Email
                            </label>
                            <input
                                id="fp-email"
                                ref={inputRef}
                                type="email"
                                className={`form-control ${emailError ? "is-invalid" : ""}`}
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={() => setTouched(true)}
                                autoComplete="email"
                                aria-describedby="fp-email-help"
                            />
                            {emailError && (
                                <div className="invalid-feedback">{emailError}</div>
                            )}
                            <div id="fp-email-help" className="form-text">
                                We’ll send a password reset link to this email.
                            </div>
                        </div>

                        {error && (
                            <div className="alert alert-danger py-1 my-2" role="alert">
                                {error}
                            </div>
                        )}

                        {sent && !error && (
                            <div className="form-text alert-success py-1 my-2" role="alert">
                                Reset link sent to <strong>{email}</strong>. Please check your inbox.
                            </div>
                        )}

                        <div className="mt-4">
                            <button className="btn btn-danger px-0 validate"
                                    type="submit"
                                    disabled={!canSubmit}>
                                {loading ? "Sending..." : "Send Reset Link"}
                            </button>
                        </div>


                    </form>
                </div>

                <div className="card-2">
                    <div className="content d-flex justify-content-center align-items-center">
                        <span>Didn’t get the email?</span>
                        <a
                            href="#"
                            className={`text-decoration-none ms-3 ${!canResend ? "disabled-link" : ""}`}
                            onClick={handleResend}
                            aria-disabled={!canResend}
                        >
                            {sent
                                ? cooldown > 0
                                    ? `Resend in ${cooldown}s (${resends}/${maxResends})`
                                    : `Resend (${resends}/${maxResends})`
                                : `Resend (${resends}/${maxResends})`}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
