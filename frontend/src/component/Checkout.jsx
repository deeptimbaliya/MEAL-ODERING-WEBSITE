import React, { useState } from 'react'
import { useAuth } from "../context/authContext";
import { useCart } from '../context/CartContext';
import ClipLoader from "react-spinners/ClipLoader";

const Checkout = ({ data }) => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentmethod] = useState("COD")
  const [loading, setLoading] = useState(false);

  const placeorder = async () => {
    const totalAmount = data.Total
    try {
      setLoading(true)
      const res = await fetch('http://localhost:5000/api/PlaceOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: user,
          orderDetails: {
            paymentMethod,
            totalAmount,
            date: new Date().toISOString()
          },
          items: cartItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          }))
        })
      })
      if (!res.ok) throw new Error(data.message || 'failed to Place order');
      clearCart()
      setLoading(false)
    } catch (error) {
      alert(error)
      console.error(error)
      setLoading(false)
    }finally{
      setLoading(false)
    }
  }
  if (loading) {
    return(
      <div className="order-loader-backdrop">
      <div className="loader-box">
        <ClipLoader size={60} color="#007bff" />
        <p>Placing your order...</p>
      </div>
    </div>  
    )
  }
  return (
    <>
      <div className="checkoutcontainer">
        <div className="paymentmethod">
          <h1>Payment Method:</h1>
          <input type="radio" value={true} name="COD" />
          <label htmlFor="COD">COD{'( Cash On Delivery)'}</label>
        </div>
        <div className="address">
          <h1>Delivery Address:</h1>
          <p className="adress">{user.address}</p>
        </div>
        <div className="orderitem">
          <h1>Your Meal:</h1>
          <table>
            <thead>
              <tr>
                <th>
                  Item Name
                </th>
                <th>
                  Price
                </th>
                <th>
                  Quantity
                </th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((cartItems, index) => (
                <tr key={index}>
                  <td>{cartItems.name}</td>
                  <td>{cartItems.price}</td>
                  <td>{cartItems.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <div className='billinfo'>
            <p>Item Amount:&nbsp;₹{data.itemtotal}</p>
            <p>Delivery Fee: &nbsp;₹{data.Delivery}</p>
            <p>plateform fee: &nbsp;₹{data.plateformfee}</p>
            <p>Packaging Charge: &nbsp;₹{data.PackagingCharge}</p>
            <p>GST and other tex: </p>
            <div className='tax'>
              <p>Tax On Food:&nbsp;₹{data.TaxOnFood}</p>
              <p>Tax on Packaging:&nbsp;₹{data.TaxonPackaging}</p>
              <p>Tax on Platform fees:&nbsp;₹{data.TaxonPlatformfees}</p>
            </div>
            <p className='font-bold'>Total:&nbsp;₹{data.Total}</p>
          </div>
        </div>
        <button onClick={placeorder}>Place Order</button>
      </div>
    </>
  )
}

export default Checkout