const express = require('express')
const router = express.Router()
const verifyToken = require('../../utils/utility').verifyToken;
const utility = require('../../utils/utility')

const adminController = require('./auth.controller')
const controller = require('./controller/users.controller')

router.get('/verify/user/authentication', verifyToken, (req, res) => {
    utility.sucess(res, req.user_data);
});

router.post('/login/user', adminController.getAdminUser)

router.post('/create/user', adminController.createUser)

// router.post('/get/task/api/:type', verifyToken, controller.sericeApi)

router.get('/users', verifyToken, controller.getUsers);


router.post('/add-user', verifyToken, controller.addUser);

router.get('/edit-user/:userId', verifyToken, controller.getEditUser);

router.post('/edit-user', verifyToken, controller.postEditUser);

router.delete('/delete-user/:userId', verifyToken, controller.DeleteUser);

router.get('/get/search-data/:userName/', verifyToken, controller.getSearchUser);

module.exports = router