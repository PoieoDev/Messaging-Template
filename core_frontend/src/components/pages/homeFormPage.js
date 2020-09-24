import React, { useState } from 'react';
import { Link } from "react-router-dom";

import SignInForm from "../forms/signIn";
import RegistrationForm from "../forms/registration";
import Logo from '../media/logo.png';

function HomeFormPage (props) {

  function formSwitch() {
    switch(props.formType) {
      case 'login':
        return(<SignInForm
          setUsername={props.setUsername}
          username={props.username}
          setPassword={props.setPassword}
          password={props.password}
          handleSignIn={props.handleSignIn}
          errorText={props.errorText}/>);
      case 'register':
        return(<RegistrationForm
          handleRegister={props.handleRegister}
          setUsername={props.setUsername}
          username={props.username}
          setPassword={props.setPassword}
          password={props.password}
          setConfirmPassword={props.setConfirmPassword}
          confirmPassword={props.confirmPassword}
          firstName={props.firstName}
          setFirstName={props.setFirstName}
          lastName={props.lastName}
          setLastName={props.setLastName}
          errorText={props.errorText}/>);
      default:
        window.location = "/";
    }
  }

  return (
    <div class="home-page">
      <div class="home-page-body">
        <div className="col1 cspan2 row1">
            <img src={Logo} className="App-logo" alt="logo" />
        </div>
        <div className="col12 row1">
          <h6 className="logout-btn" onClick={(e) => props.handleChangeForm(e)}>{(props.formType === "login")? "Register!" : "Login!"}</h6>
        </div>
        <div class="col3 cspan8 row2">
          {formSwitch()}
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
    </div>
  );
}

export default HomeFormPage;
