const Joi = require('joi');

class JoiSchema {

    constructor() {}

    loginSchema() {
        return Joi.object().keys({
            // email is required
            // email must be a valid email string
            email: Joi.string().email().required(),

            //password is required
            //password must be a alphanumeric string
            password: Joi.string().regex(/^[a-z0-9]+$/i).required(),
        });
    }

    singInSchema() {
        return Joi.object().keys({
            // username is required
            // username must be a valid email string
            email: Joi.string().email().required(),
            
            //password is required
            //password must be a alphanumeric string
            password: Joi.string().regex(/^[a-z0-9]+$/i).required(),
        });
    }
}

module.exports = JoiSchema