

const fs = require('fs');
const path = require('path');

// const Cart = require('./cart');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'adminUsers.json'
);

const getUsersFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class User {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  save() {
    getUsersFromFile(users => {
        users.push(this);
        fs.writeFile(p, JSON.stringify(users), err => {
          console.log(err);
        });
      });
  }

  static fetchAll(cb) {
    getUsersFromFile(cb);
  }

  static findById(email) {
    return new Promise((resolve, reject)=>{
      getUsersFromFile(users => {
        const user = users.find(p => p.email === email);
        resolve(user)
      });
    })
  }
  static findByMail(email, cb) {
    return new Promise((resolve, reject)=>{
      getUsersFromFile(users => {
        const user = users.find(p => p.email === email);
        resolve(user)
      });
    })
  }


};
