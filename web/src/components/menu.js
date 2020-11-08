import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

export const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

export const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

export const bgcolour = {
  background: "#fbfeff",
};
export const bgcolourContacts = {
  marginTop: "2px",
  background: "#fbfeff",
};
export const dotButton = {
  backgroundColor: "transparent",
  color: "black",
  boxShadow: "unset",
  fontSize: "13px",
  padding: "0",
};

export const addbutton = {
  fontSize: "13px",
  padding: "0px",
  margin: "8px 6px",
  color: "#333",
  backgroundolor: "#ffffff",
  backgroundImage: "none",
  borderolor: "#eaeaea",
  boxhadow: "unset",
  border: "1px solid #eaeaea",
  background: "white",
};
export const filterbutton = {
  fontSize: "13px",
  padding: "0px",
  margin: "8px 6px",
  color: "#333",
  backgroundolor: "#ffffff",
  backgroundImage: "none",
  borderolor: "#eaeaea",
  boxhadow: "unset",
  border: "1px solid #eaeaea",
  background: "white",
  boxShadow: "0 0 black",
};
export const filterAlignment = {
  marginRight: "4px",
  marginBottom: "2px",
};
