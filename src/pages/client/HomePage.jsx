import Header from "../../components/client/Header.jsx";
import AllProduct from "../../components/client/product/AllProduct.jsx";
import Slider from "../../components/client/Slider.jsx";

export default function HomePage() {
    return (
        <div className="wrapper">
            <Header/>
            <main className="main-content">
                 <Slider/>
                 <AllProduct/>
            </main>
        </div>
    );
}