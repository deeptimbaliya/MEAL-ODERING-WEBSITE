import React, { useState, useEffect } from 'react';
import { TiStarFullOutline } from "react-icons/ti";
import '../style/Tiffin.css';
import { useCart } from '../context/CartContext';
import {useNavigate } from 'react-router-dom';

function Tiffins({ data }) {

  const [loading, setloading] = useState(true);
  const [tiffin, setTiffin] = useState(null);
  const naviget=useNavigate()


  const { addToCart } = useCart();

  useEffect(() => {
    if (data) {
      setTiffin(data);
      setloading(false);
    }
  }, [data]);

  if (loading || !tiffin) {
    return (
      <div style={{ width: '100%', padding: '10px' }}>
        <div className="skeleton medium"></div>
        <div className="skeleton short"></div>
        <div className="skeleton"></div>
        <div className="skeleton medium"></div>
      </div>
    );
  }
  const ordernow = () => {
    addToCart(data._id,data.name,data.price,data.image,1);
    naviget('/cart')
  }

  return (
    <div className='Tiffinecontainer'>
      <div className="dishimgcontainer">
        <img src={`http://localhost:5000${data.image}`} alt="thali" className='dishImg' />
      </div>
      <div className="dishInfo">
        <div className="dishname"><h1>{tiffin.name}</h1></div>
        <p className='rating'>
          <TiStarFullOutline className='text-amber-400' />
          {tiffin.rating} ({tiffin.ratingCount})
        </p>
        <div className="price">₹{tiffin.price}</div>
        <button onClick={ordernow} className="orderBtn">Order Now {'>'}</button>
      </div>
    </div>
  );
}


export default Tiffins;