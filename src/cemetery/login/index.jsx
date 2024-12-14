import { Button, Alert, Typography, Grid2 } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import LOGO from "../../assets/Buenavista-sm.png";
import BG from "../../assets/main-bg.jpg";
import { ROUTE_ADMIN, ROUTE_ADMIN_DASHBOARD, ROUTE_FINDER, ROUTE_REGISTRATION } from "../../constants";
import { useClientLoginMutation } from "../../service/clientService";
import { useState } from "react";
import { PageWrapper } from "../../shared";
import { PasswordField, SimpleField } from "../../shared/TextFields";
import "./login.css";
import { getUser } from "../../utility";

export const LoginPage = () => {
  const navigate = useNavigate();

  const [clientLoginRequest, { error, isLoading }] = useClientLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async () => {
    clientLoginRequest({
      email,
      password
    }).then((response) => {

      // console.log({ response })
      if (response?.data?.status == 200) {
        const user = getUser();
        console.log({ user })
        if (user?.accountType) {
          navigate("/cemetery/admin/dashboard");
        } else {
          navigate(ROUTE_FINDER);
        }
      }
    });
  };

  return (
    <PageWrapper
      config={{ bg: BG }}
      content={
        <div className="bg-text">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Grid2
              container
              size={12}
              justifyContent={"center"}
              width={"100%"}
              marginBottom={"18px"}
            >
              <img src={LOGO} height={110} />
            </Grid2>

            <Grid2 container>
              <Typography
                color="black"
                variant="body1"
                noWrap
                component="div"
                sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
              >
                BUENAVISTA, GUIMARAS
              </Typography>
            </Grid2>

            <Grid2 container>
              <Typography
                color="black"
                variant="h5"
                noWrap
                component="div"
                fontWeight={900}
                sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
              >
                PUBLIC CEMETERY MANAGEMENT
              </Typography>
            </Grid2>

            <Grid2>
              <Typography variant="caption" color="black" fontWeight={100}>
                (OLD POBLACION | EAST VALENCIA | BANBAN CEMETERY)
              </Typography>
            </Grid2>

            <Grid2
              container
              direction={"column"}
              spacing={2}
              size="auto"
              width={400}
              marginTop={"40px"}
            >
              {error?.status == 200 && (
                <Alert severity="success">{error.message}</Alert>
              )}

              {error?.status >= 400 && (
                <Alert severity="error">{error.message}</Alert>
              )}

              <Grid2 spacing={2}>
                <SimpleField
                  label="Email"
                  type="email"
                  // value="admin@guimaras-cemetery.com"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </Grid2>

              <Grid2 spacing={2}>
                <PasswordField
                  label="Password"
                  // value="Password12345678"
                  onChange={(e) => setPassword(e)}
                />
              </Grid2>

              <Grid2 container justifyContent={"center"}>
                <Button
                  disabled={isLoading}
                  fullWidth
                  size="small"
                  variant="contained"
                  onClick={onLogin}
                >
                  Login
                </Button>
              </Grid2>
            </Grid2>
            <Grid2 sx={{ marginTop: "12px" }}>
              <Typography variant="caption" sx={{ color: "black" }}>
                Dont have an account yet?{" "}
                <Link to={ROUTE_REGISTRATION}>SIGN UP</Link>
              </Typography>
            </Grid2>
          </div>
        </div>
      }
    />
  );
};
