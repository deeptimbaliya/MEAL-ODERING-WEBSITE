import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import '../style/home.css'
import star from '../assets/star.png'
import thali from '../assets/thali-1.png'
import Tiffins from '../component/Tiffins';

const Home = () => {
  const words = ["Gujarati", "Rajasthani", "Maharashtrian", "Shouth Indian", "Panjabi", "Chainese"];
  const [loading, setLoading] = useState(false);
  const [thaliTiffins, setThaliTiffins] = useState([]);
  const [regularTiffins, setReularTiffins] = useState([]);
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/gettiffinbycategory/Indian Thali`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Fetch failed ${res.status}`);
        }
        const data = await res.json();
        setThaliTiffins(data.tiffin.tiffins);
      })
      .then(() => {
        return fetch(`http://localhost:5000/api/gettiffinbycategory/Regular`);
      })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Fetch failed ${res.status}`);
        }
        const data = await res.json();
        setReularTiffins(data.tiffin.tiffins);
      })
      .catch((err) => {
        console.error("server error", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);



  return (
    <>
      <div className="conatiner">
        <div className="content">
          <h1 className='headingcontent'>Quick <span className="blackcontent">and</span> and Testy <br />Tiffin Delivered <span className="blackcontent">with</span>  a <br />dash of <span className="blackcontent">speed</span> </h1>
          <div > <NavLink to="/menu" className="ordernowBtn">Order Now</NavLink></div>
        </div>
        <div className="thalimgContainer">
          <img src={thali} alt="thali" className='thaliImg' />
        </div>

      </div>
      <div className="info"></div>
      <div className="bestTiffinscontainer">
        <div className='headingcontainer'>
          <h1 className='headingcontent'><span className="blackcontent">Our</span> Thali <span className="blackcontent">Tiffins</span></h1>
          <p className="contentText">It s Not Just About Bringing You Good Food <br />From Restaurants, We Deliver You Experience</p>
        </div>
        {loading ?
          <div style={{ width: '100%', padding: '10px' }}>
            <div className="skeleton medium"></div>
            <div className="skeleton short"></div>
            <div className="skeleton"></div>
            <div className="skeleton medium"></div>
          </div>
          :
          <div className="Tiffins">
            {thaliTiffins.map((thaliTiffins, index) => (
              <Tiffins key={index} data={thaliTiffins} />
            ))}
          </div>
        }

      </div>

      <div className="scroll-container">
        <div className="scroll-track">
          {words.map((word, index) => (
            <React.Fragment key={index}>
              <span className="scroll-text">{word}</span>
              {index !== words.length - 1 && (
                <img src={star} alt="separator" className="scroll-icon" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="regularTiffinsContainer">
        <div className='headingcontainer'>
          <div className="flex-col " >
            <h1 className="headingcontent"><span className="blackcontent">Our</span> Regular <span className="blackcontent">Menu</span></h1>
            <p className="contentText">There Are Our Regular Menus. <br />You Can Order Anything You Like. </p>
          </div>
          <div className="btnsee bg-amber-500"><NavLink to="/menu" >See all</NavLink></div>
        </div>
        {loading ?
          <div style={{ width: '100%', padding: '10px' }}>
            <div className="skeleton medium"></div>
            <div className="skeleton short"></div>
            <div className="skeleton"></div>
            <div className="skeleton medium"></div>
          </div>
          :
          <div className="Tiffins">
          {regularTiffins.slice(0, 3).map((regularTiffins, index) => (
            <Tiffins key={index} data={regularTiffins} />
          ))}
        </div>
        }
        
      </div>
    </>
  )
}

export default Home