const settings = require('../settings');
const environment = require("../config/" + settings.environment);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 15;

const responce = {

    sucess(res, data) {
        res.status(200).send({
            status: 200,
            message: 'Success',
            data: data || []
        })
    },

    error(res, data, status_code = 400) {
        res.status(400).send({
            status: 400 || data.status,
            message: 'Error',
            data: data.message || "Something went wrong"
        })
    },

    verifyToken(req, res, next) {
        let tokenSignature = req.headers["auth-token"];
        console.log("tokenSignature",tokenSignature)
        if (tokenSignature) {
            const verifiedtoken = verifyToken(tokenSignature);
            if (verifiedtoken == "TokenExpiredError") {

                res.status(401).send({
                    status: 401,
                    message: 'Error',
                    data: "Token has expired."
                });
                return;
            } else if (!verifiedtoken) {

                res.status(400).send({
                    status: 400,
                    message: 'Error',
                    data: "Token invalid."
                });
                return;
            }
            req.user_data = verifiedtoken;
            next()
        } else {
            res.status(400).send({
                status: 400,
                message: 'Error',
                data: "User not found."
            });
        }
    },

    generateToken(data) {
        try {
            return jwt.sign({
                // exp: Math.floor(moment().add(1, 'd').valueOf() / 1000),
                data: data
            }, environment.TOKEN_KEY, { expiresIn: 1800 });
        } catch (error) {
            console.log("generate token error");
            console.error(error);
            return "";
        }
    },

    encryptPassword(password) {

        return new Promise((resolve, reject) => {
            try {
                bcrypt.hash(password, saltRounds, function (err, hash) {
                    if(err){
                        throw err;
                    }
                    resolve(hash);
                });
            } catch (error) {
                reject(error)
            }
        })
    },

    comparePassword(password,hash) {
        return new Promise((resolve, reject) => {
            try {
                bcrypt.compare(password, hash, function (err, result) {
                    if(err){
                        const error = new Error("Please check the password.")
                        utility.error(res, error);
                        return
                    }
                    resolve(result);
                });
            } catch (err) {
                const error = new Error("Please check the password.")
                        utility.error(res, error);
            }
        })
    }
}

function verifyToken(token) {
    try {
        return jwt.verify(token, environment.TOKEN_KEY);
    } catch (error) {
        console.log("verify token error");
        console.error(error);
        if (error && error.name == "TokenExpiredError") {
            // /return "TokenExpiredError"
            throw new Error('session timeout')
        } else {
            return "";
        }
    }
}

module.exports = responce