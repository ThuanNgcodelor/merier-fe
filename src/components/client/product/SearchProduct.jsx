import React, { useEffect, useMemo, useRef, useState } from "react";
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

// If not using object URL, convert arraybuffer -> data URL
const arrayBufferToDataUrl = (buffer, contentType) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  const base64 = btoa(binary);
  return `data:${contentType || "image/png"};base64,${base64}`;
};

const PAGE_SIZE = 6;

const SearchProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState({});
  const { setCart } = useCart();

  // Modal
  const [modalInfo, setModalInfo] = useState({
    isOpen: false,
    message: "",
    product: null,
  });

  // Search & Pagination
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);

  // Filters & Sort state (funnel)
  const [category, setCategory] = useState("ALL");
  const [status, setStatus] = useState("ALL"); // in_stock / out_of_stock / ALL
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sortKey, setSortKey] = useState("relevance"); // relevance | price_asc | price_desc | name_asc | name_desc

  // Show/hide filter panel
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Track created object URLs to revoke
  const createdUrlsRef = useRef([]);

  // Load all products (client-side filter + paginate)
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetchProducts();
        const list = Array.isArray(res?.data) ? res.data : res?.data?.content || [];
        setProducts(list);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Reset to page 1 when filters/search change
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, category, status, onlyDiscounted, priceMin, priceMax, sortKey]);

  // Helpers: get category text from product
  const categoryOf = (p) =>
    p?.category?.name ||
    p?.categoryName ||
    p?.category?.title ||
    p?.category_id ||
    p?.categoryId ||
    "Uncategorized";

  // Build options from data
  const categoryOptions = useMemo(() => {
    const set = new Set();
    products.forEach((p) => set.add(categoryOf(p)));
    return ["ALL", ...Array.from(set)];
  }, [products]);

  const statusOptions = useMemo(() => {
    const set = new Set();
    products.forEach((p) => p?.status && set.add(String(p.status)));
    const arr = Array.from(set);
    return ["ALL", ...arr];
  }, [products]);

  // 1) Base filter by search
  const filteredBySearch = useMemo(() => {
    if (!debouncedQuery) return products;
    const q = debouncedQuery.toLowerCase();
    return products.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const desc = (p.description || "").toLowerCase();
      return name.includes(q) || desc.includes(q);
    });
  }, [products, debouncedQuery]);

  // 2) Apply filters
  const filtered = useMemo(() => {
    let arr = filteredBySearch;

    if (category !== "ALL") {
      arr = arr.filter((p) => categoryOf(p) === category);
    }

    if (status !== "ALL") {
      arr = arr.filter((p) => String(p.status) === status);
    }

    if (onlyDiscounted) {
      arr = arr.filter((p) => {
        const price = Number(p.price || 0);
        const original = Number(p.originalPrice || p.original_price || price);
        return original > price;
      });
    }

    const min = priceMin === "" ? -Infinity : Number(priceMin);
    const max = priceMax === "" ? Infinity : Number(priceMax);
    if (!(isNaN(min) && isNaN(max))) {
      arr = arr.filter((p) => {
        const price = Number(p.price || 0);
        return (isNaN(min) ? true : price >= min) && (isNaN(max) ? true : price <= max);
      });
    }

    const sorted = [...arr];
    if (sortKey === "price_asc") {
      sorted.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sortKey === "price_desc") {
      sorted.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (sortKey === "name_asc") {
      sorted.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortKey === "name_desc") {
      sorted.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    }
    // relevance: keep original order

    return sorted;
  }, [filteredBySearch, category, status, onlyDiscounted, priceMin, priceMax, sortKey]);

  // Pagination
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  // Load images for current page only
  useEffect(() => {
    if (pageItems.length === 0) {
      setImageUrls({});
      return;
    }

    let isActive = true;
    const newUrls = {};
    const tempCreatedUrls = [];

    const loadImages = async () => {
      await Promise.all(
        pageItems.map(async (product) => {
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

      if (USE_OBJECT_URL && createdUrlsRef.current.length) {
        createdUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      }
      createdUrlsRef.current = tempCreatedUrls;

      setImageUrls(newUrls);
    };

    loadImages();

    return () => {
      isActive = false;
      if (USE_OBJECT_URL && createdUrlsRef.current.length) {
        createdUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
        createdUrlsRef.current = [];
      }
    };
  }, [pageItems]);

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
          message: "You must log in to add products.",
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

  const gotoPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFilters = () => {
    setCategory("ALL");
    setStatus("ALL");
    setOnlyDiscounted(false);
    setPriceMin("");
    setPriceMax("");
    setSortKey("relevance");
  };

  // UI helpers for funnel chips
  const activeChips = useMemo(() => {
    const chips = [];
    if (debouncedQuery) chips.push({ k: "q", label: `Search: "${debouncedQuery}"`, clear: () => setQuery("") });
    if (category !== "ALL") chips.push({ k: "cat", label: `Category: ${category}`, clear: () => setCategory("ALL") });
    if (status !== "ALL") chips.push({ k: "st", label: `Status: ${status}`, clear: () => setStatus("ALL") });
    if (onlyDiscounted) chips.push({ k: "disc", label: "Discounted", clear: () => setOnlyDiscounted(false) });
    if (priceMin !== "") chips.push({ k: "min", label: `Min: ${priceMin}`, clear: () => setPriceMin("") });
    if (priceMax !== "") chips.push({ k: "max", label: `Max: ${priceMax}`, clear: () => setPriceMax("") });
    if (sortKey !== "relevance") {
      const map = {
        price_asc: "Price ↑",
        price_desc: "Price ↓",
        name_asc: "Name A→Z",
        name_desc: "Name Z→A",
      };
      chips.push({ k: "sort", label: `Sort: ${map[sortKey] || sortKey}`, clear: () => setSortKey("relevance") });
    }
    return chips;
  }, [debouncedQuery, category, status, onlyDiscounted, priceMin, priceMax, sortKey]);

  if (loading) return <div className="text-center">Loading products...</div>;

  return (
    <section className="product-area section-space">
      <div className="container">
        {/* --- Search & result info --- */}
        <div className="row align-items-center mb-3">
          <div className="col-12 col-lg-5 mb-2 mb-lg-0">
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="col-12 col-lg-7 text-lg-end">
            <span>
              Showing{" "}
              <strong>
                {total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, total)}
              </strong>{" "}
              of <strong>{total}</strong> result(s)
            </span>
          </div>
        </div>

        {/* ====== FILTER FUNNEL: summary chips + collapsible form ====== */}
        <div className="card border-0 shadow-sm mb-3">
          <div className="card-body">
            {/* Action row: toggle & clear */}
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => setFiltersOpen((v) => !v)}
                aria-expanded={filtersOpen}
                aria-controls="filtersCollapse"
              >
                {filtersOpen ? "Hide filters" : "Filters"}
              </button>

              {activeChips.length > 0 && (
                <button className="btn btn-outline-secondary" onClick={resetFilters}>
                  Clear all
                </button>
              )}

              {/* Active chips */}
              <div className="d-flex flex-wrap align-items-center gap-2 ms-auto">
                {activeChips.length === 0 ? (
                  <span className="text-muted small">No filters applied</span>
                ) : (
                  activeChips.map((c) => (
                    <span key={c.k} className="badge bg-light text-dark border">
                      {c.label}{" "}
                      <button
                        type="button"
                        className="btn-close btn-close-white ms-1"
                        aria-label="Clear"
                        onClick={c.clear}
                        style={{ filter: "invert(1)" }}
                      />
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Collapsible filter form */}
            {filtersOpen && (
              <div id="filtersCollapse">
                <div className="row gy-2 gx-3">
                  {/* Category */}
                  <div className="col-12 col-md-3">
                    <label className="form-label small mb-1">Category</label>
                    <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                      {categoryOptions.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div className="col-12 col-md-3">
                    <label className="form-label small mb-1">Status</label>
                    <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price range */}
                  <div className="col-6 col-md-2">
                    <label className="form-label small mb-1">Min Price</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="e.g. 100000"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                    />
                  </div>
                  <div className="col-6 col-md-2">
                    <label className="form-label small mb-1">Max Price</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="e.g. 500000"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                    />
                  </div>

                  {/* Discounted */}
                  <div className="col-12 col-md-2 d-flex align-items-end">
                    <div className="form-check">
                      <input
                        id="onlyDiscounted"
                        className="form-check-input"
                        type="checkbox"
                        checked={onlyDiscounted}
                        onChange={(e) => setOnlyDiscounted(e.target.checked)}
                      />
                      <label htmlFor="onlyDiscounted" className="form-check-label">
                        Only discounted
                      </label>
                    </div>
                  </div>

                  {/* Sort */}
                  <div className="col-12 col-md-3">
                    <label className="form-label small mb-1">Sort by</label>
                    <select className="form-select" value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
                      <option value="relevance">Relevance</option>
                      <option value="price_asc">Price: Low → High</option>
                      <option value="price_desc">Price: High → Low</option>
                      <option value="name_asc">Name: A → Z</option>
                      <option value="name_desc">Name: Z → A</option>
                    </select>
                  </div>

                  {/* Actions */}
                  <div className="col-12 col-md-3 d-flex align-items-end gap-2">
                    <button className="btn btn-outline-secondary w-50" onClick={resetFilters}>
                      Reset
                    </button>
                    <button className="btn btn-success w-50" onClick={() => setFiltersOpen(false)}>
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- Grid --- */}
        <div className="row mb-n6">
          {pageItems.length === 0 && (
            <div className="col-12">
              <div className="alert alert-light border text-center">No products found.</div>
            </div>
          )}

          {pageItems.map((product) => (
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
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <small className="text-muted">{categoryOf(product)}</small>
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
            </div>
          ))}
        </div>

        {/* --- Pagination --- */}
        {totalPages > 1 && (
          <div className="row mt-5">
            <div className="col-12 d-flex justify-content-center">
              <nav>
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => gotoPage(currentPage - 1)}>
                      «
                    </button>
                  </li>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const p = i + 1;
                    const shouldShow = p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1);
                    const isEllipsisBefore = p === currentPage - 2 && p > 1;
                    const isEllipsisAfter = p === currentPage + 2 && p < totalPages;

                    if (isEllipsisBefore || isEllipsisAfter) {
                      return (
                        <li key={`ellipsis-${p}`} className="page-item disabled">
                          <span className="page-link">…</span>
                        </li>
                      );
                    }

                    if (!shouldShow) return null;

                    return (
                      <li key={p} className={`page-item ${p === currentPage ? "active" : ""}`}>
                        <button className="page-link" onClick={() => gotoPage(p)}>
                          {p}
                        </button>
                      </li>
                    );
                  })}

                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => gotoPage(currentPage + 1)}>
                      »
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}
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

export default SearchProduct;
