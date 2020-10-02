import React, {useEffect} from 'react';

import Logo from '../media/logo.png';

function LoggedInPage(props) {


  function change_user (ind) {
    props.setSelectedRoomID(props.rooms[ind][0])
    props.getMessages(props.rooms[ind][0])
  }

  return (
    <div className="logged-in-page">
      <div className="logged-in-page-body">
        <div className="col1 cspan2 row1">
          <img src={Logo} className="App-logo" alt="logo" />
        </div>
        <div className="col11 cspan2 row1 align-right">
          <h6 onClick={(e) => props.handleLogout(e)}>LOGOUT</h6>
        </div>

        <div className="col3 cspan2 row3 users-list align-center">
        {props.rooms.map((val, ind) => {
          if (val.length === 3){
            if (!(val[1][3] == props.username)){
              return(
                <div className="single-user" onClick={() => change_user(ind)}>
                  <p className="user-name-p">{val[1][1]} {val[1][2]}</p>
                  <p className="user-email-p">{val[1][3]}</p>
                </div>
                )
              } else {
                return(
                  <div className="single-user" onClick={() => change_user(ind)}>
                    <p className="user-name-p">{val[2][1]} {val[2][2]}</p>
                    <p className="user-email-p">{val[2][3]}</p>
                  </div>
                  )

              }
            } else {
              if (val[1][3] == props.username){
                return (
                  <div className="single-user" onClick={() => change_user(ind)}>
                    <p className="multi-user-name-p">{val[2][1]}{val.slice(3).map((inner_val, inner_ind) => {
                        return(`, ${inner_val[1]}`);})} </p>
                  </div>
                )} else {
                  return(
                  <div className="single-user" onClick={() => change_user(ind)}>
                    <p className="multi-user-name-p">{val[1][1]}{val.slice(2).map((inner_val, inner_ind) => {
                        if (!(inner_val[3] == props.username)){
                          return(`, ${inner_val[1]}`);
                        }
                      }
                    )
                  }
                    </p>
                  </div>
                )
                }

            }
      })}
        </div>
        <div className="col3 cspan8 row2">

          <h3>Welcome, {props.firstName}!</h3>
          </div>
        <div className="col5 cspan6 row3 chat-section">
          <div className="chat-container" id="chat-container">
          {
            (props.listMessages.length > 0)? (props.listMessages.map((val, ind) => {

            let lastDate = new Date(val[3])
            if (ind > 0){
              lastDate = new Date(props.listMessages[ind - 1][3])
           }

            let date = new Date(val[3])
            if (!(val[1] === props.username)) {
              return(
                <div>
                {(date - lastDate > 100000 || ind === 0)?<p className="time">{date.toLocaleString()}</p>:<p />}
                <p className="indiv-message align-left">{val[2]}</p>
                </div>
              )
            } else {
              return(
                <div>
                {(date - lastDate > 100000 || ind === 0)?<p className="time">{date.toLocaleString()}</p>:<p />}
                <p className="indiv-message align-right">{val[2]}</p>
                </div>
              )
            }


          })) :
          <p className="indiv-message">No Messages</p>
        }

          </div>
          <div className="send-container">
          <textarea className="col1" name="chat_message" placeholder="Enter Message" value={props.chatMessage} onChange={(e) => props.setChatMessage(e.target.value)} />
          <h6 className="col2" onClick={() => props.sendMessage()}>Send!</h6>
          </div>
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

export default LoggedInPage;
