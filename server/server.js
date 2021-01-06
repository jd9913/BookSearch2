const express = require('express');
const path = require('path');

require('dotenv').config({ path: '/variables.env'})

//imports ApolloServer
const { ApolloServer }=require('apollo-server-express');

const { authMiddleware }=require('./utils/auth');


//import typeDefs and resolvers
const { typeDefs, resolvers }=require('./schemas');
const db = require('./config/connection');



const PORT = process.env.PORT || 3301;

const app = express();

//create new Apollo server and pass in schema data

const server=new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

//integrate Apollo server with Express application as middleware
server.applyMiddleware({ app });


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    // log where we can go to test our GQL API
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
