import React from "react";
import img1 from "../../../assets/images/shop/13.png";
import img2 from "../../../assets/images/shop/23.jpg";
import img3 from "../../../assets/images/shop/17.jpg";
import img4 from "../../../assets/images/shop/24.jpg";
import img5 from "../../../assets/images/shop/20.jpg";


const products = [
    {
        img: img1,
        title: "Casual Prince",
        price: "$650.00",
        priceOld: "$650.00",
        link: "shop-single-product.html",
        badge: "New",
    },
    {
        img: img2,
        title: "Fit Wool Suit",
        price: "$650.00",
        priceOld: "$650.00",
        link: "shop-single-product.html",
        badge: "New",
    },
    {
        img: img3,
        title: "Slightly jackets",
        price: "$650.00",
        priceOld: "$650.00",
        link: "shop-single-product.html",
        badge: "New",
    },
    {
        img: img4,
        title: "Red Perspiciatis",
        price: "$650.00",
        priceOld: "$650.00",
        link: "shop-single-product.html",
        badge: "New",
    },
    {
        img: img5,
        title: "Style Modern Dress",
        price: "$650.00",
        priceOld: "$650.00",
        link: "shop-single-product.html",
        badge: "New",
    },
    {
        img: img5,
        title: "Star Women pants",
        price: "$650.00",
        priceOld: "$650.00",
        link: "shop-single-product.html",
        badge: "New",
    },
    {

        img: img5,
        title: "Flower Print dress",
        price: "$650.00",
        priceOld: "$650.00",
        link: "shop-single-product.html",
        badge: "New",
    },
    {
        img: img5,
        title: "Winter Sprit",
        price: "$650.00",
        priceOld: "$650.00",
        link: "shop-single-product.html",
        badge: "New",
    },
    {
        img: img5,
        title: "Slightly Hoody",
        price: "$650.00",
        priceOld: "$650.00",
        link: "shop-single-product.html",
        badge: "New",
    },
    {
        img: img5,
        title: "Slightly jackets",
        price: "$650.00",
        priceOld: "$650.00",
        link: "shop-single-product.html",
        badge: "New",
    },
    {
        img: img5,
        title: "Casual Prince",
        price: "$650.00",
        priceOld: "$650.00",
        link: "shop-single-product.html",
        badge: "New",
    },
    {
        img: img5,
        title: "Modern Necklace",
        price: "$650.00",
        priceOld: "$650.00",
        link: "shop-single-product.html",
        badge: "New",
    },
];

const SearchProduct = () => {
    return (
        <section className="product-area section-space">
            <div className="container">
                <div className="row mb-n6 product-items-two">
                    {products.map((product, idx) => (
                        <div className="col-sm-6 col-lg-4 col-xl-3 mb-6" key={idx}>
                            <div className="product-item">
                                <a className="product-thumb" href={product.link}>
                                    <img src={product.img} width="300" height="286" alt="Image-HasTech" />
                                </a>
                                <span className="badges">{product.badge}</span>
                                <div className="product-action">
                                    <button type="button" className="product-action-btn action-btn-quick-view" data-bs-toggle="modal" data-bs-target="#action-QuickViewModal">
                                        <i className="fa fa-expand"></i>
                                    </button>
                                    <button type="button" className="product-action-btn action-btn-cart" data-bs-toggle="modal" data-bs-target="#action-CartAddModal">
                                        <i className="fa fa-shopping-cart"></i>
                                    </button>
                                    <button type="button" className="product-action-btn action-btn-compare" data-bs-toggle="modal" data-bs-target="#action-CompareModal">
                                        <i className="fa fa-exchange"></i>
                                    </button>
                                </div>
                                <div className="product-info">
                                    <h4 className="title">
                                        <a href={product.link}>{product.title}</a>
                                    </h4>
                                    <div className="price">
                                        {product.price} <span className="price-old">{product.priceOld}</span>
                                    </div>
                                    <button type="button" className="info-btn-wishlist" data-bs-toggle="modal" data-bs-target="#action-WishlistModal">
                                        <i className="fa fa-heart-o"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="col-12 mb-6 d-flex justify-content-center">
                    <nav className="pagination-area">
                        <ul className="page-numbers">
                            <li>
                                <a className="page-number active" >1</a>
                            </li>
                            <li>
                                <a className="page-number" >2</a>
                            </li>
                            <li>
                                <a className="page-number">3</a>
                            </li>
                            <li>
                                <a className="page-number next">
                                    <i className="fa fa-angle-right"></i>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>

            </div>
        </section>
    );
};

export default SearchProduct;