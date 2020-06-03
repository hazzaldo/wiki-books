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

// you can name your mutation if you want (it's optional), like: mutation AddBook($name: String!, $Genre: String!, $authorId: ID)
const ADD_BOOK_MUTATION = gql`
  mutation($name: String!, $genre: String!, $authorId: ID!){
    addBook(name: $name, genre: $genre, authorId: $authorId){
      name
      id
    }
  }
`
const GET_BOOK_QUERY = gql`
  query($id: ID){
    book(id: $id){
      id
      name
      genre
      author{
        id
        name
        age
        books{
          id
          name
          genre
        }
      }
    }
  }
`;

export { GET_ALL_BOOKS_QUERY, GET_ALL_AUTHORS_QUERY, ADD_BOOK_MUTATION, GET_BOOK_QUERY };