import {
  Button,
  TextField,
  Alert,
  Typography,
  Grid2,
  Divider,
} from "@mui/material";
import LOGO from "../../assets/Buenavista-sm.png";
import BG from "../../assets/main-bg.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useClientRegisterMutation } from "../../service/clientService";
import { useEffect, useState } from "react";
import "./index.css";
import { PageWrapper } from "../../shared";
import { PasswordField, SimpleField } from "../../shared/TextFields";
import { ROUTE_LOGIN } from "../../constants";


export const RegistrationPage = () => {
  const navigate = useNavigate()
  const [register] = useClientRegisterMutation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState({
    success: null,
    message: "",
  });

  const validate = () => {
    const passwordIsNotThesame = password != confirmPassword;
    const hasNull = [gender,firstName, lastName, userName, email, password].some(
      (item) => item == null || item == undefined || item == ""
    );
    if (passwordIsNotThesame || hasNull) {
      throw new Error('Validation error')
    }
  }

  const onRegisterClick = async () => {
    try {
      //validate()
      setIsLoading(true);
      const response = await register({
        firstName,
        lastName,
        userName,
        email,
        password,
        role: "client",
      });
      console.log("register response:", response);
      setIsLoading(false);
      if (response.error) {
        setApiStatus({
          message: response.error.data.message,
          status: response.error.status
        });
      } else {
         setApiStatus({
           message: 'Successfully registered',
           status: 200,
         });
        navigate(ROUTE_LOGIN)
      }
      console.log("response", response);
    } catch (error) {}
    
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
              <Grid2 spacing={2}>
                <SimpleField
                  required={true}
                  label="First Name"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Grid2>
              <Grid2 spacing={2}>
                <SimpleField
                  required={true}
                  label="Last Name"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Grid2>

              <Grid2 spacing={2}>
                <SimpleField
                  required={true}
                  label="gender"
                  onChange={(e) => setUserName(e.target.value)}
                />
              </Grid2>

              <Grid2 size={12} margin={1}>
                <Divider />
              </Grid2>

              <Grid2 spacing={2}>
                <SimpleField
                  required={true}
                  label="User Name"
                  onChange={(e) => setUserName(e.target.value)}
                />
              </Grid2>

              <Grid2 spacing={2}>
                <SimpleField
                  required={true}
                  label="Email Address"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid2>
              <Grid2 spacing={2}>
                <PasswordField
                  required={true}
                  label="Password"
                  onChange={(value) => setPassword(value)}
                />
              </Grid2>
              <Grid2 spacing={2}>
                <PasswordField
                  required={true}
                  label="Confirm Password"
                  onChange={(value) => setConfirmPassword(value)}
                />
              </Grid2>

              <Grid2 container justifyContent={"center"} marginTop={2}>
                <Button
                  onClick={onRegisterClick}
                  fullWidth
                  size="small"
                  variant="contained"
                >
                  SIGN UP
                </Button>
              </Grid2>
            </Grid2>

            <Grid2 sx={{ marginTop: "12px" }}>
              <Typography variant="caption" sx={{color:'black'}}>
                Already have an account? <Link to={ROUTE_LOGIN}>SIGN IN</Link>
              </Typography>
            </Grid2>
          </div>
        </div>
      }
    />
  );
};
