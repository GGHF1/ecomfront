import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import './styles/main.scss';
import NotFound from './pages/NotFound';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<ProductListingPage />} />
          <Route path="/:categoryName" element={<ProductListingPage />} />
          <Route path="/product/:productId" element={<ProductDetailsPage />} />
           <Route path="*" element={<NotFound />} /> {}
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;