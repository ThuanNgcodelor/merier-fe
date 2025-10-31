import { useLocation, useNavigate } from "react-router-dom";
import { useEffect,  useState } from "react";
import VerifyOtp from "../../components/client/auth/VerifyOtp";
import { verifyOtp, forgotPassword } from "../../api/auth";

const maskEmail = (email) => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    if (!domain) return email;
    const n = name.length;
    const head = name.slice(0, Math.min(2, n));
    const tail = name.slice(-1);
    return `${head}${"*".repeat(Math.max(1, n - 3))}${tail}@${domain}`;
};

export default function VerifyOtpPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const email = state?.email;

    useEffect(() => {
        if (!email) navigate("/forgot"); // thieu email thì quay lại
    }, [email, navigate]);

    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");

    const onValidate = async (code) => {
        try {
            await verifyOtp(email, code);
            console.log("OTP verified" + code);
            setErr(""); setMsg("");
            setMsg("OTP verified. Please proceed.");
            navigate("/reset-password", { state: { email } });
        } catch (e) {
            setErr(e?.response?.data || "Invalid or expired OTP");
        }
    };

    const onResend = async () => {
        try {
            setErr(""); setMsg("");
            await forgotPassword(email);
            setMsg("A new code has been sent to your email.");
        } catch (e) {
            setErr(e?.response?.data || "Please wait before requesting another code.");
        }
    };

    return (
        <div
            className="container d-flex justify-content-center align-items-center"
            style={{ minHeight: "100dvh", paddingBlock: 16, overflowY: "auto" }}
        >
            <div className="w-100" style={{ maxWidth: 420 }}>
                {msg && <div className="alert alert-success py-2">{msg}</div>}
                {err && <div className="alert alert-danger py-2">{err}</div>}

                <VerifyOtp
                    maskedPhone={maskEmail(email)}
                    onValidate={onValidate}
                    onResend={onResend}
                    resendLabel="Resend"
                />
            </div>
        </div>
    );
}
