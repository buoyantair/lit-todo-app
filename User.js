const uuidv1 = require('uuid/v1');
const { hash } = require('bcryptjs');
const { promisify } = require('util');
const hashAsync = promisify(hash);
const Todo = require('./Todo');

class User {
  constructor(username, password) {
    this.id = uuidv1();
    this.username = username;
    hashAsync(password, 8)
    .then(hash => {
      this.password = hash;
    })
    .catch(console.error);
    this.todos = [];
    this.session = null;
  }
  
  addTodo(content) {
    const todo = new Todo(this.id, content);
    this.todos.push(todo);
    
    return todo;
  }
}

module.exports = User;