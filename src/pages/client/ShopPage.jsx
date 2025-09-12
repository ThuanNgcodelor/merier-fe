import Header from "../../components/client/Header.jsx";
import ShopTopBar from "../../components/client/product/ShopTopBar.jsx";
import AllProduct from "../../components/client/product/AllProduct.jsx";
import SearchProduct from "../../components/client/product/SearchProduct.jsx";

export default function ShopPage() {
    return (
        <div className="wrapper">
            
            <Header/>
            <main className="main-content">
            <ShopTopBar />
            <SearchProduct />
            </main>
        </div>
    );
}