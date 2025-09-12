import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import imgFallback from "../../../assets/images/shop/6.png";
import Cookies from "js-cookie";
import { getCart } from "../../../api/user.js";
import { fetchImageById } from "../../../api/image.js";
import {fetchProductById,removeCartItem} from "../../../api/product.js";

export function Cart() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageUrls, setImageUrls] = useState({});
    const [selected, setSelected] = useState(() => new Set());
    const [productNames, setProductNames] = useState({});

    const navigate = useNavigate();
    const token = Cookies.get("accessToken");

    // Load cart
    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        (async () => {
            try {
                const data = await getCart();
                setCart(data);
            } catch {
                setError("Failed to fetch cart data. Please try again later.");
                setCart({ items: [] });
            } finally {
                setLoading(false);
            }
        })();
    }, [token, navigate]);

    useEffect(() => {
        let revoked = false;
        const blobUrls = []; // để revoke

        const fetchImages = async () => {
            if (!Array.isArray(cart?.items) || cart.items.length === 0) return;

            const urls = {};
            const productCache = new Map();
            const names = {};

            await Promise.all(
                cart.items.map(async (item) => {
                    const pid = item.productId ?? item.id;
                    if (!pid) {
                        urls[Math.random()] = null;
                        return;
                    }

                    // 1) Ưu tiên imageId có sẵn trên item
                    let imageId = item.imageId;

                    // 2) Nếu chưa có, lấy product để đọc imageId
                    if (!imageId) {
                        try {
                            let product = productCache.get(pid);
                            if (!product) {
                                product = await fetchProductById(pid);
                                productCache.set(pid, product);
                            }
                            imageId = product?.data?.imageId ?? null;
                            const pname = product?.data?.name;
                            if (pname) names[pid] = pname;

                        } catch {
                            imageId = null;
                        }
                    }

                    // 3) Nếu có imageId -> tải ảnh
                    if (imageId) {
                        try {
                            const res = await fetchImageById(imageId);
                            const blob = new Blob([res.data], { type: res.headers["content-type"] });
                            const url = URL.createObjectURL(blob);
                            blobUrls.push(url);
                            urls[pid] = url;
                        } catch {
                            urls[pid] = null;
                        }
                    } else {
                        urls[pid] = null;
                    }
                })
            );

            if (!revoked) {
                setImageUrls(urls);
+                setProductNames((prev) => ({ ...prev, ...names }));
            }
        };

        fetchImages();

        return () => {
            revoked = true;
            blobUrls.forEach((u) => URL.revokeObjectURL(u));
        };
    }, [cart]);


    const items = cart?.items ?? [];
    const totalItems = items.length;

    const allIds = useMemo(
        () => items.map((it) => it.productId ?? it.productId ?? it.id),
        [items]
    );

    const toggleOne = (pid, checked) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (checked) next.add(pid);
            else next.delete(pid);
            return next;
        });
    };

    const allChecked = allIds.length > 0 && allIds.every((id) => selected.has(id));

    const toggleAll = (checked) => {
        if (checked) setSelected(new Set(allIds));
        else setSelected(new Set());
    };

    const selectedItems = useMemo(
        () => items.filter((it) => selected.has(it.productId ?? it.productId ?? it.id)),
        [items, selected]
    );

    // Tính tổng số lượng & tiền theo các item đã chọn
    const selectedQuantity = selectedItems.reduce(
        (sum, it) => sum + Number(it.quantity || 0),
        0
    );

    const selectedSubtotal = selectedItems.reduce((sum, it) => {
        const lineTotal =
            it.totalPrice != null
                ? Number(it.totalPrice)
                : Number(it.unitPrice || it.price || 0) * Number(it.quantity || 0);
        return sum + lineTotal;
    }, 0);

    const handleRemove = async (pid) => {
        try {
                 const ok = await removeCartItem(pid);
                if (ok) {
                     const data = await getCart();
                    setCart(data);            }
             } catch (e) {
                 console.error("Remove item failed:", e);
             }
         };

    const formatCurrency = (n) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(Number(n || 0));

    const handleCheckout = () => {
        if (selected.size === 0) return;
        const productIds = Array.from(selected);
        navigate("/checkout", {state: {productIds}});
    };

    if (loading) return <div className="container cart"><p>Loading cart...</p></div>;
    if (error) return <div className="container cart"><p>{error}</p></div>;
    if (!totalItems) return <div className="container cart"><p>Your cart is empty.</p></div>;

    return (
        <>
            <section className="page-header-area" style={{backgroundColor: "#f8eefa"}}>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-8">
                            <div className="page-header-content">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to="">David-Nguyen</Link>
                                    </li>
                                </ol>
                                <h2 className="page-header-title">My Cart</h2>
                                <div className="text-muted">{totalItems} items</div>
                            </div>
                        </div>
                        <div className="col-sm-4 d-sm-flex justify-content-end align-items-end">
                            <h5 className="showing-pagination-results"> / Cart Page</h5>
                        </div>
                    </div>
                </div>
            </section>

            <section className="cart-page-area section-space">
                <div className="container">
                    <div className="row">
                        {/* Cart Table */}
                        <div className="col-lg-12">
                            <div className="cart-table-wrap">
                                <div className="cart-table table-responsive">
                                    <table>
                                        <thead>
                                        <tr>
                                            <th style={{width: 48}}>
                                                <input
                                                    type="checkbox"
                                                    aria-label="Select all"
                                                    checked={allChecked}
                                                    onChange={(e) => toggleAll(e.target.checked)}
                                                />
                                            </th>
                                            <th className="width-thumbnail"></th>
                                            <th className="width-name">Product</th>
                                            <th className="width-price">Price</th>
                                            <th className="width-quantity">Quantity</th>
                                            <th className="width-subtotal">Subtotal</th>
                                            <th className="width-remove"></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {items.map((item) => {
                                            const pid = item.productId ?? item.productId ?? item.id;
                                            const img = imageUrls[pid] ?? imgFallback;
                                            const rowSubtotal = Number(item.price || 0) * Number(item.quantity || 0);
                                            return (
                                                <tr key={pid}>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={selected.has(pid)}
                                                            onChange={(e) => toggleOne(pid, e.target.checked)}
                                                            aria-label={`Select product ${pid}`}
                                                        />
                                                    </td>
                                                    <td className="product-thumbnail">
                                                        <Link to={`/products/${pid}`}>
                                                            <img
                                                                className="w-100"
                                                                src={img || imgFallback}
                                                                alt={item.productName || "Product"}
                                                                width="85"
                                                                height="85"
                                                                onError={(e) => (e.currentTarget.src = imgFallback)}
                                                            />
                                                        </Link>
                                                    </td>
                                                    <td className="product-name">
                                                        <div className="product-details-quality">
                                                            <div className="pro-qty">
                                                            {productNames[pid] || item.productName || pid}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="product-price">
                                                        <span className="amount">{formatCurrency(item.unitPrice)}</span>
                                                    </td>
                                                    <td className="cart-quality">
                                                        <div className="product-details-quality">
                                                            <div className="pro-qty">
                                                                <input
                                                                    type="text"
                                                                    title="Quantity"
                                                                    value={item.quantity}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="product-total">
                                                        <span>{formatCurrency(item.totalPrice)}</span>
                                                    </td>
                                                    <td className="product-remove">
                                                 <a  onClick={(e) => { e.preventDefault(); handleRemove(pid); }} aria-label="Remove item">
                                                             <i className="fa fa-trash-o"></i>
                                                         </a>
                                                     </td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="cart-shiping-update-wrapper">
                                <div className="cart-shiping-btn continure-btn">
                                    <Link className="btn btn-link" to="/shop">
                                        <i className="fa fa-angle-left"></i> Back To Shop
                                    </Link>
                                </div>

                            </div>
                        </div>

                        <div className="col-lg-4"/>
                    </div>

                    <div className="row">
                        <div className="col-md-6 col-lg-4">
                            <div className="cart-calculate-discount-wrap mb-40">
                                <h4>Calculate shipping</h4>
                                <div className="calculate-discount-content">
                                    <div className="select-style">
                                        <select className="select-active" defaultValue="Bangladesh">
                                            <option>Bangladesh</option>
                                            <option>Bahrain</option>
                                            <option>Azerbaijan</option>
                                            <option>Barbados</option>
                                        </select>
                                    </div>
                                    <div className="select-style">
                                        <select className="select-active" defaultValue="State / County">
                                            <option>State / County</option>
                                            <option>Bahrain</option>
                                            <option>Azerbaijan</option>
                                            <option>Barbados</option>
                                        </select>
                                    </div>
                                    <div className="input-style">
                                        <input type="text" placeholder="Town / City"/>
                                    </div>
                                    <div className="input-style mb-6">
                                        <input type="text" placeholder="Postcode / ZIP"/>
                                    </div>
                                    <div className="calculate-discount-btn">
                                        <button className="btn btn-link" type="button">
                                            Update
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Coupon Discount */}
                        <div className="col-md-6 col-lg-4">
                            <div className="cart-calculate-discount-wrap mb-40 mt-10 mt-md-0">
                                <h4>Coupon Discount</h4>
                                <div className="calculate-discount-content">
                                    <p>Enter your coupon code if you have one.</p>
                                    <div className="input-style mb-6">
                                        <input type="text" placeholder="Coupon code"/>
                                    </div>
                                    <div className="calculate-discount-btn">
                                        <button className="btn btn-link" type="button">
                                            Apply Coupon
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Grand Total (selected) */}
                        <div className="col-md-12 col-lg-4">
                            <div className="grand-total-wrap mt-10 mt-lg-0">


                                <div className="grand-total-content">
                                    <table className="table mb-3">
                                        <tbody>
                                        <tr>
                                            <th>Cart Subtotal</th>
                                            <td>
                                                <strong>

                                                    {formatCurrency(cart?.totalAmount || 0)}
                                                </strong>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Selected Quantity</th>
                                            <td><strong>{selectedQuantity}</strong></td>
                                        </tr>
                                        </tbody>
                                    </table>

                                    <h3>
                                    </h3>
                                    <div className="shipping-country">
                                        <p>
                                            Selected items:&nbsp;<strong>{selectedItems.length}</strong>
                                        </p>
                                    </div>
                                    <div className="grand-total">
                                        <h4>
                                            Total <span>{formatCurrency(selectedSubtotal)}</span>
                                        </h4>
                                    </div>
                                </div>

                                <div className="grand-total-btn d-flex gap-4">
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={() => toggleAll(true)}
                                        disabled={allChecked}
                                    >
                                        Select all
                                    </button>
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={() => toggleAll(false)}
                                        disabled={selected.size === 0}
                                    >
                                        Clear selection
                                    </button>
                                </div>
                                <div className="grand-total-btn">
                                    <a className="btn btn-link" onClick={handleCheckout}>Proceed to checkout</a>
                                </div>
                                {selected.size === 0 && (
                                    <small className="text-muted d-block mt-2">
                                        Selected items will be sent to checkout.
                                    </small>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
