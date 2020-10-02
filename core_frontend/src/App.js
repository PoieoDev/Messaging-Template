import React, { useState, useEffect, useRef } from 'react';
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
  const [userID, setUserID] = useState("");
  const [lastName, setLastName] = useState("");
  const [formType, setFormType] = useState("login")
  const [errorText, setErrorText] = useState("")
  const [chatMessage, setChatMessage] = useState("")
  const emailRe = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const passRe = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  const [listMessages, setListMessages] = useState([])
  const [rooms, setRooms] = useState([])
  const [selectedRoomID, setSelectedRoomID] = useState(0)
  const ws = useRef(null)

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
        console.warn(json)
        setFirstName(json.user.first_name)
        setUsername(json.user.email)
        setUserID(json.user.id)
        connect(json.user.email)

      })
      .catch(error => {
        console.warn(error);
      });
    } else if (userAuthenticated===true) {
        if (window.location.pathname !== "/LoggedIn") {
          window.location = "/LoggedIn"

        }

      } else {
        if (window.location.pathname !== "/") {
          window.location = "/"
        }
      }
  });

  function connect (username) {
    ws.current = new WebSocket(`ws://localhost:8000/ws/?token=${localStorage.getItem('token')}`)
    waitForSocketConnection(() => {
      try {
        ws.current.send(JSON.stringify({ command: 'init_chat'}));
        console.warn("SENT")
      }
      catch(err) {
        console.log(err.message);
      }
    })
    ws.current.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log('connected')
    }

    ws.current.onmessage = evt => {
      let data = JSON.parse(evt.data)
      console.warn(evt)
      var evt_command = data['command'].toString()

      switch (evt_command){
        case 'init_chat' :
          initialize(data);
          break;
        case 'message':
          initMessages(data);
          break;
        case 'new_message':
          addMessage(data);
          break;
        default:
          console.log("Error decifering return command", evt_command);
      }


      // on receiving a message, add it to the list of messages
      //const message = JSON.parse(evt.data)
      //addMessage(message)
    }
    ws.current.onerror = e => {
      console.log("ERROR", e.message);
    }

    ws.current.onclose = () => {
      console.log('disconnected')

      }
  }

  function initialize(msg) {

    switch (msg['message'].toString()) {
      case 'success':
        setRooms(msg['rooms'])
        setSelectedRoomID(msg['rooms'][0][0])
        getMessages(msg['rooms'][0][0])
        break;
      default:
        console.error('Init Error', msg['message'])
    }

  }


  function waitForSocketConnection(callback){
   const socket = ws.current;
   const recursion = waitForSocketConnection;
   setTimeout(
     function () {
       if (socket.readyState === 1) {
         console.log("Connection is made")
         if(callback != null){
           callback();
         }
         return;

       } else {
         console.log("wait for connection...")
         recursion(callback);
       }
     }, 1); // wait 5 milisecond for the connection...
  }

  function initMessages (data) {
    setListMessages(data['messages'])
    var element = document.getElementById("chat-container");
    element.scrollTop = element.scrollHeight;
    }

  function addMessage (data) {
    setListMessages(oldArray => [...oldArray, data['message']]);
    var element = document.getElementById("chat-container");
    element.scrollTop = element.scrollHeight;
    }

  function handleRegister (e) {
    e.preventDefault();
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
            setUserID(json.user.id)
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
          setUserID(json.user_id)
          window.location = "/LoggedIn"
          clearState()
          connect(json.user_id)
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

  function getMessages (room_id) {

    try {
      ws.current.send(JSON.stringify({ command: 'fetch_messages', 'room_id':room_id}));
    }
    catch(err) {
      console.log(err.message);
    }
  }

  function sendMessage () {
    try {
      ws.current.send(JSON.stringify({ command: 'new_message', 'room_id':selectedRoomID, 'text':chatMessage}));
      setChatMessage("")
    }
    catch(err) {
      console.log(err.message);
    }
  }

  return (
    <Router>
        <Switch>
        <Route path="/LoggedIn">
        <LoggedInPage
          userAuthenticated={userAuthenticated}
          firstName={firstName}
          handleLogout={handleLogout}
          setChatMessage={setChatMessage}
          chatMessage={chatMessage}
          sendMessage={sendMessage}
          listMessages={listMessages}
          username={username}
          getMessages={getMessages}
          rooms={rooms}
          setListMessages={setListMessages}
          setSelectedRoomID={setSelectedRoomID}/>
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
