import React from "react";

export function CheckoutSection({
  cart,
  addresses,
  selectedAddressId,
  addressLoading,
  selectedItems,
  selectedQuantity,
  selectedSubtotal,
  selected,
  allChecked,
  orderLoading,
  formatCurrency,
  onToggleAll,
  onOpenAddressModal,
  onRefreshAddresses,
  onCheckout,
  navigate
}) {
  return (
    <div className="row">
      <div className="address-selection col-md-12 col-lg-6 mb-3">
        <h5>
          Delivery Address{" "}
          {addressLoading && (
            <small className="text-muted">(Loading...)</small>
          )}
        </h5>

        {addressLoading ? (
          <div className="selected-address p-3 border rounded bg-light">
            <p className="text-muted mb-0">Loading addresses...</p>
          </div>
        ) : addresses.length > 0 ? (
          <>
            <div className="selected-address p-3 border rounded">
              {selectedAddressId ? (
                (() => {
                  const selectedAddr = addresses.find(
                    (a) => a.id === selectedAddressId
                  );
                  return selectedAddr ? (
                    <div>
                      <strong>{selectedAddr.recipientName}</strong>
                      <p className="mb-1">{selectedAddr.streetAddress}</p>
                      <p className="mb-1">{selectedAddr.province}</p>
                      <p className="mb-0">
                        Phone: {selectedAddr.recipientPhone}
                      </p>
                      {selectedAddr.isDefault && (
                        <span className="badge bg-primary">Default</span>
                      )}
                    </div>
                  ) : null;
                })()
              ) : (
                <p className="text-muted">No address selected</p>
              )}
            </div>
            <div className="d-flex gap-2 mt-2">
              <button
                className="btn btn-outline-primary btn-sm"
                type="button"
                onClick={onOpenAddressModal}
              >
                {selectedAddressId
                  ? "Change Address"
                  : "Select Address"}
              </button>
              <button
                className="btn btn-outline-secondary btn-sm"
                type="button"
                onClick={onRefreshAddresses}
                disabled={addressLoading}
                title="Refresh addresses"
              >
                <i
                  className={`fa fa-refresh ${
                    addressLoading ? "fa-spin" : ""
                  }`}
                ></i>
              </button>
            </div>
          </>
        ) : (
          <div className="selected-address p-3 border rounded bg-light">
            <p className="text-muted mb-2">
              No addresses found. Please add an address to continue.
            </p>
            <div className="d-flex gap-2">
              <button
                className="btn btn-primary btn-sm"
                type="button"
                onClick={() => navigate("/information/address")}
              >
                Add Address
              </button>
              <button
                className="btn btn-outline-secondary btn-sm"
                type="button"
                onClick={onRefreshAddresses}
                disabled={addressLoading}
                title="Refresh addresses"
              >
                <i
                  className={`fa fa-refresh ${
                    addressLoading ? "fa-spin" : ""
                  }`}
                ></i>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="col-md-12 col-lg-6">
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
                  <td>
                    <strong>{selectedQuantity}</strong>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="shipping-country">
              <p>
                Selected items:&nbsp;
                <strong>{selectedItems.length}</strong>
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
              onClick={() => onToggleAll(true)}
              disabled={allChecked}
            >
              Select all
            </button>
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => onToggleAll(false)}
              disabled={selected.size === 0}
            >
              Clear selection
            </button>
          </div>

          <div className="grand-total-btn">
            <button
              className="btn btn-link"
              type="button"
              onClick={onCheckout}
              disabled={orderLoading || selected.size === 0}
              title={
                selected.size === 0
                  ? "Please select at least one item"
                  : !selectedAddressId
                  ? "Please select a delivery address"
                  : ""
              }
            >
              {orderLoading
                ? "Creating Order..."
                : "Proceed to checkout"}
            </button>
          </div>

          {selected.size === 0 && (
            <small className="text-muted d-block mt-2">
              Selected items will be sent to checkout.
            </small>
          )}
        </div>
      </div>
    </div>
  );
}

