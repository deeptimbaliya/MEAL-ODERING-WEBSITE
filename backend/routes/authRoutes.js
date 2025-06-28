const express = require('express');
const router = express.Router();
const {googlelogin, sendEmailOtp, verifyEmailOtp, register, sendLoginOtp, verifyloginOtp,getuser, updateuser,addTiffin, gettiffinbycategory,gettiffin, gettiffinbyid,placeOrder,getOrderhistory} = require('../controllers/authController');

router.post('/google-login',googlelogin)
router.post('/send-email-otp', sendEmailOtp);
router.post('/verify-email-otp', verifyEmailOtp);
router.post('/register', register);
router.post('/send-login-otp', sendLoginOtp);
router.post('/verify-login-otp',verifyloginOtp);
router.get('/getuser/:userID',getuser)
router.put('/updateuser/:userID',updateuser);
router.post('/addtiffin', addTiffin);
router.get('/gettiffinbycategory/:category',gettiffinbycategory);
router.get('/gettiffin',gettiffin);
router.get('/gettiffinbyid/:id',gettiffinbyid);
router.post('/PlaceOrder', placeOrder);
router.get('/getorderhistory/:id',getOrderhistory);

module.exports = router;
