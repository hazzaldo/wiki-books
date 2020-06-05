const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const app = express();

//allow cross-origin requests
app.use(cors());

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


app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

const port = 4000;

app.listen(port, () => {
    console.log(`Server started listening on port ${port}`);
});