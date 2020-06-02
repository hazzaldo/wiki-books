import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_ALL_BOOKS_QUERY } from '../queries/queries';
import BookDetails from './BookDetails'

function BookDirectory() {
  const [ selectedBookId, setSelectedBookId ] = useState("");
  const { loading, error, data } = useQuery(GET_ALL_BOOKS_QUERY);

  function selectBook(bookId) {
    setSelectedBookId(bookId);
  }

  function displayBooks() {
    if (loading) return ('Loading books...');
    if (error) return (`Error: ${error.message}`);
    return data.books.map(book => {
      return (
      // You can alternatively pass the Hook State Setter directly to onClick and pass the book.id inside of it like so: onClick={(e) => {setSelectedBookId(book.id)} 
      <li onClick={selectBook.bind(null, book.id)} key={book.id}>{book.name}</li>
    )});
  }
  
  return (
    <div>
        <ul id="book-directory">
            {displayBooks()}
        </ul>
        <BookDetails bookId={selectedBookId} />
    </div>
  );
}

export default BookDirectory;