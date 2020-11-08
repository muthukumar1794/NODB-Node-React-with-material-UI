import Axios from "axios";
import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { apiHost, apiBase } from "../App";
import Login from "./login";
import { Button } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import _ from "lodash";
import { alertStyle, searchFormsAlignment, bg } from "../App";

class Signup extends Component {
  constructor(props) {
    super();

    this.state = {
      errorHolder: null,
      email: "",
      password: "",
      confirmPassword: "",
      redirect: null,
    };
  }

  componentDidUpdate() {
    if (this.state.errorHolder) {
      setTimeout(() => this.setState({ errorHolder: null }), 3000);
    }
  }

  onchange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onsubmitForm = (e) => {
    e.preventDefault();
    return Axios.post(`${apiBase}/api/create/user`, this.state)
      .then((response) => {
        if (response.data.message === "Success") {
          // this.props.history.push('/signup/form');
          this.setState({
            redirect: "/user/login",
          });
        }
      })
      .catch((err) => {
        console.log("errr", err);
        this.setState({
          errorHolder: err.response.data.data || "not found",
        });
      });
  };

  render() {
    const { errorHolder, email, password, confirmPassword } = this.state;
    if (this.state.redirect) {
      return <Login />;
    }
    return (
      <>
        {errorHolder ? (
          <div style={alertStyle}>
            <Alert severity="error">
              <AlertTitle>Error!</AlertTitle>
              {errorHolder}
            </Alert>
          </div>
        ) : (
          ""
        )}
        <div className="centering-form">
          <h2 className="text-center">Signup Form</h2>

          <form
            onSubmit={this.onsubmitForm}
            method="post"
            noValidate
            className="form-horizontal"
          >
            <div className="imgcontainer form-group">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSN6PSb90rGnT4WTxYC7HBxNWs2Ig-mSP2b0g&usqp=CAU"
                alt="Avatar"
                className="avatar"
              />
            </div>

            <div className="form-group">
              <div className="form-group">
                <label
                  htmlFor="uname"
                  className="col-sm-4 control-label text-center"
                >
                  <b>Email</b>
                </label>
                <input
                  type="text"
                  placeholder="Enter Username"
                  name="email"
                  required
                  className="col-sm-4"
                  value={email}
                  onChange={this.onchange}
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="password"
                  className="col-sm-4 control-label text-center"
                >
                  <b>Password</b>
                </label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  name="password"
                  required
                  className="col-sm-4"
                  value={password}
                  onChange={this.onchange}
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="psw"
                  className="col-sm-4 control-label text-center"
                >
                  <b>Confirm Password</b>
                </label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={confirmPassword}
                  required
                  className="col-sm-4"
                  onChange={this.onchange}
                />
              </div>
              <div className="form-group">
                <Button className="btn btn-success" type="submit">
                  Signup
                </Button>
              </div>
              <div className="form-group"></div>
            </div>
          </form>
          <div className="text-center col-md-12 form-group">
            <p>Already a user?</p>
            <span>
              <Link to="/login/form">Login</Link>
            </span>
          </div>
        </div>
      </>
    );
  }
}
export default Signup;
