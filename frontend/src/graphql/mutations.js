import { gql } from '@apollo/client';

export const PLACE_ORDER = gql`
  mutation PlaceOrder(
    $products: [String!]!
    $quantities: [Int!]!
    $attributes: [[String!]]
    $totalPrice: Float!
  ) {
    createOrder(
      products: $products
      quantities: $quantities
      attributes: $attributes
      totalPrice: $totalPrice
    )
  }
`;