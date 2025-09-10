import {Link, useNavigate} from 'react-router-dom';
import logoLight from '../../assets/images/logo.png';
import NavLink from './NavLink';
import Cookies from "js-cookie";
import {useEffect, useState} from "react";
import {useCart} from "../../contexts/CartContext.jsx";
import {getCart} from "../../api/user.js";
import { getUserRole, isAuthenticated, logout } from "../../api/auth.js";

export default function Header() {
    const  navigate = useNavigate();
    const { cart, setCart } = useCart();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const handleLoginClick = () => {
        navigate('/login');
    }
    const handleGoToCart = () => {
        navigate('/cart');
    }
    const token = Cookies.get("accessToken");

    const [roles, setRoles] = useState([]);
    const authed = isAuthenticated();

    useEffect(() => {
        const r = getUserRole();
        const list = Array.isArray(r) ? r : (r ? [r] : []);
        setRoles(list);
    }, [token]);

    useEffect(() => {
        if(!token){
            setCart(null);
            setLoading(false);
            setError(null);
            return;
        }
        async function fetchTotalCart() {
            try{
                setLoading(true);
                const data = await getCart();
                setCart(data);
            }catch(e){
                setError(e);
            }finally {
                setLoading(false);
            }
        }
        fetchTotalCart();
    }, [token, setCart]);

    const hasRole = (role) => roles.includes(role);

    const goAccount = () => navigate('/information');
    const goVet = () => navigate('/vet');
    const goShelter = () => navigate('/shelter');
    const goAdmin = () => navigate('/admin');

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <header className="header-area">
            <div className="container">
                <div className="row align-items-center justify-content-between">
                    <div className="col-auto">
                        <div className="header-logo">
                            <Link to="/">
                                <img className="logo-main" src={logoLight} width="153" height="30"
                                    alt="Logo" />
                            </Link>
                        </div>
                    </div>
                    <div className="col-auto d-none d-lg-block">
                        <div className="header-navigation">
                            <ul className="main-nav">
                                <li className="has-submenu"><NavLink to="/">Home</NavLink>
                                    <ul className="submenu-nav">
                                        <li><Link to="/">Home One</Link></li>
                                        <li><Link to="/home-two">Home Two</Link></li>
                                    </ul>
                                </li>
                                <li className="has-submenu position-static"><Link to="/shop">Shop</Link>
                                    <ul className="submenu-nav-mega">
                                        <li><Link to="/shop" className="mega-title">Shop Layout</Link>
                                            <ul>
                                                <li><Link to="/shop">Shop 3 Column</Link></li>
                                                <li><Link to="/shop-four-columns">Shop 4 Column</Link></li>
                                                <li><Link to="/shop-left-sidebar">Shop Left Sidebar</Link></li>
                                                <li><Link to="/shop-right-sidebar">Shop Right Sidebar</Link></li>
                                            </ul>
                                        </li>
                                        <li><Link to="/shop-single-product" className="mega-title">Single Product</Link>
                                            <ul>
                                                <li><Link to="/shop-single-product">Single Product Normal</Link></li>
                                                <li><Link to="/shop-single-product-variable">Single Product
                                                    Variable</Link></li>
                                                <li><Link to="/shop-single-product-group">Single Product Group</Link>
                                                </li>
                                                <li><Link to="/shop-single-product-affiliate">Single Product
                                                    Affiliate</Link></li>
                                            </ul>
                                        </li>
                                        <li><Link to="/shop-cart" className="mega-title">Others Pages</Link>
                                            <ul>
                                                <li><Link to="/shop-cart">Shopping Cart</Link></li>
                                                <li><Link to="/shop-checkout">Checkout</Link></li>
                                                <li><Link to="/shop-wishlist">Wishlist</Link></li>
                                                <li><Link to="/shop-compare">Compare</Link></li>
                                            </ul>
                                        </li>
                                    </ul>
                                </li>
                                <li className="has-submenu"><Link to="/pages">Pages</Link>
                                    <ul className="submenu-nav">
                                        <li><Link to="/about-us">About</Link></li>
                                        <li><Link to="/account">Account</Link></li>
                                        <li><Link to="/login-register">Login/Register</Link></li>
                                        <li><Link to="/page-not-found">Page Not Found</Link></li>
                                        <li><Link to="/contact">Contact</Link></li>
                                    </ul>
                                </li>
                                <li className="has-submenu"><Link to="/blog">Blog</Link>
                                    <ul className="submenu-nav">
                                        <li><Link to="/blog">Blog Grid</Link></li>
                                        <li><Link to="/blog-left-sidebar">Blog Left Sidebar</Link></li>
                                        <li><Link to="/blog-right-sidebar">Blog Right Sidebar</Link></li>
                                        <li><Link to="/blog-details">Blog Details</Link></li>
                                        <li><Link to="/blog-details-left-sidebar">Blog Details Left Sidebar</Link></li>
                                        <li><Link to="/blog-details-right-sidebar">Blog Details Right Sidebar</Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-auto">
                        <div className="header-action">
                            <form className="header-search-box d-none d-md-block">
                                <input className="form-control" type="text" id="search" placeholder="Search" />
                                <button type="submit" className="btn-src">
                                    <i className="fa fa-search"></i>
                                </button>
                            </form>

                            {!authed && (
                                <button className="header-action-cart" type="button" data-bs-toggle="offcanvas"
                                        data-bs-target="#offcanvasWithCartSidebar"
                                        aria-controls="offcanvasWithCartSidebar"
                                        onClick={handleLoginClick}
                                > Login
                                    <span className="cart-icon">
                                    </span>
                                </button>
                            )}

                            {authed && (
                                <>
                                    <button className="header-action-cart" type="button"
                                            data-bs-toggle="offcanvas"
                                            data-bs-target="#offcanvasWithCartSidebar"
                                            aria-controls="offcanvasWithCartSidebar"
                                            onClick={goAccount}>
                                        My Account
                                        <span className="cart-icon"></span>
                                    </button>

                                    {hasRole("ROLE_VET") && (
                                        <button className="header-action-cart" type="button"
                                                data-bs-toggle="offcanvas"
                                                data-bs-target="#offcanvasWithCartSidebar"
                                                aria-controls="offcanvasWithCartSidebar"
                                                onClick={goVet}>
                                            Vet Portal
                                            <span className="cart-icon"></span>
                                        </button>
                                    )}

                                    {hasRole("ROLE_SHELTER") && (
                                        <button className="header-action-cart" type="button"
                                                data-bs-toggle="offcanvas"
                                                data-bs-target="#offcanvasWithCartSidebar"
                                                aria-controls="offcanvasWithCartSidebar"
                                                onClick={goShelter}>
                                            Shelter
                                            <span className="cart-icon"></span>
                                        </button>
                                    )}

                                    {hasRole("ROLE_ADMIN") && (
                                        <button className="header-action-cart" type="button"
                                                data-bs-toggle="offcanvas"
                                                data-bs-target="#offcanvasWithCartSidebar"
                                                aria-controls="offcanvasWithCartSidebar"
                                                onClick={goAdmin}>
                                            Admin
                                            <span className="cart-icon"></span>
                                        </button>
                                    )}

                                    <button className="header-action-cart" type="button"
                                            data-bs-toggle="offcanvas"
                                            data-bs-target="#offcanvasWithCartSidebar"
                                            aria-controls="offcanvasWithCartSidebar"
                                            onClick={handleLogout}>
                                        Logout
                                        <span className="cart-icon"></span>
                                    </button>
                                </>
                            )}

                            <button className="header-action-cart" type="button" data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasWithCartSidebar"
                                aria-controls="offcanvasWithCartSidebar" onClick={handleGoToCart}>
                                {cart?.items ? `${cart.items.length} items` : '0 items'}
                                <span className="cart-icon">
                                    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 8H12V5H15V3H12V0H10V3H7V5H10V8ZM6 17C5.46957 17 4.96086 17.2107 4.58579 17.5858C4.21071 17.9609 4 18.4696 4 19C4 19.5304 4.21071 20.0391 4.58579 20.4142C4.96086 20.7893 5.46957 21 6 21C6.53043 21 7.03914 20.7893 7.41421 20.4142C7.78929 20.0391 8 19.5304 8 19C8 18.4696 7.78929 17.9609 7.41421 17.5858C7.03914 17.2107 6.53043 17 6 17ZM16 17C15.4696 17 14.9609 17.2107 14.5858 17.5858C14.2107 17.9609 14 18.4696 14 19C14 19.5304 14.2107 20.0391 14.5858 20.4142C14.9609 20.7893 15.4696 21 16 21C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19C18 18.4696 17.7893 17.9609 17.4142 17.5858C17.0391 17.2107 16.5304 17 16 17ZM6.17 13.75L6.2 13.63L7.1 12H14.55C15.3 12 15.96 11.59 16.3 10.97L20.16 3.96L18.42 3H18.41L17.31 5L14.55 10H7.53L7.4 9.73L5.16 5L4.21 3L3.27 1H0V3H2L5.6 10.59L4.25 13.04C4.09 13.32 4 13.65 4 14C4 14.5304 4.21071 15.0391 4.58579 15.4142C4.96086 15.7893 5.46957 16 6 16H18V14H6.42C6.29 14 6.17 13.89 6.17 13.75Z"/>
                                    </svg>
                                </span>
                            </button>

                            <button className="btn-search-menu d-md-none" type="button" data-bs-toggle="offcanvas"
                                data-bs-target="#AsideOffcanvasSearch" aria-controls="AsideOffcanvasSearch">
                                <span className="search-icon">
                                        <path d="M12.5 11H11.71L11.43 10.73C12.41 9.59 13 8.11 13 6.5C13 2.91 10.09 0 6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C8.11 13 9.59 12.41 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 8.99 8.99 11 6.5 11Z"/>
                                </span>
                            </button>

                            <button className="btn-menu d-lg-none" type="button" data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions">
                                <i className="fa fa-bars"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}