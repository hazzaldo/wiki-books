import { gql } from "apollo-boost";

const GET_ALL_BOOKS_QUERY = gql`
  {
    books{
      id
      name
      genre
    }
  }
`;

const GET_ALL_AUTHORS_QUERY = gql`
  {
    authors{
        id
      name
    }
  }
`;

export { GET_ALL_BOOKS_QUERY, GET_ALL_AUTHORS_QUERY };