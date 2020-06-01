import React from 'react';
import ApolloClient from 'apollo-boost';
import ApolloProvider from '@apollo/react-hooks';

// components
import BookDirectory from './BookDirectory';

// Apollo client setup 
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
});

function App() {
  return(
    <ApolloProvider client={client}>
      <div id="main">
        <h1>Wiki Books</h1>
        <BookDirectory />
      </div>
    </ApolloProvider>
  );
}

export default App;
