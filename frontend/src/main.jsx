import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import App from './App.jsx';
import './styles/main.scss';

const client = new ApolloClient({
  uri: 'http://ecom-test-web.infinityfreeapp.com/graphql', // Add /graphql to match your route
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);