import { useNavigate } from "react-router-dom";
import ForgotPassword from "../../components/client/auth/ForgotPassword.jsx";
import { forgotPassword } from "../../api/auth";

export default function ForgotPasswordPage() {
    const navigate = useNavigate();

    const handleSendEmail = async (email) => {
        await forgotPassword(email);
        navigate("/verify-otp", { state: { email } });
    };

    return (
        <ForgotPassword
            onSendEmail={handleSendEmail}
            cooldownSec={60}
            maxResends={3}
        />
    );
}
