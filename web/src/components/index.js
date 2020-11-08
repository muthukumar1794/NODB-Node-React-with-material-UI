import React, { Component } from "react";
// import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import Axios from "axios";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import { apiBase, apiHost } from "../App";
import { Redirect } from "react-router";
import _ from "lodash";
import { Button, Input } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import Menu from "@material-ui/core/Menu";
import Menus from "./menu";
import MenuItem from "@material-ui/core/MenuItem";
import { alertStyle, searchFormsAlignment, bg } from "../App";
import {
  StyledMenu,
  StyledMenuItem,
  bgcolour,
  bgcolourContacts,
  dotButton,
  addbutton,
  filterbutton,
  filterAlignment,
} from "./menu";

class index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openform: null,
      anchorEl: null,
      openError: false,
      errorHolder: null,
      usersData: [],
      user_id: null,
      name: "",
      number: "",
      location: "",
      incomingCallCount: "",
      outgoingCallCount: "",
      createdDate: "",
      updatedpath: "",
      show: false,
      deleteUser: null,
      deleteShow: false,
      filter: "",
      search: "",
      loggedUser: JSON.parse(localStorage.getItem("userdata")),
      token: JSON.parse(localStorage.getItem("token")),
      createdProduct: false,
      logout: false,
    };
    this.russian = React.createRef();
    this.childRef = React.createRef();
    this.handleClickMenu = this.handleClickMenu.bind(this);
  }
  onchange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  submitForm = (e) => {
    e.preventDefault();
    const headers = { "auth-token": this.state.token };
    let req_url;

    this.state.user_id
      ? (req_url = `${apiBase}/api/edit-user`)
      : (req_url = `${apiBase}/api/add-user`);

    Axios.post(req_url, this.state, { headers })
      .then((response) => {
        if (response.data.message == "success") {
          this.setState({
            user_id: null,
            name: "",
            number: "",
            location: "",
            incomingCallCount: "",
            outgoingCallCount: "",
            createdDate: "",
            updatedpath: "/",
            show: false,
          });
          Axios.get(`${apiBase}/api/users`, { headers })
            .then((response) => {
              this.setState({
                usersData: response.data.data,
              });
            })
            .catch((err) => {
              console.log("error", err);
            });
        }
      })
      .catch((err) => {
        console.log("error", err);
        this.setState({
          errorHolder: err.response.data.data,
        });
      });
  };
  logOut = () => {
    localStorage.removeItem("userdata");
    localStorage.removeItem("token");

    this.setState({
      user_id: null,
      name: "",
      number: "",
      location: "",
      incomingCallCount: "",
      outgoingCallCount: "",
      createdDate: "",
      deleteUser: null,
      deleteShow: false,
      show: false,
      logout: true,
    });
  };
  handleClose = () => {
    this.setState({
      user_id: null,
      name: "",
      number: "",
      location: "",
      incomingCallCount: "",
      outgoingCallCount: "",
      createdDate: "",
      show: false,
      deleteUser: null,
      deleteShow: false,
    });
  };
  handleDelete = (e) => {
    const DeleteUserID = e.target.attributes.dataid.nodeValue;
    this.setState({
      deleteUser: DeleteUserID,
      deleteShow: true,
    });
  };
  submitDeleteForm = (e) => {
    e.preventDefault();
    const headers = { "auth-token": JSON.parse(localStorage.getItem("token")) };
    Axios.delete(`${apiBase}/api/delete-user/${this.state.deleteUser}`, {
      headers,
    })
      .then((res) => {
        Axios.get(`${apiBase}/api/users`, { headers }).then((response) => {
          this.setState({
            usersData: response.data.data,
          });
        });
        this.setState({
          deleteUser: null,
          deleteShow: false,
        });
      })
      .catch((err) => {
        this.setState({
          errorHolder: err.response.data.data,
        });
      });
  };
  handleShow = (e) => {
    const actionType = e.target.attributes.dataaction.nodeValue;
    if (actionType == "Edit") {
      const UserID = e.target.attributes.dataid.nodeValue;
      const headers = {
        "auth-token": JSON.parse(localStorage.getItem("token")),
      };
      Axios.get(`${apiBase}/api/edit-user/${UserID}`, { headers })
        .then((response) => {
          this.setState({
            user_id: response.data.user.id,
            name: response.data.user.name,
            number: response.data.user.number,
            location: response.data.user.location,
            incomingCallCount: response.data.user.incomingCallCount,
            outgoingCallCount: response.data.user.outgoingCallCount,
            createdDate: response.data.user.createdDate,
            show: true,
          });
        })
        .catch((err) => {
          if (!err) {
            this.setState({
              errorHolder: "something went wrong",
            });
          } else {
            this.setState({
              errorHolder: err.response.data.data,
            });
          }
        });
    } else {
      this.setState({
        show: true,
      });
    }
  };
  submitSearceForm = (e) => {
    e.preventDefault();
    
    let requiredData;
    e.target.dataset.type == "filter"
      ? (requiredData = this.state.filter)
      : (requiredData = this.state.search);
    const headers = { "auth-token": JSON.parse(localStorage.getItem("token")) };
    Axios.get(`${apiBase}/api/get/search-data/${requiredData}/`, {
      params: {
        querytype: e.target.dataset.type,
      },
      headers,
    })

      .then((response) => {
        if (_.isArray(response.data.data)) {
          this.setState({
            usersData: response.data.data,
          });
        } else {
          this.setState({
            usersData: [response.data.data],
          });
        }
      })
      .catch((err) => {
        if (!err) {
          this.setState({
            errorHolder: "something went wrong",
          });
        } else {
          this.setState({
            errorHolder: err.response.data.data || "something went wrong",
          });
        }
      });
  };
  componentDidMount() {
    if (localStorage.getItem("userdata")) {
      const headers = {
        "auth-token": JSON.parse(localStorage.getItem("token")),
      };
      Axios.get(`${apiBase}/api/users`, { headers })
        .then((response) => {
          this.setState({
            usersData: response.data.data,
          });
        })
        .catch((err) => {
          this.setState({
            errorHolder: err.response.data.data,
          });
        });
    }
  }
  handleClear = (e) => {
    e.preventDefault();
    const headers = { "auth-token": JSON.parse(localStorage.getItem("token")) };
    Axios.get(`${apiBase}/api/users`, { headers })
      .then((response) => {
        this.setState({
          filter: "",
          search: "",
          usersData: response.data.data,
        });
      })
      .catch((err) => {
        this.setState({
          search: "",
          filter: "",
        });
        this.setState({
          errorHolder: err.response.data.data,
        });
      });
  };

  handleShowfilter = (event) => {
    this.setState({
      openform: event.target,
    });
  };
  handleCloseForm = () => {
    this.setState({
      openform: null,
    });
  };
  handleClickMenu = (event) => {
    this.setState({
      anchorEl: event.target,
    });
  };
  handleCloseMenu = () => {
    this.setState({
      anchorEl: null,
    });
  };

  componentDidUpdate() {
    if (this.state.errorHolder) {
      setTimeout(() => this.setState({ errorHolder: null }), 3000);
    }
  }
  render() {
    const {
      openError,
      filter,
      search,
      name,
      number,
      location,
      incomingCallCount,
      outgoingCallCount,
      createdDate,
      loggedUser,
      usersData,
      logout,
      errorHolder,
      anchorEl,
      openform,
    } = this.state;
    if (logout) {
      return <Redirect to="/" />;
    }
    if (errorHolder) {
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

        <div className="entire-container container">
          <nav
            className="navbar navbar-default col-md-12"
            style={{ marginBottom: "0px", backgroundColor: "white" }}
          >
            <div>
              <div className="navbar-header">
                <form
                  noValidate
                  className="form-horizontal"
                  style={searchFormsAlignment}
                  onSubmit={this.submitSearceForm}
                  encType="form-data"
                  data-type="search"
                  className="col-md-12"
                >
                  <div className="form-group">
                  <Input
                      type="text"
                       placeholder="Search By Name"
                      name="search"
                       value={search}
                      required
                       className="col-sm-6"
                      onChange={this.onchange}
                    />

                    <Button
                      type="submit"
                      className="col-sm-3 btn btn-success col-sm-4"
                    >
                      Search
                    </Button>
                    <Button
                      onClick={this.handleClear}
                      type="button"
                      className=" btn btn-success col-sm-3"
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              </div>

              <div style={{ textAlign: "right" }}>
                <span style={{ display: "inline-block", marginTop: "14px" }}>
                  <i className="fa fa-user-o" aria-hidden="true"></i>{" "}
                  <Button
                    style={dotButton}
                    aria-controls="customized-menu"
                    aria-haspopup="true"
                    variant="contained"
                    color="primary"
                    onClick={this.handleClickMenu}
                    ref={this.childRef}
                  >
                    {loggedUser ? loggedUser : "Explore"}
                    <span className="caret"></span>
                  </Button>
                  <Menu
                    id="simple-menu"
                    className="wwww"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={this.handleCloseMenu}
                  >
                    {loggedUser ? (
                      <MenuItem onClose={this.handleCloseMenu}>
                        <Link to="/user/logout" onClick={this.logOut}>
                          <i className="fa fa-power-off" aria-hidden="true"></i>
                          Logout
                        </Link>
                      </MenuItem>
                    ) : (
                      <MenuItem onClose={this.handleCloseMenu}>
                        {" "}
                        <Link to="login/form">Login</Link>
                      </MenuItem>
                    )}
                  </Menu>
                </span>
              </div>
            </div>
          </nav>
          <div>
            <span>
              <span className="col-md-4" style={bgcolourContacts}>
                <span style={{ display: "inline-block" }}>
                  <h3 style={{ marginTop: "11px", color: "#584aad" }}>
                    Contacts{" "}
                  </h3>
                </span>
                <span style={{ display: "inline-block" }}>
                  <p>- {usersData.length} total</p>
                </span>
              </span>

              <span
                className="col-md-8"
                style={
                  (bgcolour,
                  {
                    float: "right",
                    textAlign: "right",
                    background: "rgb(251, 254, 255)",
                  })
                }
              >
                <a
                  type="button"
                  className="btn btn-default list-view active"
                  id="list_tab"
                  href=""
                  aria-controls="home"
                  role="tab"
                  data-toggle="tab"
                  aria-expanded="true"
                >
                  <span className="fa fa-list-ul" aria-hidden="true"></span>
                </a>

                <Button
                  style={filterbutton}
                  aria-controls="customized-menu-filter"
                  aria-haspopup="true"
                  variant="contained"
                  color="primary"
                  className="filterbutton"
                  onClick={this.handleShowfilter}
                >
                  <i
                    className="fa fa-filter"
                    style={filterAlignment}
                    aria-hidden="true"
                  ></i>{" "}
                  Filter
                </Button>
                <StyledMenu
                  id="customized-menu-filter"
                  openform={openform}
                  keepMounted
                  open={Boolean(openform)}
                  onClose={this.handleCloseForm}
                >
                  <StyledMenuItem>
                    <form
                      noValidate
                      className="filter"
                      onSubmit={this.submitSearceForm}
                      data-type="filter"
                      encType="form-data"
                    >
                      <div className="form-group">
                        <Input
                          type="text"
                          placeholder="Filter By Location"
                          name="filter"
                          value={filter}
                          required
                          onChange={this.onchange}
                        />

                        <Button type="submit" className=" btn btn-success  ">
                          filter
                        </Button>
                        <Button
                          onClick={this.handleClear}
                          data-type="filter"
                          type="button"
                          className=" btn btn-success "
                        >
                          Reset
                        </Button>
                      </div>
                    </form>
                  </StyledMenuItem>
                </StyledMenu>
                <a
                  dataaction="create "
                  className="create"
                  onClick={this.handleShow}
                >
                  <span
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Create User"
                    data-original-title="Create"
                    style={(addbutton, { display: "inline-block" })}
                  >
                    <i className="fa fa-user-o" aria-hidden="true"></i>
                  </span>{" "}
                  Add Contact
                </a>
              </span>
            </span>
            {this.state.loggedUser ? (
              <div className="col-md-12" style={bgcolour}>
                <div className="table-responsive" style={{ display: "block" }}>
                  <table className="table ">
                    <thead>
                      <tr>
                        <th className="text-center">Name</th>
                        <th className="text-center">Created Date</th>
                        <th className="text-center">Number</th>
                        <th className="text-center">Incoming Call Count</th>
                        <th className="text-center">Location</th>
                        <th className="text-center">Outgoing Call Count</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <>
                        {_.isEmpty(usersData) != true ? (
                          usersData.map((u, index) => {
                            return (
                              <tr key={u.id} className="text-center tableTD">
                                <td>{u.name}</td>
                                <td>{u.createdDate}</td>
                                <td>{u.number}</td>
                                <td>{u.incomingCallCount}</td>
                                <td>{u.location}</td>
                                <td>{u.outgoingCallCount}</td>
                                <td>
                                  <div className="dropdown">
                                    <a
                                      className="btn btn-secondary dropdown-toggle"
                                      type="button"
                                      id="dropdownMenuButton"
                                      data-toggle="dropdown"
                                      aria-haspopup="true"
                                      aria-expanded="false"
                                    >
                                      ...
                                    </a>
                                    <div
                                      className="dropdown-menu drop-down-alignment"
                                      aria-labelledby="dropdownMenuButton"
                                    >
                                      <a
                                        className="text-primary"
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title="Edit"
                                        style={{
                                          fontSize: "1.5rem",
                                          marginRight: "5px",
                                        }}
                                        data-original-title="Edit"
                                        onClick={this.handleShow}
                                      >
                                        <i
                                          className="fa fa-edit"
                                          aria-hidden="true"
                                          dataid={u.id}
                                          dataaction="Edit"
                                        ></i>
                                      </a>
                                      <a
                                        className="text-danger"
                                        style={{ fontSize: "1.5rem" }}
                                      >
                                        <i
                                          data-toggle="tooltip"
                                          data-placement="top"
                                          title="Delete"
                                          className="fa fa-trash-o deleteicon"
                                          aria-hidden="true"
                                          data-original-title="Delete"
                                          dataid={u.id}
                                          onClick={this.handleDelete}
                                        ></i>
                                      </a>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td>data not found</td>
                          </tr>
                        )}
                      </>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              "You Are Not Authorized To See The Data"
            )}
          </div>
          <Modal
            isOpen={this.state.show}
            ariaHideApp={false}
            style={{
              overlay: {
                backgroundColor: "grey",
              },
              content: {
                left: "25%",
                right: "25%",
              },
            }}
          >
            <button type="button" className="close" onClick={this.handleClose}>
              &times;
            </button>
            <form
              method="post"
              noValidate
              className="form-horizontal"
              onSubmit={this.submitForm}
              encType="multipart/form-data"
            >
              <div className="form-group">
                <div className="form-group">
                  <label
                    htmlFor="Name"
                    className="col-sm-4 control-label text-center"
                  >
                    <b>Name</b>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Username"
                    name="name"
                    value={name}
                    required
                    className="col-sm-4"
                    onChange={this.onchange}
                  />
                </div>

                <div className="form-group">
                  <label
                    htmlFor="Number"
                    className="col-sm-4 control-label text-center"
                  >
                    <b>Number</b>
                  </label>
                  <input
                    type="number"
                    placeholder="Enter Number"
                    name="number"
                    value={number}
                    required
                    className="col-sm-4"
                    onChange={this.onchange}
                  />
                </div>
                <div className="form-group">
                  <label
                    htmlFor="Incoming Call Count"
                    className="col-sm-4 control-label text-center"
                  >
                    <b>Incoming Call Count</b>
                  </label>
                  <input
                    type="number"
                    placeholder="Enter Incoming Call Count"
                    name="incomingCallCount"
                    value={incomingCallCount}
                    required
                    className="col-sm-4"
                    onChange={this.onchange}
                  />
                </div>
                <div className="form-group">
                  <label
                    htmlFor="Location"
                    className="col-sm-4 control-label text-center"
                  >
                    <b>Location</b>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Location"
                    name="location"
                    value={location}
                    required
                    className="col-sm-4"
                    onChange={this.onchange}
                  />
                </div>
                <div className="form-group">
                  <label
                    htmlFor="outgoingCallCount"
                    className="col-sm-4 control-label text-center"
                  >
                    <b>Outgoing Call Count</b>
                  </label>
                  <input
                    type="number"
                    placeholder="Enter outgoingCallCount"
                    name="outgoingCallCount"
                    value={outgoingCallCount}
                    required
                    className="col-sm-4"
                    onChange={this.onchange}
                  />
                </div>

                <div className={`form-group`} style={bg}>
                  <button className="btn btn-success" type="submit">
                   {this.state.user_id?"Update":"Add"}
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={this.handleClose}
                    style={bg}
                  >
                    Close
                  </button>
                </div>
              </div>
            </form>
          </Modal>

          {/* ///delete modal///// */}

          <Modal
            isOpen={this.state.deleteShow}
            ariaHideApp={false}
            style={{
              content: {
                left: "35%%",
                right: "41%",
                bottom: "unset",
              },
            }}
          >
            <form
              noValidate
              className="form-horizontal"
              onSubmit={this.submitDeleteForm}
              encType="form-data"
              style={{ textAlign: "center" }}
            >
              <p>Are you sure want to Delete?</p>
              <button className="btn btn-success" type="submit">
                Yes
              </button>

              <button
                className="btn btn-danger"
                onClick={this.handleClose}
                style={bg}
              >
                No
              </button>
            </form>
          </Modal>
        </div>
      </>
    );
  }
}

export default index;
