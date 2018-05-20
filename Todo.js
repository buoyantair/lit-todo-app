const uuidv1 = require("uuid/v1");

class Todo {
  constructor(userid, content) {
    this.content = content;
    this.id = uuidv1();
    this.userid = userid;
  }
  
}

module.exports = Todo;