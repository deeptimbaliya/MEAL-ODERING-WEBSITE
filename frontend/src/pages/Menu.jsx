import React, { useEffect, useState } from 'react'
import Category from '../component/Menucategory'
import '../style/Menu.css'

const Menu = () => {
  const [loading, setLoading] = useState(true);
  const [Tiffin, setTiffins] = useState(null)
  useEffect(() => {
    fetch(`http://localhost:5000/api/gettiffin`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Fetch failed ${res.status}`);
        }
        const data = await res.json();
        setTiffins(data.tiffin);
        
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
      {loading ?
        <div style={{ width: '100%', padding: '10px' }}>
          <div className="skeleton medium"></div>
          <div className="skeleton short"></div>
          <div className="skeleton"></div>
          <div className="skeleton medium"></div>
        </div>
        :
        <div className="MenuContainer">
        {Tiffin.map((Tiffin, index) => (
          <Category key={index} data={Tiffin} />
        ))}
      </div>
      }
      
    </>
  )
}

export default Menu;