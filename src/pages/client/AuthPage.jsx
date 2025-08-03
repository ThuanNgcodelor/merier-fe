import Header from "../../components/client/Header.jsx";
import Auth from "../../components/client/LoginRegister.jsx";

export default function AuthPage() {
    return (
        <div className="wrapper">
            <Header/>
            <main className="main-content">
            <Auth />
            </main>
        </div>
    );
}