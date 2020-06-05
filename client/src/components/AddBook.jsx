import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_ALL_AUTHORS_QUERY, ADD_BOOK_MUTATION, GET_ALL_BOOKS_QUERY } from '../queries/queries';

function AddBook() {
    const { loading, error, data } = useQuery(GET_ALL_AUTHORS_QUERY);
    // to call more than one query using the useQuery, call useQuery hook but give alias names to loading, error, data to avoid queries overwriting each other's returned fields
    // const { loading: loadingAddBook, error: errorAddBook, data: dataAddBook} = useQuery(A_SECOND_QUERY)
    const [ addBook ] = useMutation(ADD_BOOK_MUTATION);

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
        const filledAuthorId = bookEntry.authorId? bookEntry.authorId : data.authors[0].id;
        addBook({ variables: { 
                name: bookEntry.name,
                genre: bookEntry.genre,
                authorId: filledAuthorId
            }, 
            refetchQueries: [{ query: GET_ALL_BOOKS_QUERY }]
        })
        .then(data => {
            setBookEntry(prevValue => ({
                ...prevValue,
                name: "",
                genre: ""
            }));
        })
        .catch(err => console.log(err));
        event.preventDefault();
    } 

    function displayAuthors() {
        if (loading) return (<option disabled>'Loading authors...'</option>);
        if (error) return (`Error: ${error.message}`);
        return data.authors.map((author) => {
            return (
                <option key={author.id} value={author.id}>{author.name}</option>
            );
        });
    }
  
    return (
        <form id="add-book" onSubmit={submitBook}>
            <h1>Add a new book to Wiki Books</h1>
            <div className="field">
                <label>Book name: </label>
                <input type="text" onChange={handleChange} name="name" required value={bookEntry.name}/>
            </div>

            <div className="field">
                <label>Genre: </label>
                <input type="text" onChange={handleChange} name="genre" required value={bookEntry.genre}/>
            </div>

            <div className="field">
                <label>Author (select author): </label>
                <select onChange={handleChange} name="authorId">
                    {displayAuthors()}
                </select>
            </div>

            <button type="submit">+</button>
        </form>
    );
}

export default AddBook;