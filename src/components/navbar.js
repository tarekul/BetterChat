import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/authContext";
import Appbar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

class Navbar extends Component {
  handleClick = () => {
    console.log("clicked");
    this.props.authChange(null);
  };
  render() {
    return (
      <Appbar>
        <Toolbar className="nav-container">
          <AuthContext.Consumer>
            {user => {
              if (user) {
                return (
                  <>
                    <Button color="secondary" component={Link} to="/">
                      Home
                    </Button>
                    <Button color="secondary" onClick={this.handleClick}>
                      Logout
                    </Button>
                  </>
                );
              } else {
                return (
                  <>
                    <Button color="secondary" component={Link} to="/login">
                      Login
                    </Button>
                    <Button color="secondary" component={Link} to="/">
                      Home
                    </Button>
                    <Button color="secondary" component={Link} to="/signup">
                      Signup
                    </Button>
                  </>
                );
              }
            }}
          </AuthContext.Consumer>
        </Toolbar>
      </Appbar>
    );
  }
}

export default Navbar;
