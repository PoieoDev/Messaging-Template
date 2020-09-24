import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";

import HomeFormPage from './components/pages/homeFormPage.js'
import LoggedInPage from './components/pages/loggedIn.js'

import './App.css';

function App() {
  const domain = "http://localhost:8000"; // Domain for API connection. In this case, Django
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [userType, setUserType] = useState("user");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [formType, setFormType] = useState("login")
  const [errorText, setErrorText] = useState("")
  const emailRe = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const passRe = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;


  useEffect(() => {
    if (localStorage.getItem('token') !== null && userAuthenticated == false) {
      fetch(`${domain}/api_v1.0/user/login-user/`, {
        headers: {
          Authorization: `JWT ${localStorage.getItem('token')}`
        }
      })
      .then(res => {
        if(res.ok) {
          setUserAuthenticated(true)
          return res.json();
        }
      })
      .then(json => {
        setFirstName(json.user.first_name)
      })
      .catch(error => {
        console.warn(error);
      });
    } else if (userAuthenticated===true) {
        if (window.location.pathname !== "/LoggedIn") {
          window.location = "/LoggedIn"
        }
      }
  });

  function handleRegister (e) {
    e.preventDefault();
    console.warn("FIRST", firstName.length)
    if (firstName.length < 3) {
      setErrorText("Please enter your first name")
    } else if (lastName.length < 3) {
      setErrorText("Please enter your last name")
    } else if (!emailRe.test(username)) {
      setErrorText("Email is Invalid")
    } else if (!passRe.test(password)){
      setErrorText("Password must be between 6 and 20 characters long and contain at least one numeric digit, one uppercase and one lowercase letter")
    } else if (password !== confirmPassword) {
      setErrorText("Passwords do not match")
    } else {
      setErrorText("")

      let regData = {"username":username.toLowerCase(), "email":username.toLowerCase(), "first_name":firstName, "last_name":lastName, "password":password, "extUser":{"user_type":userType}}

      fetch(`${domain}/api_v1.0/user/create-user/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(regData)
      })
      .then(res => {
        if(res.ok) {
          setUserAuthenticated(true)
          return res.json();
        } else {
          setErrorText("Invalid Inputs")
        }
      })
      .then(json => {
        if (json.non_field_errors){
          setUserAuthenticated(false)
          setErrorText("Invalid Inputs")
        } else {
            localStorage.setItem('token', json.user.token);
            window.location = "/LoggedIn"
            clearState()
          }
      })
      .catch(error => {
        console.warn(error)
      })
    }
  }

  function handleSignIn (e) {
    e.preventDefault();

    if (errorText !== "") {
      setErrorText("")
    }

    if (errorText === "") {
      fetch(`${domain}/api_v1.0/user/login-user/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"username":username.toLowerCase(), "password":password})
      })
      .then(res => {
        if(res.ok) {
          setUserAuthenticated(true)
          return res.json();
        } else {
          setErrorText("Username or Password Incorrect")
        }
      })
      .then(json => {
        if (json.non_field_errors){
          setUserAuthenticated(false)
          setErrorText("Username or Password Incorrect")
        } else {
          localStorage.setItem('token', json.token);
          setUserAuthenticated(true)
          setFirstName(json.first_name)
          window.location = "/LoggedIn"
          clearState()
      }})
      .catch(error => {
          setUserAuthenticated(false);
      });
    }
  }

  function clearState() {
    setPassword("")
    setConfirmPassword("")
    setFormType("login")
    setLastName("")
    setUsername("")
  }

  function handleLogout(e) {
    e.preventDefault()

    localStorage.removeItem("token")
    setUserAuthenticated(false)
    window.location = "/"
  }

  function handleChangeForm(e) {
    e.preventDefault()
    setErrorText("")
    if (formType === "login") {
      setFormType("register")
    } else {
      setFormType("login")
    }
  }

  return (
    <Router>
        <Switch>
        <Route path="/LoggedIn">
        <LoggedInPage
          userAuthenticated={userAuthenticated}
          firstName={firstName}
          handleLogout={handleLogout}/>
        </Route>
        <Route path="/">
        <HomeFormPage
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          formType={formType}
          setFormType={setFormType}
          handleSignIn={handleSignIn}
          handleRegister={handleRegister}
          errorText={errorText}
          handleChangeForm={handleChangeForm}/>
        </Route>
        </Switch>
        </Router>

  );
}

export default App;
