import { gql } from '@apollo/client';

export const GET_CATEGORIES = gql`
  query {
    categories {
      id
      name
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      inStock
      category
      prices {
        amount
        currency {
          label
          symbol
        }
      }
      gallery
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: String!) {
    product(id: $id) {
      id
      name
      inStock
      description
      category
      brand
      gallery
      prices {
        id
        amount
        currency {
          label
          symbol
        }
      }
      attributeSets {
        id
        name
        type
        type_name
        attributes {
          id
          attribute_set_id
          display_value
          value
          item_id
          type_name
        }
      }
    }
  }
`;