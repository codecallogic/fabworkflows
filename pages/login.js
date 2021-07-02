
const Login = ({}) => {
  
  return (
    <div className="login">
      <div className="login-title">Login</div>
      <form className="form">
        <div className="form-group-single">
          <input type="email" />
        </div>
        <div className="form-group-single">
          <input type="password" />
        </div>
        <button className="form-button">sign in</button>
      </form>
    </div>
  )
}

export default Login
