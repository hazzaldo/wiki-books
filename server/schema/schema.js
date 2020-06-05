const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');

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
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
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
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
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
    fields: {
        book: {
            type: BookType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
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