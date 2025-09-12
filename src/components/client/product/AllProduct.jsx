import React, { useEffect, useRef, useState } from "react";
import imgFallback from "../../../assets/images/shop/6.png";

import { useCart } from "../../../contexts/CartContext.jsx";
import {
    fetchAddToCart,
    fetchProductImageById,
    fetchProducts,
} from "../../../api/product.js";
import { getCart } from "../../../api/user.js";
import WishlistModal from "../../../components/client/WishlistModal.jsx";
const USE_OBJECT_URL = true;

// Nếu không dùng object URL, convert arraybuffer -> data URL
const arrayBufferToDataUrl = (buffer, contentType) => {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    const base64 = btoa(binary);
    return `data:${contentType || "image/png"};base64,${base64}`;
};

const AllProduct = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imageUrls, setImageUrls] = useState({});
    const { setCart } = useCart();

    // Modal state
    const [modalInfo, setModalInfo] = useState({
        isOpen: false,
        message: "",
        product: null,
    });

    // Giữ danh sách URL đã tạo để revoke khi cần
    const createdUrlsRef = useRef([]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const res = await fetchProducts();
                setProducts(res.data?.content || []);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    useEffect(() => {
        if (products.length === 0) {
            setImageUrls({});
            return;
        }

        let isActive = true;
        const newUrls = {};
        const tempCreatedUrls = [];

        const loadImages = async () => {
            await Promise.all(
                products.map(async (product) => {
                    try {
                        if (product.imageId) {
                            const res = await fetchProductImageById(product.imageId);
                            const contentType = res.headers?.["content-type"] || "image/png";

                            if (USE_OBJECT_URL) {
                                const blob = new Blob([res.data], { type: contentType });
                                const url = URL.createObjectURL(blob);
                                newUrls[product.id] = url;
                                tempCreatedUrls.push(url);
                            } else {
                                newUrls[product.id] = arrayBufferToDataUrl(res.data, contentType);
                            }
                        } else {
                            newUrls[product.id] = imgFallback;
                        }
                    } catch {
                        newUrls[product.id] = imgFallback;
                    }
                })
            );

            if (!isActive) return;

            // Dọn các URL cũ trước khi set mới (nếu bật object URL)
            if (USE_OBJECT_URL && createdUrlsRef.current.length) {
                createdUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
            }
            createdUrlsRef.current = tempCreatedUrls;

            setImageUrls(newUrls);
        };

        loadImages();

        // Cleanup khi products thay đổi hoặc component unmount
        return () => {
            isActive = false;
            if (USE_OBJECT_URL && createdUrlsRef.current.length) {
                createdUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
                createdUrlsRef.current = [];
            }
        };
    }, [products]);

    const handleAddToCart = async (productId, quantity = 1) => {
        try {
            await fetchAddToCart({ productId, quantity });

            const cart = await getCart();
            setCart(cart);

            const p = products.find((x) => x.id === productId);

            setModalInfo({
                isOpen: true,
                message: "Product added to cart successfully!",
                product: p
                    ? {
                        name: p.name,
                        href: p.link || "#",
                        imageSrc: imageUrls[p.id] || imgFallback,
                        imageAlt: p.name,
                    }
                    : null,
            });
        } catch (err) {
            if (err.response?.status === 403) {
                setModalInfo({
                    isOpen: true,
                    message: "You must login to add product!",
                    product: null,
                });
            } else {
                console.error("Add to cart error:", err);
                setModalInfo({
                    isOpen: true,
                    message: "Failed to add product to cart.",
                    product: null,
                });
            }
        }
    };

    if (loading) return <div className="text-center">Loading products...</div>;

    return (
        <section className="product-area section-space">
            <div className="container">
                <div className="section-title text-center">
                    <h2 className="title">Best Products</h2>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                </div>

                <div className="row mb-n6">
                    {products.map((product) => (
                        <div className="col-sm-6 col-lg-4 mb-6" key={product.id}>
                            <div className="product-item product-item-border">
                                <a className="product-thumb" href={product.link || "#"}>
                                    <img
                                        src={imageUrls[product.id] || imgFallback}
                                        onError={(e) => {
                                            e.currentTarget.src = imgFallback;
                                        }}
                                        width="300"
                                        height="286"
                                        alt={product.name}
                                    />
                                </a>
                                {product.status && <span className="badges">{product.status}</span>}

                                <div className="product-action">
                                    <button type="button" className="product-action-btn" title="Quick View">
                                        <i className="fa fa-expand" />
                                    </button>
                                    <button type="button" className="product-action-btn">
                                        <i className="fa fa-heart-o" />
                                    </button>
                                    <button type="button" className="product-action-btn" title="Compare">
                                        <i className="fa fa-exchange" />
                                    </button>
                                </div>

                                <div className="product-info">
                                    <h4 className="title">
                                        <a href={product.link || "#"}>{product.name}</a>
                                    </h4>
                                    <div className="price">
                                        {"$" + Number(product.price || 0).toLocaleString("en-US")}
                                        {product.originalPrice && Number(product.originalPrice) !== Number(product.price) && (
                                            <span className="price-old">
                        {" $" + Number(product.originalPrice).toLocaleString("en-US")}
                      </span>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        className="info-btn-wishlist"
                                        onClick={() => handleAddToCart(product.id)}
                                        title="Add to Cart"
                                    >
                                        <i className="fa fa-shopping-cart" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <WishlistModal
                isOpen={modalInfo.isOpen}
                onClose={() => setModalInfo((s) => ({ ...s, isOpen: false }))}
                product={modalInfo.product}
                message={modalInfo.message}
            />
        </section>
    );
};

export default AllProduct;
