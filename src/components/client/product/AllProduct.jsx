import React, { useEffect, useState } from 'react';
import img1 from "../../../assets/images/shop/1.png";
import img2 from "../../../assets/images/shop/2.png";
import img3 from "../../../assets/images/shop/3.png";
import img4 from "../../../assets/images/shop/4.png";
import img5 from "../../../assets/images/shop/5.png";
import img6 from "../../../assets/images/shop/6.png";
import { useCart } from "../../../contexts/CartContext.jsx";
import { fetchProducts } from "../../../api/product.js";


const huhu = [
    {
        img: img1,
        title: "Literature Classical",
        price: "$650.00",
        priceOld: "$650.00",
        link: "shop-single-product.html",
        badge: "New",
    },
    {
        img: img2,
        title: "Style Modern Dress",
        price: "$650.00",
        priceOld: "$650.00",
        link: "shop-single-product.html",
        badge: "New",
    },
    {
        img: img3,
        title: "Randomised Words",
        price: "$650.00",
        priceOld: "$650.00",
        link: "shop-single-product.html",
        badge: "New",
    },
    {
        img: img4,
        title: "Fit Wool Suit",
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
        img: img6,
        title: "Slightly jackets",
        price: "$650.00",
        priceOld: "$650.00",
        link: "shop-single-product.html",
        badge: "New",
    },
];

const AllProduct = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imageUrls, setImageUrls] = useState({});
    const { setCart } = useCart();

    useEffect(() => {
        fetchProducts()
            .then(res => {
                setProducts(res.data.context || []);
            })
            .catch(err => {
                setProducts([]);
                console.error("Failed to fetch products:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);
    useEffect(() => {
        const fetchImages = async () => {
            const urls = {};
            await Promise.all(products.map(async (product) => {
                if (product.imageId) {
                    try {
                        const res = await fetchProductImageById(product.imageId);
                        const blob = new Blob([res.data], { type: res.headers['content-type'] });
                        urls[product.id] = URL.createObjectURL(blob);
                    } catch (e) {
                        urls[product.id] = imgDefault;
                    }
                } else {
                    urls[product.id] = imgDefault;
                }
            }));
            setImageUrls(urls);
        };
        if (products.length > 0) fetchImages();
    }, [products]);

    const handleAddToCart = async (productId, quantity) => {
        try {
            const data = { productId, quantity };
            await fetchAddToCart(data);
            alert('Product added to cart successfully!');
            const cartData = await getCart();
            setCart(cartData);
        } catch (err) {
            if (err.response && err.response.status === 403) {
                alert('Bạn cần đăng nhập để thêm vào giỏ hàng!');
            } else {
                alert('Error adding to cart');
            }
        }
    };
    return (
        <section className="product-area section-space">
            <div className="container">
                <div className="section-title text-center">
                    <h2 className="title">Best Products</h2>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                </div>
                <div className="row mb-n6">
                    {huhu.map((product, idx) => (
                        <div className="col-sm-6 col-lg-4 mb-6" key={idx}>
                            <div className="product-item product-item-border">
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
            </div>
        </section>
    );
};

export default AllProduct;