import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_ALL_BOOKS_QUERY } from '../queries/queries';

function BookDirectory() {
  const { loading, error, data } = useQuery(GET_ALL_BOOKS_QUERY);
  function displayBooks () {
    if (loading) return ('Loading books...');
    if (error) return (`Error: ${error.message}`);
    return data.books.map(book => {
      return (
      <li key={book.id}>{book.name}</li>
    )});
  }
  
  return (
    <div>
        <ul id="book-directory">
            {displayBooks()}
        </ul>
    </div>
  );
}

export default BookDirectory;