import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './assets/css/vendor/bootstrap.min.css'
import './assets/css/plugins/swiper-bundle.min.css'
import './assets/css/style.css'
import './assets/css/plugins/fancybox.min.css'
import './assets/css/plugins/font-awesome.min.css'
import './assets/css/plugins/nice-select.css'
import './assets/css/plugins/range-slider.css'
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import {CartProvider} from "./contexts/CartContext.jsx";



createRoot(document.getElementById('root')).render(
    <>
        <CartProvider>
              <App />
        </CartProvider>
    </>
)
