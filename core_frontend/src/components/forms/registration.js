import React, {useState} from "react";

function RegistrationForm (props) {

    return(
        <div class="form-container-2">

        <h3>Register As User</h3>
        <p className="error-text">{props.errorText}</p>

        <form class="form" onSubmit={props.handleRegister}>
          <label class="form-label">First Name</label>
          <input class="form-input" type="text" data-test="firstName" value={props.firstName} onChange={(e) => props.setFirstName(e.target.value)} />

          <label class="form-label">Last Name</label>
          <input class="form-input" type="text" data-test="lastName" value={props.lastName} onChange={(e) => props.setLastName(e.target.value)} />

          <label class="form-label">Email</label>
          <input class="form-input" type="text" data-test="username" value={props.username} onChange={(e) => props.setUsername(e.target.value)} />

          <label class="form-label">Password</label>
          <input class="form-input" type="password" data-test="password" value={props.password} onChange={(e) => props.setPassword(e.target.value)} />
          <label class="form-label">Confirm Password</label>
          <input class="form-input" type="password" data-test="password" value={props.confirmPassword} onChange={(e) => props.setConfirmPassword(e.target.value)} />

          <input class="form-button" type="submit" value="Register" data-test="submit" />
        </form>
      </div>
  );
}

export default RegistrationForm;
