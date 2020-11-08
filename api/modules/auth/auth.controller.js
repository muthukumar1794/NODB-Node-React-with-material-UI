const service = require('./auth.service')
const moment = require('moment-timezone')
const utility = require('../../utils/utility')
const Joi = require('joi');
const JoiSchema = require('../joischema');
const joiSchema = new JoiSchema();
const _ = require('lodash')
const User = require('./model/users.model')
const adminUser = require('./auth.model')

module.exports = {

    getAdminUser: async (req, res) => {
        try {

            const email = req.body.email;
            const password = req.body.password;
            if (!email) {
                utility.error(res, "Invalid Email")
                return
            }

            if (!password) {
                utility.error(res, "Invalid Password");
                return
            }

            const value = Joi.attempt({
                email: email,
                password: password
            }, joiSchema.loginSchema());

            const userData = await service.getUserByEmail(value.email);
            if (userData && !(_.isObject(userData)) || _.isEmpty(userData))  {
                utility.error(res, "User does not excist, please check the username.");
                return
            }
            const checkPassword = await utility.comparePassword(value.password, userData.password);
            if (!checkPassword) {
                const error = new Error("Please check the password.")
                utility.error(res, error);
                return
            }
            
            let data = {
                email: userData.email,
            }
            const token = await utility.generateToken(data);
            data.token = token;
            utility.sucess(res, data)
        } catch (error) {
            console.log("Login error");
            console.error(error);
            utility.error(res, error)
        }
    },

    createUser: async (req, res) => {
        try {
            const userData = req.body;
            if(userData.password !== userData.confirmPassword){
                const error = new Error('both password fields have to same')
                utility.error(res, error)
            }
            const value = Joi.attempt({
                email: userData.email,
                password: userData.password,
              }, joiSchema.singInSchema());
            if (!value) {
                const error = new Error('validatioon error')
                utility.error(res, error)
            }
            const userExists = await adminUser.findByMail(value.email)
            if (userExists) {
                const error = new Error('user already Exists')
                utility.error(res, error)
            }
            Password = await utility.encryptPassword(value.password);
                const name = value.email;
                const password = Password;
            const user = new adminUser(name, password);
            user.save();
            utility.sucess(res, "")
        } catch (error) {
            console.log("Create User Error");
            console.error(error);
            utility.error(res, error)
        }
    },


}