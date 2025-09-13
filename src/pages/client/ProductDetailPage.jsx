import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/client/Header.jsx";
import CommentsBox from "../../components/client/product/CommentsBox.jsx";
import { fetchProductById, fetchProductImageById, fetchAddToCart } from "../../api/product.js";
import { getCart } from "../../api/user.js";
import { useCart } from "../../contexts/CartContext.jsx";
import imgFallback from "../../assets/images/shop/6.png";

const USE_OBJECT_URL = true;

const arrayBufferToDataUrl = (buffer, contentType) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  const base64 = btoa(binary);
  return `data:${contentType};base64,${base64}`;
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [imgUrl, setImgUrl] = useState(null);
  const createdUrlsRef = useRef([]);
  const [error, setError] = useState(null);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        const res = await fetchProductById(id);
        const p = res.data;
        setProduct(p);

        if (p?.imageId) {
          try {
            const imgRes = await fetchProductImageById(p.imageId);
            const contentType = imgRes.headers["content-type"] || "image/jpeg";
            let url;
            if (USE_OBJECT_URL && imgRes.data) {
              const blob = new Blob([imgRes.data], { type: contentType });
              url = URL.createObjectURL(blob);
              createdUrlsRef.current.push(url);
            } else {
              url = arrayBufferToDataUrl(imgRes.data, contentType);
            }
            setImgUrl(url);
          } catch (e) {
            setImgUrl(null);
          }
        }
      } catch (e) {
        setError(e?.response?.data?.message || e.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => {
      if (USE_OBJECT_URL && createdUrlsRef.current.length) {
        createdUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
        createdUrlsRef.current = [];
      }
    };
  }, [id]);

  const priceDisplay = useMemo(() => {
    if (!product) return "";
    const { price, originalPrice, discountPercent } = product;
    if (discountPercent && discountPercent > 0 && originalPrice && originalPrice > price) {
      return (
        <div className="d-flex align-items-center gap-2">
          <span className="fs-4 fw-bold">
            {price.toLocaleString("vi-VN")} ₫
          </span>
          <span className="text-decoration-line-through text-muted">
            {originalPrice.toLocaleString("vi-VN")} ₫
          </span>
          <span className="badge bg-danger">-{discountPercent}%</span>
        </div>
      );
    }
    return (
      <span className="fs-4 fw-bold">
        {(product.price || 0).toLocaleString("vi-VN")} ₫
      </span>
    );
  }, [product]);

  const onAddToCart = async () => {
    if (!product) return;
    try {
      setPosting(true);
      await fetchAddToCart({ productId: product.id, quantity: Number(qty) || 1 });
      const cart = await getCart();
      setCart(cart);
      // Optional toast could be added here
    } catch (e) {
      if (e?.response?.status === 403) {
        setError("You need to sign in to add items to the cart.");
      } else {
        setError(e?.response?.data?.message || e.message || "Failed to add to cart");
      }
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="wrapper">
      <Header />
      <main className="main-content">
        <div className="container py-4">
          {loading && <p>Loading product...</p>}
          {error && <div className="alert alert-danger">{error}</div>}
          {product && (
            <div className="row">
              <div className="col-md-6">
                <div className="border rounded p-2 d-flex justify-content-center align-items-center" style={{ minHeight: 320 }}>
                  <img
                    src={imgUrl || imgFallback}
                    onError={(e) => (e.currentTarget.src = imgFallback)}
                    alt={product.name}
                    style={{ maxWidth: "100%", maxHeight: 420, objectFit: "contain" }}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <h2 className="mb-4">{product.name}</h2>
                <div className="mb-4">{priceDisplay}</div>
                <div className="mb-4 ">
                  <span className="badge bg-light text-dark">Stock: {product.stock ?? "-"}</span>
                  {product.status && <span className="badge bg-info ms-2">{product.status}</span>}
                  {product.category?.name && <span className="badge bg-secondary ms-2">{product.category.name}</span>}
                </div>
                <p className="text-muted">{product.description || ""}</p>

                <div className="d-flex align-items-center gap-2 my-3">
                  <input
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="form-control"
                    style={{ maxWidth: 120 }}
                  />
                  <button disabled={posting} className="btn btn-primary" onClick={onAddToCart}>
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          )}

          {product && (
            <div className="row mt-4">
              <div className="col-12">
                <CommentsBox productId={product.id} product={product} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
