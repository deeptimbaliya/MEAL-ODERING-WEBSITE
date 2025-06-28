import React, { useEffect, useState } from 'react'
import MenuTiffin from './MenuTiffins';
import '../style/Menu.css'

const Menucategory = (Tiffin) => {
  const [loading, setloading] = useState(true);
  const [category, setCategory] = useState(null);
  const [tiffins, settiffins] = useState("")

  useEffect(() => {
    if (Tiffin) {
      setCategory(Tiffin.data);
    }
  }, [Tiffin]);
  useEffect(() => {
    if (category) {
      settiffins(category.tiffins);
      setloading(false);
    }
  }, [category]);

  if (loading || !category) {
    return (
      <div style={{ width: '100%', padding: '10px' }}>
        <div className="skeleton medium"></div>
        <div className="skeleton short"></div>
        <div className="skeleton"></div>
        <div className="skeleton medium"></div>
      </div>
    );
  }
  return (
    <>
    <div className="CategoryContainer">
        <div className="heading">
            <h1 className='headingcontent'> <span className="blackcontent">Our</span> {category.category} <span className="blackcontent">Tiffin</span></h1>
        </div>
        <div className="tiffins">
            {tiffins.map((tiffins,index)=>(
              <MenuTiffin key={index} data={tiffins} />
            ))}
        </div>
    </div>
    </>
  )
}

export default Menucategory;