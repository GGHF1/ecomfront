// frontend/src/pages/ProductListingPage.jsx
import { useQuery } from '@apollo/client';
import { useParams, Link } from 'react-router-dom'; // Add Link
import { GET_PRODUCTS } from '../graphql/queries';
import '../styles/product-card.scss';

function ProductListingPage() {
  const { categoryName = 'all' } = useParams();
  const { loading, error, data } = useQuery(GET_PRODUCTS, {
    variables: { category: categoryName },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="product-listing">
      <h1>{categoryName.toUpperCase()}</h1>
      <div className="product-grid">
        {data.products.map((product) => {
          // Check if prices exists before trying to find
          const prices = product.prices || [];
          const priceItem = prices.find((p) => p?.currency?.label === 'USD') || prices[0];

          return (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="product-card"
              data-testid={`product-${product.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <img
                src={Array.isArray(product.gallery) && product.gallery.length > 0 ? product.gallery[0] : ''}
                alt={product.name}
                className={product.inStock ? '' : 'out-of-stock'}
              />
              {!product.inStock && <span className="out-of-stock-label">Out of Stock</span>}
              <h3>{product.name}</h3>
              {priceItem && (
                <p>
                  {priceItem.currency.symbol}
                  {priceItem.amount.toFixed(2)}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default ProductListingPage;