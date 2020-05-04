import React from 'react'

class Login extends React.Component {
  render () {
    return (
      <div className='loginback'>
        <div className='loginwrap'>
          <div id='login' className='login'>
            <form action='/auth/login' method='post'>
              <div className='headingBlock'>
                <div className='heading'>
                  <span className='heading'>League Resources login</span>
                </div>
              </div>
              <div className='entryBlock'>
                <div className='entryField'>
                  <span>Username:</span>
                </div>
                <div className='entryField'>
                  <input id='username' name='username' className='loginCredentials' />
                </div>
              </div>
              <div className='entryBlock'>
                <div className='entryField'>
                  <span>Password:</span>
                </div>
                <div className='entryField'>
                  <input id='password' name='password' type='password' className='loginCredentials' />
                </div>
              </div>
              <div className='buttonBlock'>
                <input type='submit' value='Log in' className='loginButton' />
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
