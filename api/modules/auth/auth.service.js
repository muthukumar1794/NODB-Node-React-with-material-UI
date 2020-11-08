const userModal = require('./auth.model');

const service ={

    saveUser: async(data)=>{
        try {
            const saveSeed = await userModal.save(data)
            return saveSeed
        } catch (error) {
            utility.error(res, "Not Able to");
            
        }
    },

    getUserByEmail: async(email)=>{
        try {
            const saveSeed = await userModal.findById(email)
            if(!saveSeed){
                throw new Error("Username does not exist")
            }
            return saveSeed
            
        } catch (error) {
            throw new Error("Username does not exist")
        }
    }
}

module.exports = service