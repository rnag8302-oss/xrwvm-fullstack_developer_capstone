import React, { useState, useEffect } from 'react';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';
import review_icon from "../assets/reviewicon.png"

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  // let [state, setState] = useState("")
  let [states, setStates] = useState([])

  // let root_url = window.location.origin
  let dealer_url ="/djangoapp/get_dealers";
  
  let dealer_url_by_state = "/djangoapp/get_dealers/";
 
  const filterDealers = async (state) => {
    // 1. Reset the base URL every time
    const base_url = "https://ruhit2314505-3030.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/fetchDealers/";
    
    // 2. Append the state to the fresh base URL
    const fetch_url = base_url + state;
    
    const res = await fetch(fetch_url, {
      method: "GET"
    });
    
    const retobj = await res.json();
    
    if(retobj.status === 200) {
      let state_dealers = Array.from(retobj.dealers);
      setDealersList(state_dealers);
    }
}

const get_dealers = async () => {
    // 1. Force the absolute URL - bypass the proxy
    const absolute_url = "https://ruhit2314505-3030.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/fetchDealers";
    
    try {
        const res = await fetch(absolute_url, { method: "GET" });
        const retobj = await res.json();
        
        console.log("DEBUG: Response from server:", retobj);

        // 2. Extract dealers directly from the response
        // Even if it's nested or flat, this will find it
        const dealerData = retobj.dealers ? retobj.dealers : retobj;
        
        if (Array.isArray(dealerData)) {
            setDealersList(dealerData);
        } else {
            console.error("DEBUG: Data is not an array:", dealerData);
        }
    } catch (error) {
        console.error("DEBUG: Fetch error:", error);
    }
}
  useEffect(() => {
    get_dealers();
  },[]);  


let isLoggedIn = sessionStorage.getItem("username") != null ? true : false;
return(
    <div>
      <Header/>
      <table className='table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Dealer Name</th>
            <th>City</th>
            <th>Address</th>
            <th>Zip</th>
            <th>
              <select name="state" id="state" onChange={(e) => filterDealers(e.target.value)}>
                <option value="" selected disabled hidden>State</option>
                <option value="All">All States</option>
                {states.map(state => <option key={state} value={state}>{state}</option>)}
              </select>
            </th>
            {isLoggedIn && <th>Review Dealer</th>}
          </tr>
        </thead>
        <tbody>
          {dealersList.map(dealer => (
            <tr key={dealer.id}>
              <td>{dealer.id}</td>
              <td><a href={'/dealer/'+dealer.id}>{dealer.full_name}</a></td>
              <td>{dealer.city}</td>
              <td>{dealer.address}</td>
              <td>{dealer.zip}</td>
              <td>{dealer.state}</td>
              {isLoggedIn && (
                <td><a href={`/postreview/${dealer.id}`}><img src={review_icon} className="review_icon" alt="Post Review"/></a></td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Dealers
