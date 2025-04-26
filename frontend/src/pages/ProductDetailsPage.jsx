import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useContext, useState } from 'react';
import { GET_PRODUCT } from '../graphql/queries';
import CartContext from '../context/CartContext';
import parse from 'html-react-parser';
import '../styles/product-details.scss';

function ProductDetailsPage() {
  const { productId } = useParams();
  const { addToCart } = useContext(CartContext);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState({});

  const { loading, error, data } = useQuery(GET_PRODUCT, {
    variables: { id: productId },
  });

  if (loading) return <div className="container loading">Loading product details...</div>;
  if (error) return <div className="container error">Error: {error.message}</div>;

  const product = data.product;

  const prices = product.prices || [];
  const priceItem = prices.find((p) => p?.currency?.label === 'USD') || prices[0];

  const handleAttributeSelect = (attributeSetName, attributeValue) => {
    setSelectedAttributes({
      ...selectedAttributes,
      [attributeSetName]: attributeValue,
    });
  };

  const handleAddToCart = () => {
    addToCart(product, selectedAttributes);
    alert('Added to cart!');
  };

  const prevImage = () => {
    setSelectedImage((prev) => 
      prev === 0 ? product.gallery.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setSelectedImage((prev) => 
      prev === product.gallery.length - 1 ? 0 : prev + 1
    );
  };

  // check if all required attributes are selected
  const requiredAttributeSets = product.attributeSets || [];
  const allSelected = requiredAttributeSets.every(
    (set) => selectedAttributes[set.name] !== undefined
  );

  const canAddToCart = product.inStock && (requiredAttributeSets.length === 0 || allSelected);

  return (
    <div className="container">
      <div className="product-details">
        <div className="product-gallery" data-testid="product-gallery">
          <div className="thumbnail-list">
            {product.gallery.map((image, index) => (
              <div
                key={index}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={image} alt={`${product.name} ${index + 1}`} />
              </div>
            ))}
          </div>
          <div className="main-image">
            <img
              src={product.gallery[selectedImage]}
              alt={product.name}
              className={product.inStock ? '' : 'out-of-stock'}
            />
            {!product.inStock && <div className="out-of-stock-overlay">OUT OF STOCK</div>}
        
            {product.gallery.length > 1 && (
              <>
                <button className="gallery-nav prev" onClick={prevImage}>
                  ‹
                </button>
                <button className="gallery-nav next" onClick={nextImage}>
                  ›
                </button>
              </>
            )}
          </div>
        </div>

        <div className="product-info">
          <h1 className="product-name">{product.name}</h1>
          <h2 className="product-brand">{product.brand}</h2>

          {(product.attributeSets || []).map((attributeSet) => (
            <div
              key={attributeSet.id}
              className="attribute-set"
              data-testid={`product-attribute-${attributeSet.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <h3>{attributeSet.name.toUpperCase()}:</h3>
              <div className="attribute-options">
                {attributeSet.attributes.map((attribute) => {
                  const isSelected = selectedAttributes[attributeSet.name] === attribute.value;
                  const kebabName = attributeSet.name.toLowerCase().replace(/\s+/g, '-');
                  const kebabValue = attribute.display_value.toLowerCase().replace(/\s+/g, '-');

                  if (attributeSet.type === 'swatch') {
                    return (
                      <div
                        key={attribute.id}
                        className={`color-swatch ${isSelected ? 'selected' : ''}`}
                        style={{ backgroundColor: attribute.value }}
                        onClick={() => handleAttributeSelect(attributeSet.name, attribute.value)}
                        title={attribute.display_value}
                        data-testid={`product-attribute-${kebabName}-${kebabValue}${
                          isSelected ? '-selected' : ''
                        }`}
                      >
                        {isSelected && <span className="check-mark">✓</span>}
                      </div>
                    );
                  } else {
                    return (
                      <button
                        key={attribute.id}
                        className={`attribute-button ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleAttributeSelect(attributeSet.name, attribute.value)}
                        data-testid={`product-attribute-${kebabName}-${kebabValue}${
                          isSelected ? '-selected' : ''
                        }`}
                      >
                        {attribute.display_value}
                      </button>
                    );
                  }
                })}
              </div>
            </div>
          ))}

          <div className="price-section">
            <h3>PRICE:</h3>
            <p className="price">
              {priceItem
                ? `${priceItem.currency.symbol}${priceItem.amount.toFixed(2)}`
                : 'Price unavailable'}
            </p>
          </div>

          <button
            className="add-to-cart-button"
            disabled={!canAddToCart}
            onClick={handleAddToCart}
            data-testid="add-to-cart"
          >
            {product.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
          </button>

          <div className="product-description" data-testid="product-description">
            {parse(product.description || '')}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;