// server.js
// where your node app starts

// init project
const _ = require("lodash");
const express = require('express');
const { hash, compare } = require('bcryptjs');
const { promisify } = require('util');
const hashAsync = promisify(hash);
const compareAsync = promisify(compare);
const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');
const jwt = require('jsonwebtoken');
const Todo = require('./Todo.js');
const User = require('./User.js');
const users = [];

const schema = buildSchema(`
  type Todo {
    content: String!
    id: ID!
    userid: ID!
  }

  type User {
    id: ID!
    username: String!
    todos: [Todo!]
  }

  type Mutation {
    createTodo(userid: ID!, content: String!): Todo
    createUser(username: String!, password: String!): User
  }

  type AuthResult {
    result: Boolean!
    token: String
    user: User
  }
  
  type Query {
    allUsers: [User!]
    login(username: String!, password: String!): AuthResult
  }
`);

const root = {
  createUser({ username, password }) {
    const user = new User(username, password); 
    users.push(user);
    return user;
  },
  createTodo({ userid, content }, req) {
    const user = _.find(users, { id: userid });
    
    return user.addTodo(content);
  },
  allUsers () {
    return users;
  },
  async login ({ username, password }) {
    const user = _.find(users, { username });
    let result;
    if (user){
      try {
        const isAuthenticated = await compareAsync(password, user.password);
        const token = jwt.sign({ userid: user.id }, password);
        if (isAuthenticated) {
          result = {
            result: true,
            token,
            user
          }
        } else {
          result = {
            result: false,
          }
        }
      } catch (e) {
        console.error(e);
        
        result = {
          result: false,
        }
      }
    } else {
      result = {
        result: false
      };
    }
    return result;
  }
}

const app = express();
app.use(express.static('public'));

app.use('/graphql', (req, res) => graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
})(req, res));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});


// listen for requests :)
const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
