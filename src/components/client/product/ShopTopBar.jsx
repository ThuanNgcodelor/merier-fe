import React from "react";
import {Link} from "react-router-dom";

const ShopTopBar = () => {
    return (
        <>
            <section className="page-header-area" style={{ backgroundColor: '#f8eefa' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-8">
                            <div className="page-header-content">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="">David-Nguyen</Link></li>
                                </ol>
                                <h2 className="page-header-title">Search Product</h2>
                            </div>
                        </div>
                        <div className="col-sm-4 d-sm-flex justify-content-end align-items-end">
                            <h5 className="showing-pagination-results">Search / Product</h5>
                        </div>
                    </div>
                </div>
            </section>

            <section className="shop-top-bar-area">
                <div className="container">
                    <div className="shop-top-bar">
                        <select className="select-shoing">
                            <option data-display="Trending">Trending</option>
                            <option value="1">Featured</option>
                            <option value="2">Best Selling</option>
                            <option value="5">Price: low to high</option>
                            <option value="6">Price: high to low</option>
                        </select>
                        <div className="select-on-sale d-none d-md-flex">
                            <h5>On Sale :</h5>
                            <select className="select-on-sale-form">
                                <option defaultValue>Yes</option>
                                <option value="1">No</option>
                            </select>
                        </div>
                        <div className="select-on-sale d-none d-md-flex">
                            <h5>On Sale :</h5>
                            <select className="select-on-sale-form">
                                <option defaultValue>Yes</option>
                                <option value="1">No</option>
                            </select>
                        </div>
                    </div>
                </div>
                <h6 className="visually-hidden">Shop Top Bar Area</h6>
            </section>
        </>
    );
};

export default ShopTopBar;