const Otp = require('../models/Otp');
const User = require('../models/UserModel');
const Tiffin = require('../models/TiffinModel')
const Order=require('../models/order')
const nodemailer = require('nodemailer');
const firebaseAdmin = require('firebase-admin')
const sendOrderEmail=require('./emailsender');
const order = require('../models/order');
const { response } = require('express');

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(require("../etiffin-060505-firebase-adminsdk-fbsvc-b61d94b514.json"))
})


const getuser = async (req, res) => {
  try {

    const userID = req.params.userID;

    let userdata = await User.findOne({ _id: userID })

    if (!userdata) {
      return res.status(404).json({ message: 'user not found' })
    }
    res.status(200).json(userdata)
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: 'server error' })
  }
}

const updateuser = async (req, res) => {
  try {
    const userID = req.params.userID;
    const { username, MobileNo, address } = req.body;


    if (!username || !MobileNo) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const updateuser = await User.findByIdAndUpdate(
      userID,
      { username, MobileNo, address },
      { new: true }
    )

    console.log(updateuser)

    if (!updateuser) {
      return res.status(404).json({ message: 'user not found' })
    }

    res.status(200).json({ message: 'user updated', user: updateuser })
  } catch (error) {
    console.error(err)
    res.status(400).json({ message: 'server error' })
  }
}

const googlelogin = async (req, res) => {
  try {
    const { token, email, username } = req.body;

    const check = await firebaseAdmin.auth().verifyIdToken(token);

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        username,
      });
    }
    res.status(200).json({ message: 'Login success.', user });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(400).json({ message: 'Failed to login.' });
  }
};
const sendEmailOtp = async (req, res) => {
  const { email } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: 'Email already registered' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await Otp.deleteMany({ email });
  await Otp.create({ email, otp });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Dear User,\n\nYour OTP for login is: ${otp}  \nThis OTP is valid for 5 minutes. Please do not share it with anyone.\n\nThank you, E-Tiffin Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

const verifyEmailOtp = async (req, res) => {
  const { email, otp } = req.body;

  const record = await Otp.findOne({ email, otp });
  if (!record) return res.status(400).json({ message: 'Invalid or expired OTP' });

  await Otp.deleteMany({ email });
  res.status(200).json({ message: 'OTP verified' });
};

const register = async (req, res) => {
  const { username, email, MobileNo } = req.body;

  const userExists = await User.findOne({ $or: [{ email }, { MobileNo }] });
  if (userExists) return res.status(400).json({ message: 'Email or Mobile number already in use' });
  try {
    const user = await User.create({ username, email, MobileNo });

    res.status(201).json({
      success: true,
      message: 'User registered',
      user: user
    });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

const sendLoginOtp = async (req, res) => {
  const { email } = req.body;

  const existingUser = await User.findOne({ email });
  if (!existingUser) return res.status(400).json({ message: 'Email is not registered' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await Otp.deleteMany({ email });
  await Otp.create({ email, otp });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'LogIn OTP for E-Tiffin Service',
    text: `Dear User,

          Your OTP for login is: ${otp}  
          This OTP is valid for 5 minutes. Please do not share it with anyone.

          Thank you,  
          E-Tiffin Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent' });
  } catch {
    res.status(500).json({ message: 'failed to send OTP' });
  }

}


const verifyloginOtp = async (req, res) => {
  const { email, otp } = req.body;

  const record = await Otp.findOne({ email, otp });
  if (!record) return res.status(400).json({ message: 'Invalid or expired OTP' });

  const user = await User.findOne({ email })

  await Otp.deleteMany({ email });
  res.status(200).json({
    success: true,
    message: 'OTP verified ',
    user: user
  });
};

const addTiffin = async (req, res) => {
  try {
    const { category, tiffins } = req.body;
    console.log(req.body)

    if (!category || !Array.isArray(tiffins)) {
      return res.status(400).json({ message: 'Invalid data format' });
    }

    const result = await Tiffin.findOneAndUpdate(
      { category },
      { $set: { tiffins } },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'Tiffins inserted/updated successfully', data: result });
  } catch (error) {
    console.error('Insert Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

const gettiffin = async (req, res) => {
  try {
    const tiffin = await Tiffin.find();
    if (!tiffin) {
      return res.status(404).json({ message: 'tiffin not found' })
    }
    res.status(200).json({ tiffin })

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

const gettiffinbycategory = async (req, res) => {
  try {
    const category = req.params.category;
    const tiffin = await Tiffin.findOne({ category });

    if (!tiffin) {
      return res.status(404).json({ message: 'category not found' })
    }
    res.status(200).json({ tiffin })

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

const gettiffinbyid = async (req, res) => {
  try {
    const { id } = req.params;

    const categoryDoc = await Tiffin.findOne({ 'tiffins._id': id });

    if (!categoryDoc) {
      return res.status(404).json({ message: 'Tiffin item not found' });
    }

    const tiffinItem = categoryDoc.tiffins.find(t => t._id.toString() === id);

    if (!tiffinItem) {
      return res.status(404).json({ message: 'Tiffin not found in category' });
    }

    return res.status(200).json({
      ...tiffinItem.toObject(),
    });

  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}
const getOrderhistory = async (req, res) => {
  try {
    const { id } = req.params;

    const orderhistory=await Order.findOne({'userId':id})

    if (!orderhistory) {
      return res.status(200).json({ message: 'No orders found', orders: [] });
    }
    res.status(200).json({message: 'No orders found', orders: orderhistory.orders})
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}

const placeOrder = async (req, res) => {
  const { user, orderDetails, items } = req.body;

  try {
    const userId=user._id;
    const email=user.email;
    const existing = await Order.findOne({ email });

    if (existing) {
      existing.orders.push({ orderDetails, items });
      await existing.save();
    } else {
      await Order.create({
        userId,
        email,
        orders: [{ orderDetails, items }]
        
      });
      
    }

    const userMsg=`Hi ${user.username},

      ✅ Your order has been placed!
      Items:
      ${items.map(i => `${i.name} x ${i.quantity}`).join('\n')}
      Total: ₹${orderDetails.totalAmount}`

    await sendOrderEmail(email, userMsg, 'E-Tiffin order');


    const adminMsg = `
      🧾 New Order Placed

      Username:${user.username}
      email:${email}
      Mobile No:${user.MobileNo}
      address:${user.address}

      Items:
      ${items.map(i => `${i.name} x ${i.quantity}`).join('\n')}
    `;

    await sendOrderEmail(process.env.ADMIN_EMAIL, adminMsg,'E-Tiffin Order Notification');

    res.status(201).json({ message: 'Order added successfully' });

  } catch (err) {
    console.error('Order error:', err.message);
    res.status(500).json({ message: 'Order failed', error: err.message });
  }
};

module.exports = { googlelogin, sendEmailOtp, verifyEmailOtp, register, sendLoginOtp, verifyloginOtp, getuser, updateuser, addTiffin, gettiffinbycategory, gettiffin, gettiffinbyid,placeOrder,getOrderhistory };
