const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// connect to MongoDB database
mongoose.connect(process.env.MONGODB_DATABASE_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
    (err) => {
        try {
            console.log(`Server connected successfully to MongoDB`);
        } catch (err) {
            console.log(err);
        }
    }
);


// In this middleware: Express doesn't understand GraphQL, but it will pass all API calls to '/graphql' end point to 'express-graphql', which allows Express to work with GraphQL and process API calls 
app.use('/graphql', graphqlHTTP({
    //graphqlHTTP takes options:
    // First we need to tell graphqlHTTP function the Schema of our data structure (for GraphQL)
    // we can shorten the code below to just 'schema' rather than 'schema: schema' because the key and value are the same. It's an ES6 feature
    schema: schema,
    // we want to use the GraphiQL tool when we hit the '/graphql' end point
    graphiql: true
}));

const port = 4000;

app.listen(port, () => {
    console.log(`Server started listening on port ${port}`);
});