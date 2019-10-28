import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import AuthContext from "./context/authContext";
import { MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import responsiveFontSizes from "@material-ui/core/styles/responsiveFontSizes";

//navbar
import Navbar from "./components/navbar";
//pages
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";

let theme = createMuiTheme({
  palette: {
    primary: {
      light: "#33c9dc",
      main: "#00bcd4",
      dark: "#008394",
      contrastText: "#fff"
    },
    secondary: {
      light: "#30007c",
      main: "#30007c",
      dark: "#30007c",
      contrastText: "#fff"
    }
  }
});

theme = responsiveFontSizes(theme);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }

  authChange = token => {
    this.setState({ user: token });
  };

  render() {
    return (
      <AuthContext.Provider value={this.state.user}>
        <MuiThemeProvider theme={theme}>
          <div className="app">
            <BrowserRouter>
              <Route
                path="/"
                render={props => (
                  <Navbar {...props} authChange={this.authChange} />
                )}
              />
              <div className="container">
                <Switch>
                  <Route
                    path="/login"
                    render={props => (
                      <Login {...props} authChange={this.authChange} />
                    )}
                  />
                  <Route exact path="/" component={Home} />
                  <Route
                    path="/signup"
                    render={props => (
                      <Signup {...props} authChange={this.authChange} />
                    )}
                  />
                </Switch>
              </div>
            </BrowserRouter>
          </div>
        </MuiThemeProvider>
      </AuthContext.Provider>
    );
  }
}

export default App;
