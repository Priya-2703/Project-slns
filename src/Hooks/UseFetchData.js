import React, { useEffect, useState } from 'react'

const UseFetchData = () => {
  const [data,setData] =useState([])

  useEffect(()=>{
    fetchData()
  },[])

  const fetchData = async () => {
    try {
      const res = await fetch(
        "https://raw.githubusercontent.com/saransk03/cloth-json/main/db.json"
      );
      const ans = await res.json();
      setData(ans.products)
    } catch (error) {
      console.log(error)
    }
  };

  return {data}
}

export default UseFetchData
