const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');


//Define schema. Schema file has 3 responsibilities:
// 1. Define the Object Type
// 2. Define relationship between Types
// 3. Define Root Queries: these are the allowed entry points into the Graph for queries from the client. It's how we describe that a user can initially jump into the Graph and grab data.
const {
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const BookType = new GraphQLObjectType({
    name: 'Book',
    //we need 'fields' to be a function that returns an object with its properties, rather than an object. Because as function it will not execute fields straightaway and then run into an error because it does not recognise the connected AuthorType object to this BookType (as AuthorType is defined further below). Defining it as a function means it will execute only then whole file is compiled. Kind of like a call back.
    fields: () => ({
        //type GraphQLID is a special type that can accepts the ID both either as a string or number when queries from the client end. So it's better than setting it as string type.
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        // relationship between Book and Author object
        author: {
            type: AuthorType,
            // resolve will be used to retrieve the author object of the book queries
            resolve(parent, args) {
                    // this time it's 'parent' rather than 'args' to pass to resolve
                    // because we need to reference the parent object of the author, which is Book
                    // so the Book parent object will have the authorId that we can pass to find the author of the book 
                return Author.findById(parent.authorId, (err, foundAuthor) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`Found Author ${foundAuthor.name} successfully`);
                        return foundAuthor;
                    }
                });
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        //type GraphQLID is a special type that can accepts the ID both either as a string or number when queries from the client end. So it's better than setting it as string type.
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            // an author's relationship with book is One-to-Many. So one author will be associated with many books
            // therefore we use a new type for 'books' field here - 'new GraphQLList(BookType)'
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                    // this time we use 'filter' instead of 'find' method, to filter and return only the books with this author id 
                    // 'parent.id' here is the author id.
                    // find() method used to retrieve many documents based on a criteria
                return Book.find({authorId: parent.id}, (err, foundBooks) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`Found all books for author ${parent.name}`);
                        return foundBooks;
                    }
                });
            }
        }
    })
});

// Define Root Queries
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    // each of the fields will be a RootQuery type. 
    // These fields are what the client will be able to query. The name of each field is how the client has to specify it, when making the query to fetch data.
    fields: {
        book: {
            type: BookType,
            // what argument we need to pass to the 'book' object when querying it. 
            // We can use 'id' field - hence query from client side will be 'book(id: '123')'
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                    // code where we get data from DB and other sources 
                    // 'parent' argument comes into play when we look at relationship between data
                    // 'args' argument is where we pass the 'id' argument to retrieve book based on the 'id' passed.
                    // we use 'lodash' find() method to find a book from book array. Args: 1st (the array), 2nd (the id)
                return Book.findById(args.id, (err, foundBook) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`Found book ${foundBook.name} successfully`);
                        return foundBook;
                    }
                });
            }
        },
        author: {
            type: AuthorType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Author.findById(args.id, (err, foundAuthor) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`Found author ${foundAuthor.name} successfully`);
                        return foundAuthor;
                    }
                });
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find({}, (err, allBooks) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`Found and returned all books successfully`);
                        return allBooks;
                    }
                });
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return Author.find({}, (err, allAuthors) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`Found and returned all authors successfully`);
                        return allAuthors;
                    }
                });
            }
        }
    }
});



// Define what data can be mutated (created, updated, replaced, deleted)
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args) {
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                // save() method will return the object (document) that we save on MongoDB. So all we need to do is return the 'author.save()' in order to return the Author object saved.
                // we need to return the saved object because make the mutation call 'addAuthor' and we want the object returned and displayed after we make the mutation query, then we need to return it here when we save it
                return author.save()
                .then(author => { 
                    console.log(`created author ${author.name} object successfully`);
                    return author;
                })
                .catch(err => console.log(err));
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                genre: {type: new GraphQLNonNull(GraphQLString)},
                authorId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save()
                .then(book => { 
                    console.log(`created book ${book.name} object successfully`);
                    return book;
                })
                .catch(err => console.log(err));
            }
        }
    }
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});