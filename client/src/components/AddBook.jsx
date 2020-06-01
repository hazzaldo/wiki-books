import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from "apollo-boost";

const GET_ALL_AUTHORS_QUERY = gql`
  {
    authors{
        id
      name
    }
  }
`;

function AddBook() {
  const { loading, error, data } = useQuery(GET_ALL_AUTHORS_QUERY);
  function displayAuthors () {
    if (loading) return (<option disabled>'Loading authors...'</option>);
    if (error) return (`Error: ${error.message}`);
    return data.authors.map(author => {
      return (
      <option key={author.id} value={author.id}>{author.name}</option>
    )});
  }
  
  return (
    <form id="add-book">
        
        <div className="field">
            <label>Book name</label>
            <input type="text" />
        </div>

        <div className="field">
            <label>Genre</label>
            <input type="text" />
        </div>

        <div className="field">
            <label>Author:</label>
            <select>
                <option>Select author</option>
                {displayAuthors()}
            </select>
        </div>

        <button>+</button>
    </form>
  );
}

export default AddBook;