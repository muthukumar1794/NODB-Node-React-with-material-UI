import logo from "./logo.svg";
import "./App.css";

import { BrowserRouter as Router } from "react-router-dom";
import Login from "./components/login";
import Signup from "./components/signup";
import { Route } from "react-router-dom";
import Index from "./components/index";
import Logout from "./components/logout";

export const apiHost = 5200;
export const apiBase = `http://localhost:${apiHost}`;

export const bg = {
  margin: "12px",
  textAlign: "center",
};

export const searchFormsAlignment = {
  textAlign: "center",
  margin: "11px 0",
};
export const alertStyle = {
  top: "15%",
  width: "450px",
  position: "absolute",
  zIndex: "9",
  right: "4.4%",
};
function App() {
  return (
    <Router>
      <div className="App">
        <Route path="/" exact strict>
          <Index />
        </Route>
        <Route path="/login/form" exact component={Login} />
        <Route path="/signup/form" exact component={Signup} />
        <Route path="/user/logout" exact component={Logout} />
      </div>
    </Router>
  );
}

export default App;
