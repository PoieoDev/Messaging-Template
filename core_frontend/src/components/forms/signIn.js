import React from "react";

function SignInForm (props) {

  return(
    <div class="form-container">

      <h3 class="form-h3">Login As User</h3>
      <p className="error-text">{props.errorText}</p>

      <form class="form" onSubmit={props.handleSignIn}>
        <label class="form-label">Email</label>
        <input class="form-input" type="text" data-test="username" value={props.username} onChange={(e) => props.setUsername(e.target.value)} />

        <label class="form-label">Password</label>
        <input class="form-input" type="password" data-test="password" value={props.password} onChange={(e) => props.setPassword(e.target.value)} />

        <input class="form-button" type="submit" value="Log In" data-test="submit" />
      </form>
    </div>
  );
}

export default SignInForm;
