import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LoginModal from "./Signin";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

function User() {
  const [userName, setUserName] = useState<String | null>(
    localStorage.getItem("username")
  );

  const navigate = useNavigate();
  const [loginOpen, setLoginOpen] = useState<boolean>(false);

  React.useEffect(() => {
    setUserName(localStorage.getItem("username"));
  }, [loginOpen]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    setUserName(null);
  };
  return (
    <AppBar position="relative">
      <Container maxWidth="xl">
        <Toolbar disableGutters style={{ justifyContent: "space-between" }}>
          <AutoStoriesIcon
            sx={{
              display: { xs: "flex", md: "flex" },
              mr: 1,
              cursor: "pointer",
            }}
            onClick={() => {
              navigate("/");
            }}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "calibri",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LEARN BETTER
          </Typography>
          <Box sx={{ flexGrow: 0 }}>
            {userName === null ? (
              <Button color="inherit" onClick={() => setLoginOpen(true)}>
                Login
              </Button>
            ) : (
              <Button color="inherit" onClick={handleLogout}>
                {userName}, logout?
              </Button>
            )}
          </Box>
          {loginOpen ? (
            <LoginModal loginOpen={loginOpen} setLoginOpen={setLoginOpen} />
          ) : null}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default User;
