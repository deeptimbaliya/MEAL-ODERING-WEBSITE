import React, { useState, useEffect } from 'react';
import { MdDeleteForever } from "react-icons/md";
import { useCart } from '../context/CartContext';
import ClipLoader from "react-spinners/ClipLoader";
import '../style/cart.css'

function CartItem({ data }) {
  const { updateQuantity, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [quantity, setquantity] = useState(0);
  const [item, setitem] = useState('')
  const itemId = data.itemId;

  useEffect(() => {
    setquantity(data.quantity)
    setLoading(true);
    fetch(`http://localhost:5000/api/gettiffinbyid/${itemId}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Fetch failed ${res.status}`);
        }
        const data = await res.json();
        setitem(data)
      })
      .catch((err) => {
        console.error("server error", err);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [itemId])

  useEffect(() => {
    if (quantity == 0) {
      removeFromCart(itemId)
    }
  }, [quantity])


  const increase = () => {
    const next = Math.min(Number(quantity || 0) + 1, 10);
    setquantity(next)
    updateQuantity(itemId, next)
  }

  const decrease = () => {
    const next = Math.max(Number(quantity || 0) - 1, 0);
    setquantity(next)
    updateQuantity(itemId, next)
  }



  
  
 if (loading || !data) {
    return (
      <div className="fullpage-loader-overlay">
      <ClipLoader color="#36D7B7" size={80} />
    </div>
    );
  }
  return (
    <div className="item">
      <div className="itemImgcontainer">
        <img src={`http://localhost:5000${data.image}`} alt="dish name " />
      </div>
      <p className="itemname">{item.name}</p>
        <div className="quantityInputContainer">
          <div onClick={decrease} className="decrease" disabled={quantity <= 0}>-</div>
          <input
            type="text"
            className="quantity-input"
            value={quantity}
            disabled={true}
          />
          <div onClick={increase} className="increase" disabled={quantity >= 10}>+</div>
        </div>
      <p className="itemprize">₹{item.price}</p>
    </div>
  )
}

export default CartItem;