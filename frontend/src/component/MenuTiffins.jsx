import React, { useState, useEffect } from 'react';
import { TiStarFullOutline } from "react-icons/ti";
import '../style/Menu.css';
import { useCart } from '../context/CartContext';

const MenuTiffins = ({ data }) => {
  
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();
  const [inCart, setInCart] = useState(false);
  const [quantity, setquantity] = useState(0);


  useEffect(() => {
    cartItems.map((item, index) => {
      if (item.itemId === data._id) {
        setquantity(cartItems[0].quantity)
      }
    });
  }, [data._id]);
  
  useEffect(() => {
    if (quantity == '0') {
      setInCart(false);
      removeFromCart(data._id)
    }
    if(quantity >=1){
      setInCart(true)
    }
  }, [quantity])
  
  const increase = () => {
    const next = Math.min(Number(quantity || 0) + 1, 10);
    setquantity(next)
    updateQuantity(data._id, next)
  }

  const decrease = () => {
    const next = Math.max(Number(quantity || 0) - 1, 0);
    setquantity(next)
    updateQuantity(data._id, next)
  }

 

  const handleAddToCart = () => {
    setInCart(true)
    setquantity(1)
    addToCart(data._id,data.name,data.price, data.image,1)
  }

  return (
    <div className='container'>
      <div className="imgholder">
        <img src={`http://localhost:5000${data.image}`} alt={data.name} className='dishImg' />
      </div>

      <div className="dishinfo">
        <p className="dishname">{data.name}</p>
        <div className="rating">
          <TiStarFullOutline className='text-amber-400' />
          <p>{data.rating} ({data.ratingCount})</p>
        </div>
        <p className="price">₹{data.price}</p>

        {inCart ? (
          <div className="quantity">
            <div className="quantityInputContainer">
              <button onClick={decrease} className="decrease" disabled={quantity <= 0}>-</button>
              <input
                type="text"
                className="quantity-input"
                value={quantity}
                disabled={true}
              />
              <button onClick={increase} className="increase" disabled={quantity >= 10}>+</button>
            </div>
          </div>
        ) : (
          <button className="toCart" onClick={handleAddToCart}>Add to Cart</button>
        )}
      </div>
    </div>
  );
};

export default MenuTiffins;
