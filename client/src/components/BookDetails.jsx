import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_BOOK_QUERY } from '../queries/queries';

function BookDetails(props) {

  function isEmpty(value){
    return  value === undefined ||
            value === null ||
            (typeof value === "object" && Object.keys(value).length === 0) ||
            (typeof value === "string" && value.trim().length === 0)
  }
  
  const { loading, error, data } = useQuery(GET_BOOK_QUERY, {
    variables: { id: props.bookId },
    skip: isEmpty(props.bookId)
  });

  function displayBookDetails() {
    if (isEmpty(data)) {
      return <div>No book selected...</div>
    } else {
      if (loading) {
        return <div>Loading book details...</div>
      }
      if (error) {
        return <div>Error: {error.message}</div>
      }
      const { book } = data;
      if (book) {
        return (
          <div>
            <h2>{ book.name } </h2>
            <p>{ book.genre }</p>
            <p>{ book.author.name }</p>
            <p>{ book.author.age }</p>
            <p>Other books written by this author: </p>
            <ul className="other-books">
              {book.author.books.map(book => {
                return <li key={book.id}>Book name: {book.name}. Genre: {book.genre}</li>
              })}
            </ul>
          </div>
        )
      } else {
        return <div>No book selected...</div>
      }
    }
  }
  
  return (
    <div id="book-details">
      <h1>Book details</h1>
        {displayBookDetails()}
    </div>
  );
}

export default BookDetails;