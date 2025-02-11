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
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputText from '../../components/Input/InputText';
import Dropdown from '../../components/Input/Dropdown';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

export const RegistrationPage = () => {
  const navigate = useNavigate()
  const [register] = useClientRegisterMutation();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formikConfig = {
    initialValues: {
      role: 'client',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .required('First Name is required'),
      lastName: Yup.string()
        .required('Last Name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required')
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        setIsLoading(true);

        // Make the registration API call using Axios
        const response = await axios.post('/users/create', { ...values, role: 'guest' }); // Adjust the URL as needed
        console.log(response.data); // Handle the response as needed
        // Show success toast message
        toast.success('Registration successful! Please log in.', {
          position: "top-right",
          autoClose: 3000,
        });

        // Optionally navigate to the login page after successful registration
        // navigate(ROUTE_LOGIN);
      } catch (error) {
        // Check if the error response indicates an existing email
        if (error.response && error.response.data && error.response.data.message === 'Email already exists') {
          toast.error('Email already exists. Please use a different email.', {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          toast.error('Registration failed. Please try again.', {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } finally {
        setIsLoading(false);
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4" style={{ backgroundImage: `url(${BG})`, backgroundSize: 'cover' }}>
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <img src={LOGO} alt="Logo" className="mx-auto mb-4" style={{ maxWidth: '150px' }} />
          <Typography variant="h5" className="font-semibold">
            Create Account
          </Typography>
        </div>

        <Formik {...formikConfig}>
          {({
            handleSubmit,
            handleBlur,
            values,
            setFieldValue,
            isSubmitting
          }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputText
                  isRequired
                  label="First Name"
                  name="firstName"
                  type="text"
                  value={values.firstName}
                  onBlur={handleBlur}
                />

                <InputText
                  isRequired
                  label="Last Name"
                  name="lastName"
                  type="text"
                  value={values.lastName}
                  onBlur={handleBlur}
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <InputText
                  isRequired
                  label="Email"
                  name="email"
                  type="email"
                  value={values.email}
                  onBlur={handleBlur}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputText
                  isRequired
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={values.password}
                  onBlur={handleBlur}
                />

                <InputText
                  isRequired
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={values.confirmPassword}
                  onBlur={handleBlur}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showPassword"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                <label htmlFor="showPassword" className="ml-2">Show Password</label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>

              <div className="text-center mt-4">
                <Typography variant="body2">
                  Already have an account?{' '}
                  <Link to={ROUTE_LOGIN} className="text-blue-500 hover:text-blue-700">
                    Login here
                  </Link>
                </Typography>
              </div>
            </Form>
          )}
        </Formik>
        <ToastContainer />
      </div>
    </div>
  );
};
