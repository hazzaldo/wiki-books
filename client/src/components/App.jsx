import React from 'react';


// components
import BookDirectory from './BookDirectory';
import AddBook from './AddBook';

function App() {
  return(
    <div id="main">
      <h1>Wiki Books</h1>
      <BookDirectory />
      <AddBook />
    </div>
  );
}

export default App;