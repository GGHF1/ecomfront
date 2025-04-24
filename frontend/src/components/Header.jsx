import { useQuery } from '@apollo/client';
import { NavLink, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';  // Add useState import
import { GET_CATEGORIES } from '../graphql/queries';
import CartContext from '../context/CartContext';
import CartOverlay from './CartOverlay';  // Import CartOverlay component
import '../styles/header.scss';

function Header() {
  const { cart } = useContext(CartContext);
  const { loading, error, data } = useQuery(GET_CATEGORIES);
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);  // Add state for cart toggle

  if (loading) return null;
  if (error) return null;

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Toggle cart overlay
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <header>
      <nav>
        {data.categories.map((category) => (
          <NavLink
            key={category.id}
            to={`/category/${category.name}`}
            data-testid={
              location.pathname === `/category/${category.name}` ||
              (category.name === 'all' && location.pathname === '/')
                ? 'active-category-link'
                : 'category-link'
            }
          >
            {category.name.toUpperCase()}
          </NavLink>
        ))}
      </nav>
      
      <button 
        data-testid="cart-btn" 
        onClick={toggleCart}
      >
        Cart {itemCount > 0 && <span>{itemCount}</span>}
      </button>
      
      {isCartOpen && <CartOverlay onClose={toggleCart} />}
    </header>
  );
}

export default Header;