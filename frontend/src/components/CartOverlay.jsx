import { useContext } from 'react';
import { Link } from 'react-router-dom';
import CartContext from '../context/CartContext';
import '../styles/cart-overlay.scss';

function CartOverlay({ onClose }) {
  const { cart, updateQuantity, toggleCart } = useContext(CartContext);
  
  const handleClose = () => {
    if (onClose) onClose();
    else toggleCart();
  };
  
  // total price
  const totalPrice = cart.reduce((total, itemData, index) => {
    const { product, quantity } = itemData;
    const priceItem = product.prices.find((p) => p?.currency?.label === 'USD') || 
                     (product.prices.length > 0 ? product.prices[0] : null);
    
    return total + (priceItem ? priceItem.amount * quantity : 0);
  }, 0);

  return (
    <div className="cart-overlay-container" data-testid="cart-overlay">
      <div className="cart-overlay-backdrop" onClick={onClose}>
      </div>
      <div className="cart-overlay">
        <h3 className="cart-title">
          <span className="my-bag">My Bag,</span> {cart.reduce((total, item) => total + item.quantity, 0)} items
        </h3>
        
        {cart.length === 0 ? (
          <p className="empty-cart-message">Your shopping bag is empty</p>
        ) : (
          <div className="cart-items" data-testid="cart-items">
            {cart.map((itemData, index) => {
              const { product, selectedOptions, quantity } = itemData;
              const priceItem = product.prices.find((p) => p?.currency?.label === 'USD') || 
                               (product.prices.length > 0 ? product.prices[0] : null);
              
              return (
                <div key={index} className="cart-item" data-testid={`cart-item-${index}`}>
                  <div className="cart-item-details">
                    <h4 className="cart-item-brand" data-testid={`cart-item-brand-${index}`}>{product.brand}</h4>
                    <h4 className="cart-item-name" data-testid={`cart-item-name-${index}`}>{product.name}</h4>
                    
                    <div className="cart-item-price" data-testid={`cart-item-price-${index}`}>
                      {priceItem && (
                        <p>
                          {priceItem.currency.symbol}{priceItem.amount.toFixed(2)}
                        </p>
                      )}
                    </div>
                    
                    {Object.entries(selectedOptions).map(([attrName, attrValue]) => {
                      const attributeSet = product.attributeSets.find(set => set.name === attrName);
                      if (!attributeSet) return null;
                      
                      const attribute = attributeSet.attributes.find(attr => attr.value === attrValue);
                      if (!attribute) return null;
                      
                      const kebabName = attrName.toLowerCase().replace(/\s+/g, '-');
                      // Use raw value instead of display_value
                      const rawValue = attribute.value;
                      
                      return (
                        <div 
                          key={attrName} 
                          className="cart-item-attribute"
                          data-testid={`cart-item-attribute-${kebabName}`}
                        >
                          <h5>{attrName}:</h5>
                          <div className="attribute-value-container">
                            {attributeSet.type === 'swatch' ? (
                              <div
                                className="color-swatch selected"
                                style={{ backgroundColor: attrValue }}
                                data-testid={`cart-item-attribute-${kebabName}-${rawValue}-selected`}
                              />
                            ) : (
                              <div
                                className="attribute-value selected"
                                data-testid={`cart-item-attribute-${kebabName}-${rawValue}-selected`}
                              >
                                {attribute.display_value}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="cart-item-quantity" data-testid={`cart-item-quantity-${index}`}>
                    <button 
                      className="quantity-btn increase"
                      onClick={() => updateQuantity(index, 1)}
                      data-testid="cart-item-amount-increase"
                    >
                      +
                    </button>
                    <span 
                      className="quantity-value"
                      data-testid="cart-item-amount"
                    >
                      {quantity}
                    </span>
                    <button 
                      className="quantity-btn decrease"
                      onClick={() => updateQuantity(index, -1)}
                      data-testid="cart-item-amount-decrease"
                    >
                      -
                    </button>
                  </div>
                  
                  <div className="cart-item-image" data-testid={`cart-item-image-${index}`}>
                    <img src={product.gallery[0]} alt={product.name} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="cart-footer">
          <div className="cart-total" data-testid="cart-total">
            <span className="total-label">Total</span>
            <span className="total-amount" data-testid="cart-total-amount">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
          
          <div className="cart-actions">
            <Link to="/cart" className="view-bag-btn" data-testid="view-bag-button" onClick={onClose}>
              View Bag
            </Link>
            <button className="checkout-btn" data-testid="checkout-button">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartOverlay;