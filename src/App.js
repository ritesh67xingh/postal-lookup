import React, { useState } from "react";
import "./style.css";

function App() {
  const [pincode, setPincode] = useState("");
  const [postOffices, setPostOffices] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handlePincodeChange = (event) => {
    setPincode(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value.toLowerCase());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      alert("Please enter a valid 6-digit Pincode");
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      const postOffices = data[0].PostOffice;
      setPostOffices(postOffices);
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  let filteredPostOffices = postOffices ? postOffices.filter((postOffice) =>
    postOffice.Name.toLowerCase().includes(filterValue)
  ) : [];

  return (
    <div className="container">
      <h1>Pincode Lookup</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="pincode-input">Enter Pincode:</label>
          <input
            type="text"
            className="form-control"
            id="pincode-input"
            placeholder="Enter 6-digit Pincode"
            value={pincode}
            onChange={handlePincodeChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Lookup
        </button>
      </form>
      <hr />
      <div className="form-group">
        <label htmlFor="filter-input">Filter by Post Office Name:</label>
        <input
          type="text"
          className="form-control"
          id="filter-input"
          placeholder="Enter post office name"
          value={filterValue}
          onChange={handleFilterChange}
        />
      </div>
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
      {error && (
        <div className="error-message">
          Error fetching data. Please try again.
        </div>
      )}
      {filteredPostOffices.length > 0 ? (
        <div id="results">
          {filteredPostOffices.map((postOffice, index) => (
            <div className="card post-office-card" key={index}>
              <div className="card-body">
                <h5 className="card-title post-office-name">{postOffice.Name}</h5>
                <p className="card-text">Pincode: {postOffice.Pincode}</p>
                <p className="card-text">District: {postOffice.District}</p>
                <p className="card-text">State: {postOffice.State}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="error-message">
          Couldn’t find the postal data you’re looking for…
        </div>
      )}
    </div>
  );
}



export default App;
