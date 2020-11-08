const Joi = require("joi");
// const JoiSchema = require('../joischema');
// const joiSchema = new JoiSchema();
const _ = require("lodash");
const User = require("../model/users.model");
const utility = require("../../../utils/utility");

module.exports = {
  addUser(req, res, next) {
    const name = req.body.name;
    const createdDate = new Date().toLocaleDateString();
    const number = req.body.number;
    const incomingCallCount = req.body.incomingCallCount;
    const outgoingCallCount = req.body.outgoingCallCount;
    const location = req.body.location;
    const user = new User(
      null,
      name,
      createdDate,
      number,
      incomingCallCount,
      outgoingCallCount,
      location
    );
    user.save();
    res.status(200).json({ message: "success" });
  },

  getEditUser: async (req, res, next) => {
    // const editMode = req.query.edit;
    try {
      const editMode = true;
      if (!editMode) {
        const error = new Error(`page not found`);
        utility.error(res, error, 404);
      }
      const userId = req.params.userId;
      const user = await User.findById(userId);
      if (!user) {
        const error = new Error(`user not found`);
        utility.error(res, error, 404);
      }
      res.status(200).json({
        user: user,
      });
    } catch (err) {
      const error = new Error(`something went wrong`);
      utility.error(res, error, 404);
    }
  },

  postEditUser: async (req, res, next) => {
    console.log("pppppppp", req.body);
    const id = req.body.user_id;
    const name = req.body.name;
    const createdDate = new Date().toLocaleDateString();
    const number = req.body.number;
    const incomingCallCount = req.body.incomingCallCount;
    const outgoingCallCount = req.body.outgoingCallCount;
    const location = req.body.location;
    const updatedUser = new User(
      id,
      name,
      createdDate,
      number,
      incomingCallCount,
      outgoingCallCount,
      location
    );
    const usersave = await updatedUser.save();
    res.status(200).json({
      message: "success",
      saveduser: usersave,
    });
  },

  getUsers: async (req, res, next) => {
    const users = await User.fetchAll();
    res.status(200).json({
      message: "success",
      data: users,
    });
  },

  DeleteUser(req, res, next) {
    const userId = req.params.userId;
    User.deleteById(userId);
    res.status(200).json({
      message: "Deleted Successfully",
    });
  },

  getSearchUser: async (req, res, next) => {
    const dataType = req.query.querytype;
    const name = req.params.userName;
    let userError;
    if (dataType == "search") {
      userError = "user";
      const user = await User.findByName(name);
      if (!user) {
        const error = new Error(`Not able to get this ${userError}`);
        utility.error(res, error, 404);
      }
      res.status(200).json({
        message: "success",
        data: user,
      });
    }
    if (dataType == "filter") {
      userError = "location";
      const user = await User.findByLocation(name);
      if (_.isEmpty(user)) {
        const error = new Error(`Not able to get this ${userError}`);
        utility.error(res, error, 404);
      }
      res.status(200).json({
        message: "success",
        data: user,
      });
    }
  },
};
