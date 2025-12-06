import Header from "../../components/client/Header.jsx";
import Footer from "../../components/client/Footer.jsx";
import ChatBotWidget from "../../components/client/ChatBotWidget.jsx";
import BannerCarousel from "../../components/client/BannerCarousel.jsx";
import CategoryGrid from "../../components/client/CategoryGrid.jsx";
import AllProduct from "../../components/client/product/AllProduct.jsx";

export default function HomePage() {
  return (
    <div className="wrapper" style={{ background: '#F5F5F5', minHeight: '100vh' }}>
      <Header />
      <main>
        {/* Hero Banner Section */}
        <BannerCarousel />

        {/* Category Section */}
        <CategoryGrid />

        {/* Products Section */}
        <div style={{ background: 'white', marginTop: '8px', padding: '24px 0' }}>
          <div className="container" style={{ maxWidth: '1200px' }}>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h4 style={{ fontSize: '16px', color: '#757575', textTransform: 'uppercase', margin: 0 }}>
                Gợi Ý Hôm Nay
              </h4>
              <div style={{ fontSize: '14px', color: '#ee5a6f', cursor: 'pointer' }}>
                Xem thêm →
              </div>
            </div>
            <AllProduct />
          </div>
        </div>
      </main>
      <Footer />
      <ChatBotWidget />
    </div>
  );
}
