const fs = require("fs");
const path = require("path");

// const Cart = require('./cart');

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "users.json"
);

const getUsersFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class User {
  constructor(
    id,
    name,
    createdDate,
    number,
    incomingCallCount,
    outgoingCallCount,
    location
  ) {
    this.id = id;
    this.name = name;
    this.createdDate = createdDate;
    this.number = number;
    this.incomingCallCount = incomingCallCount;
    this.outgoingCallCount = outgoingCallCount;
    this.location = location;
  }

  save() {
    getUsersFromFile((users) => {
      if (this.id) {
        const existingUserIndex = users.findIndex(
          (user) => user.id === this.id
        );
        const updatedUsers = [...users];
        updatedUsers[existingUserIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedUsers), (err) => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        users.push(this);
        fs.writeFile(p, JSON.stringify(users), (err) => {
          console.log(err);
        });
      }
    });
  }

  static deleteById(id) {
    getUsersFromFile((users) => {
      const user = users.find((usr) => usr.id === id);
      const updatedUsers = users.filter((usr) => usr.id !== id);
      fs.writeFile(p, JSON.stringify(updatedUsers), (err) => {
        // if (!err) {
        //   Cart.deleteuser(id, user.price);
        // }
      });
    });
  }

  static fetchAll() {
    return new Promise((resolve, reject) => {
      getUsersFromFile((users) => {
        resolve(users);
      });
    });
  }

  static findByName(name, cb) {
    return new Promise((resolve, reject) => {
      getUsersFromFile((users) => {
        const user = users.find((p) => p.name === name);
        resolve(user);
      });
    });
  }
  static findByLocation(location, cb) {
    return new Promise((resolve, reject) => {
      getUsersFromFile((users) => {
        const user = users.filter((p) => p.location === location);
        resolve(user);
      });
    });
  }

  static findById(id, cb) {
    return new Promise((resolve, reject) => {
      getUsersFromFile((users) => {
        const user = users.find((p) => p.id === id);
        resolve(user);
      });
    });
  }
};
