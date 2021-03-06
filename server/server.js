const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const path = require('path');

const {typeDefs, resolvers} = require('./schemas');
const {authMiddleware} = require('./utils/auth');
const db = require('./config/connection');


require('dotenv').config({
  path: path.resolve('.env'),
});

const PORT = process.env.PORT || 4444;


const app = express();
const server = new ApolloServer({ 
  typeDefs, 
  resolvers, 
  context: authMiddleware 
});

server.applyMiddleware({ app, path: '/graphql' });


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve up static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build'));
// });
app.set('port', PORT);
console.log(PORT);

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});