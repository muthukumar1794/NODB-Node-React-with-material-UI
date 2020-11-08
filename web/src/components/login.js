import React, { Component } from "react";
import Axios from "axios";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { apiHost, apiBase } from "../App";
import { Button } from "@material-ui/core";
import { alertStyle, searchFormsAlignment, bg } from "../App";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import _ from "lodash";

export class login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      refreshRedirect: null,
      errorHolder: null,
    };
  }
  onchange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  componentDidUpdate() {
    if (this.state.errorHolder) {
      setTimeout(() => this.setState({ errorHolder: null }), 3000);
    }
  }
  submitForm = (e) => {
    const { email, password } = this.state;
    e.preventDefault();
    if (!email || !password) {
      this.setState({
        errorHolder: "Both fields are mandatory",
      });
      return;
    }
    return Axios.post(`${apiBase}/api/login/user`, this.state)
      .then((response) => {
        if (response.data.message == "Success") {
          localStorage.setItem(
            "userdata",
            JSON.stringify(response.data.data.email)
          );
          localStorage.setItem(
            "token",
            JSON.stringify(response.data.data.token)
          );
          this.setState({
            refreshRedirect: true,
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
  renderRedirect = () => {
    if (this.state.refreshRedirect) {
      return <Redirect to="/" />;
    }
  };

  render() {
    const { email, password, errorHolder } = this.state;
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
          <h2 className="text-center">Login Form</h2>

          <form
            method="post"
            noValidate
            className="form-horizontal"
            onSubmit={this.submitForm}
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
                  value={email}
                  required
                  className="col-sm-4"
                  onChange={this.onchange}
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="psw"
                  className="col-sm-4 control-label text-center"
                >
                  <b>Password</b>
                </label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  name="password"
                  value={password}
                  required
                  className="col-sm-4"
                  onChange={this.onchange}
                />
              </div>

              <div className="form-group">
                <Button className="btn btn-success" type="submit">
                  Login
                </Button>
              </div>
            </div>
          </form>
          <div className="text-center col-md-12 form-group">
            <p>New user?</p>
            <span>
              <Link to="/signup/form" className="">
                Sign Up
              </Link>
            </span>
          </div>
        </div>
        {this.renderRedirect()}
      </>
    );
  }
}

export default login;
