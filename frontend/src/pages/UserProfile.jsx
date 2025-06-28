import React, { useState, useEffect } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import '../style/UserProfile.css';
import { useAuth } from "../context/authContext";





const Profile = () => {
  const { user, setUser } = useAuth()
  const [loading, setloading] = useState(false)
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [userId, setuserId] = useState();
  const [orderhistery, setorderhistery] = useState([])
  const [emptyorderhistory, setEmptyorderhistory] = useState(true)
  const [userdata, setUserdata] = useState({
    username: '',
    email: '',
    MobileNo: '',
    address: ''
  });

  useEffect(() => {
    
   if(orderhistery.length==0){
    setEmptyorderhistory(true)
   }else{
     setEmptyorderhistory(false)
   }
  }, [orderhistery])
  


  useEffect(() => {
    setloading(true)
    if (user) {
      const userID = user._id;
      setuserId(userID)
      fetch(`http://localhost:5000/api/getuser/${userID}`)
        .then(res => res.json())
        .then(data => {
          setUserdata(data)
          setloading(false)
        })
        .catch(err => {
          console.error('Error:', err)
          setloading(false)
        });
    } else {
      setloading(true)
    }

  }, [user]);


  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:5000/api/getorderhistory/${userId}`)
        .then(async(res) =>{
          if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
          return res.json(); 
        } )
        .then(data => {
          setorderhistery(data.orders)
          setloading(false)
        })
        .catch(err => {
          console.error('Error:', err)
          setloading(false)
        });
    }

  }, [userId])






  const validateInputs = () => {
    const { username, MobileNo } = userdata;
    const newErrors = {};
    if (!/^[A-Za-z]{4,16}$/.test(username)) newErrors.username = true;
    if (!/^[6-9]\d{9}$/.test(MobileNo)) newErrors.MobileNo = true;
    return newErrors;
  };

  const updateuser = async () => {
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return errors;
    }
    setloading(true)
    const userID = user._id
    try {

      const res = await fetch(`http://localhost:5000/api/updateuser/${userID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userdata)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP');

      setUserdata(data.user)
      setEditMode(false)
      setUser(data.user)
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setloading(false)
    }
  }




  const handleChange = (e) => {
    setUserdata({ ...user, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="order-loader-backdrop">
        <div className="loader-box">
          <ClipLoader size={60} color="#007bff" />
          <p>Gettng your Profile...</p>
        </div>
      </div>
    )
  }
  return (

    <>

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <h2>Your Profile</h2>
            <button className="edit-btn" onClick={() => setEditMode(!editMode)}>
              {editMode ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
          <div className="profile-body">
            <label>Name:</label>
            {editMode ? (
              <input type="text" name="username" value={userdata.username} onChange={handleChange} />
            ) : (
              <p>{userdata.username}</p>
            )}

            <label>Email:</label>
            <p>{userdata.email}</p>

            <label>Mobile:</label>
            {editMode ? (
              <input type="text" name="MobileNo" value={userdata.MobileNo} onChange={handleChange} />
            ) : (
              <p>{userdata.MobileNo}</p>
            )}

            <label>Address:</label>
            {editMode ? (
              <textarea name="address" value={userdata.address} onChange={handleChange}></textarea>
            ) : (
              <p>{userdata.address}</p>
            )}

            {editMode && (
              <button className="save-btn" onClick={updateuser}>Save</button>
            )}
          </div>
        </div>
        <div className="order-history">
          <h3>Your Order History</h3>
          
        {emptyorderhistory? (
          <>
              <div className="emptyorder">
                <h1>No Order Found</h1>
              </div>
          </>
        ) : (
          <>
          
          <div className="orders-list">
            {orderhistery.slice(-3).map((order, index) => (
              <div className="order-card" key={index}>
                <div className="itemscontainer">
                  <h4>Items</h4>
                  {order.items.map((item, i) => (
                    <p key={i}>{item.name} : {item.quantity}</p>
                  ))}
                </div>
                <div>
                  <p>₹{order.orderDetails.totalAmount}</p>
                  <p>{order.orderDetails.date}</p>
                </div>
              </div>
            ))}
          
        </div>
          </>
        )}
        
        </div>
      </div >
    </>
  );
};

export default Profile;