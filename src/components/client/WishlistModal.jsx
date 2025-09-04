import React, { useEffect } from "react";
import { createPortal } from "react-dom";

export default function WishlistModal({ isOpen, onClose, product, message }) {
    useEffect(() => {
        if (!isOpen) return;
        document.body.classList.add("modal-open");
        return () => document.body.classList.remove("modal-open");
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <>
            <div
                className="modal fade show"
                role="dialog"
                aria-modal="true"
                aria-hidden="false"
                style={{ display: "block", position: "fixed", inset: 0, zIndex: 1055 }}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="bg-danger position-relative" style={{ height: "40px" }}>
                            <i
                                className="fa fa-times position-absolute top-50 start-50 translate-middle"
                                style={{ color: "white", fontSize: "18px", cursor: "pointer" }}
                                onClick={onClose}
                                aria-hidden="true"
                            ></i>
                        </div>
                        <div className="modal-body">
                            <div className="product-action-view-content text-center">
                                <div className="modal-action-messages mb-3">
                                    <i className="fa fa-check-square-o me-2" aria-hidden="true"/>
                                    <span>{message || "Added successfully"}</span>
                                </div>

                                {product && (
                                    <>
                                        <div
                                            className="rounded"
                                            style={{background: "#f6f3f6", padding: 20}}
                                        >
                                            <img
                                                src={product.imageSrc}
                                                alt={product.imageAlt || product.name}
                                                style={{maxWidth: "100%", height: "auto"}}
                                            />
                                        </div>
                                        <h4 className="product-name mt-3 mb-0" style={{letterSpacing: 1}}>
                                            <a href={product.href || "#"} className="text-dark text-decoration-none">
                                                {product.name}
                                            </a>
                                        </h4>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="modal-backdrop fade show"
                style={{ position: "fixed", inset: 0, zIndex: 1050 }}
                onClick={onClose}
            />
        </>,
        document.body
    );
}
