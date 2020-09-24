import React from 'react';

import Logo from '../media/logo.png';

function LoggedInPage (props) {

  const loggedIn = (
    <div className="logged-in-page-body">
      <div className="col1 cspan2 row1">
        <img src={Logo} className="App-logo" alt="logo" />
      </div>
      <div className="col12 row1">
        <h6 className="logout-btn" onClick={(e) => props.handleLogout(e)}>LOGOUT</h6>
      </div>
      <div className="col3 cspan8 row2 text-centered">
        <h3>Welcome, {props.firstName}!</h3>
        <a
          className="App-link"
          href="https://poieo-dev.com"
        >
          Learn More About Poieo
        </a>
      </div>
      <h4>
        Poieo Dev: The Northwest's Custom App Development Firm
      </h4>
    </div>
  )

  const notLoggedIn = (
    <div className="logged-in-page-body">
      <div className="col1 cspan2 row1">
        <img src={Logo} className="App-logo" alt="logo" />
      </div>
      <div className="col12 row1">
        <h6 className="logout-btn" onClick={() => window.location = "/"}>LOGIN/REGISTER</h6>
      </div>
      <div className="col3 cspan8 row2 text-centered">
        <h3>Please Log In or Register</h3>
      </div>
      <h4>
        Poieo Dev: The Northwest's Custom App Development Firm.
        <a
          className="App-link"
          href="https://poieo-dev.com"
        >
          Learn More About Poieo
        </a>
      </h4>
    </div>
  )

  return (
    <div className="logged-in-page">
      {(props.userAuthenticated === false)? notLoggedIn : loggedIn}
    </div>
  );
}

export default LoggedInPage;
