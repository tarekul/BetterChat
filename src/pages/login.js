import React, { Component } from "react";
import axios from "axios";
import AuthContext from "../context/authContext";

import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = {
  form: {
    textAlign: "center"
  },
  textField: {
    margin: "10px auto 10px auto"
  },
  customError: {
    color: "red",
    fontSize: "0.8rem"
  }
};
class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {},
      loading: false
    };
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { email, password } = this.state;
    this.setState({ loading: true });
    axios
      .post("/login", {
        email,
        password
      })
      .then(res => {
        this.props.authChange(res.data);
        this.setState({ loading: false });
        this.props.history.push("/");
      })
      .catch(err => {
        console.log(err);
        this.setState({ errors: err.response.data, loading: false });
      });
  };

  render() {
    const { classes } = this.props;
    const { email, password, errors, loading } = this.state;
    return (
      <AuthContext.Consumer>
        {user => {
          if (!user) {
            return (
              <>
                <Grid container className={classes.form}>
                  <Grid item md={4} sm={3} xs={1}></Grid>
                  <Grid item md={4} sm={6} xs={10}>
                    <Typography variant="h3">Login</Typography>
                    <form noValidate onSubmit={this.handleSubmit}>
                      <TextField
                        className={classes.textField}
                        name="email"
                        type="email"
                        label="Email"
                        onChange={this.handleChange}
                        value={email}
                        error={errors.email ? true : false}
                        helperText={errors.email}
                        fullWidth
                      />
                      <TextField
                        className={classes.textField}
                        name="password"
                        type="password"
                        label="Password"
                        onChange={this.handleChange}
                        value={password}
                        error={errors.password ? true : false}
                        helperText={errors.password}
                        fullWidth
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                      >
                        {loading ? <CircularProgress size={30} /> : "login"}
                      </Button>
                      {errors.general && (
                        <Typography
                          className={classes.customError}
                          variant="body2"
                        >
                          {errors.general}
                        </Typography>
                      )}
                    </form>
                  </Grid>
                  <Grid item md={4} sm={3} xs={1}></Grid>
                </Grid>
              </>
            );
          }
        }}
      </AuthContext.Consumer>
    );
  }
}

export default withStyles(styles)(Login);
