import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_ALL_AUTHORS_QUERY } from '../queries/queries';

function AddBook() {
    const { loading, error, data } = useQuery(GET_ALL_AUTHORS_QUERY);

    const [bookEntry, setBookEntry] = useState({
        name: "",
        genre: "",
        authorId: ""
    });

    function handleChange(event) {
        const { name, value } = event.target;

        setBookEntry(preValue => {
            return {
                ...preValue,
                [name]: value
            }
        });
    }

    function submitBook(event) {
        console.log(`Book Entry: ${JSON.stringify(bookEntry)}`);
        event.preventDefault();
    }

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
                <input type="text" onChange={handleChange} name="name" value={bookEntry.name}/>
            </div>

            <div className="field">
                <label>Genre</label>
                <input type="text" onChange={handleChange} name="genre" value={bookEntry.genre}/>
            </div>

            <div className="field">
                <label>Author:</label>
                <select onChange={handleChange} name="authorId">
                    <option>Select author</option>
                    {displayAuthors()}
                </select>
            </div>

            <button onClick={submitBook}>+</button>
        </form>
    );
}

export default AddBook;