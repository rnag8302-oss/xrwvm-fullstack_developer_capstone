import React, { useState, useEffect } from 'react';
import "./Dealers.css";
import review_icon from "../assets/reviewicon.png";
import Header from '../Header/Header';

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  const [states, setStates] = useState([]);

  // Use absolute URL to bypass all proxy/Django routing issues permanently
  const absolute_url = "https://ruhit2314505-3030.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai";

  useEffect(() => {
    get_dealers();
  }, []);

  const get_dealers = async () => {
    try {
      const absolute_url = "https://ruhit2314505-3030.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai";
      
      // YEH LINE MISSING THI AAPKE CODE MEIN!
      const res = await fetch(`${absolute_url}/fetchDealers`);
      
      const retobj = await res.json();
      
      const data = retobj.dealers || retobj;
      if (Array.isArray(data)) {
        setDealersList(data);
        
        // Extract unique states for the dropdown
        let stateSet = new Set();
        data.forEach(dealer => {
            if(dealer.state) stateSet.add(dealer.state);
        });
        setStates(Array.from(stateSet));
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };
  const filterDealers = async (selectedState) => {
    try {
      const endpoint = selectedState === "All" ? "/fetchDealers" : `/fetchDealers/${selectedState}`;
      const res = await fetch(`${absolute_url}${endpoint}`);
      const retobj = await res.json();
      
      const data = retobj.dealers || retobj;
      if (Array.isArray(data)) {
        setDealersList(data);
      }
    } catch (error) {
      console.error("Filter failed:", error);
    }
  };

  let isLoggedIn = sessionStorage.getItem("username") != null;

  return (
    <div>
      <Header />
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
                <option value="" defaultValue disabled hidden>State</option>
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
              <td><a href={`/dealer/${dealer.id}`}>{dealer.full_name || dealer.short_name}</a></td>
              <td>{dealer.city}</td>
              <td>{dealer.address}</td>
              <td>{dealer.zip}</td>
              <td>{dealer.state}</td>
              {isLoggedIn && (
                <td>
                  <a href={`/postreview/${dealer.id}`}>
                    <img src={review_icon} className="review_icon" alt="Post Review"/>
                  </a>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dealers;