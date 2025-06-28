import React, { useState, useEffect } from 'react';
import CartItem from "../component/CartItem";
import { useCart } from '../context/CartContext';
import { useAuth } from "../context/authContext";
import { useNavigate } from 'react-router-dom';
import { GiMeal } from "react-icons/gi";
import { IoAddCircle } from "react-icons/io5";
import { RiBillFill } from "react-icons/ri";
import Checkout from '../component/Checkout';


const Cart = () => {
  const Naviget = useNavigate();
  const { cartItems } = useCart();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emptyCart, setemptyCart] = useState(false);
  const [totalamount, settotalamount] = useState('');
  const [readyforcheckout, setReadyforcheckout] = useState(false)
  const { isProfileComplete } = useAuth()

  useEffect(() => {
    if (cartItems.length == 0) {
      setemptyCart(true)
    } else {
      setCart(cartItems)
    }
  }, [cartItems]);

  useEffect(() => {
    if (!emptyCart) {
      setLoading(true)
      let amount = Number(0)
      cart.map((cart, index) => {
        amount = amount + Number(cart.quantity * cart.price)
      })
      const taxOnFood = (5 * amount) / 100;
      const Packaging = Number(cart.length) * 5;
      const taxOnPackaging = (5 * Packaging) / 100;
      const totalamount = amount + taxOnFood + Packaging + taxOnPackaging + 10 + 1.8 + 15;
      setLoading(false);
      settotalamount({
        'itemtotal': amount,
        'TaxOnFood': taxOnFood,
        'PackagingCharge': Packaging,
        'TaxonPackaging': taxOnPackaging,
        'plateformfee': 10,
        'TaxonPlatformfees': 1.8,
        'Delivery': 15,
        'Total': totalamount
      })
    }
  }, [cart, cart.quantity])


  const addtocart = () => {
    Naviget('/menu')
  }

  const Checkouttoorder = () => {
    if (isProfileComplete) {
      setReadyforcheckout(true)
    } else {
      alert('please complate your profile.')
    }
  }

  if (emptyCart) {
    return (
      <div className="cartcontainer">
        <div onClick={addtocart} className="emptycart">
          <IoAddCircle /><p>add to cart</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="cartcontainer">
        <div className="itemCotnainer">
          <p className="text-black text-xl flex gap-2 items-center font-bold "><GiMeal />Your meals</p>
          {cart.map((cart, index) => (
            <CartItem key={index} data={cart} />
          ))}
        </div>
        {loading ?
          <div className="billcontainer">
            <div style={{ width: '100%', padding: '10px' }}>
              <div className="skeleton medium"></div>
              <div className="skeleton short"></div>
              <div className="skeleton"></div>
              <div className="skeleton medium"></div>
            </div>
          </div>
          :
          <div className="billcontainer">
            <h1 className="heading gap-1"><RiBillFill /> To Pay {totalamount.Total}</h1>
            <div className='billinfo'>
              <p>Item Amount:&nbsp;₹{totalamount.itemtotal}</p>
              <p>Delivery Fee: &nbsp;₹{totalamount.Delivery}</p>
              <p>plateform fee: &nbsp;₹{totalamount.plateformfee}</p>
              <p>Packaging Charge: &nbsp;₹{totalamount.PackagingCharge}</p>
              <p>GST and other tex: </p>
              <div className='tax'>
                <p>Tax On Food:&nbsp;₹{totalamount.TaxOnFood}</p>
                <p>Tax on Packaging:&nbsp;₹{totalamount.TaxonPackaging}</p>
                <p>Tax on Platform fees:&nbsp;₹{totalamount.TaxonPlatformfees}</p>
              </div>
              <p className='font-bold'>Total:&nbsp;₹{totalamount.Total}</p>
            </div>
            <button onClick={Checkouttoorder}>Checkout</button>
          </div>
        } 
      </div>
        {readyforcheckout && (<>
          <Checkout data={totalamount} />
        </>)}
        
    </>
  )
}

export default Cart