import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import App from './App.jsx';
import './styles/main.scss';

// Error handling
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
    });
  }
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

// Apollo Client setup
const client = new ApolloClient({
  link: errorLink.concat(new HttpLink({ 
    uri: 'https://ecomback-production.up.railway.app/graphql',
    headers: {
      'Content-Type': 'application/json',
    }
  })),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
});

// For debugging
window.apolloClient = client;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
);