import { Box, Button, Divider, Grid2, Stack, Typography } from "@mui/material";
import BasicTable from "../../../shared/Table/BasicTable";
import { useEffect, useState, useMemo } from "react";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../shared/Modal/CustomModal";
import { SimpleField } from "../../../shared";
import { useAdminRegisterUserMutation, useLazyAdminFetchUsersQuery } from "../../../service/adminService";

import Table, {
  AvatarCell,
  SelectColumnFilter,
  StatusPill,
  DateCell
} from '../../../components/DataTables/Table'; // new
import { Formik, useField, useFormik, Form } from 'formik';
import * as Yup from 'yup';
import InputText from '../../../components/Input/InputText';
import Dropdown from '../../../components/Input/Dropdown';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const UserManagement = () => {
  const [register] = useAdminRegisterUserMutation();

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(3);

  const [openCreateAccount, setOpenCreateAccount] = useState(false);
  const [getAdminList, result] = useLazyAdminFetchUsersQuery()

  const [fieldData, setFieldData] = useState({
    role: "",
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
  });



  const onAction = (data) => {
    console.log("onAction", data);
  };

  const onPageChange = (value) => {
    setPage(value);
  };

  useEffect(() => {
    getAdminList()
  }, [])

  const onConfirmAddUser = async () => {
    const response = await register(fieldData)
    if (response.data.statusCode == 200) {
      getAdminList();
    }
  }

  useEffect(() => {
    console.log("result", result);
  }, [result]);

  console.log({ dex: result?.data })


  const tableColumns = useMemo(
    () => [
      {
        Header: '#',
        accessor: '', // Leave empty as it doesn't correspond to data
        Cell: ({ row }) => {
          return <span>{row.index + 1}</span>;
        }
      },
      {
        Header: 'First Name',
        accessor: 'firstName', // Data field for "First Name"
        Cell: ({ row, value }) => {
          return <span>{value}</span>;
        }
      },
      {
        Header: 'Last Name',
        accessor: 'lastName', // Data field for "Last Name"
        Cell: ({ row, value }) => {
          return <span>{value}</span>;
        }
      },
      {
        Header: 'Email',
        accessor: 'email', // Data field for "User Name"
        Cell: ({ row, value }) => {
          return <span>{value}</span>;
        }
      },
      {
        Header: 'Role',
        accessor: 'position', // Data field for "Position"
        Cell: ({ row, value }) => {
          return <span>{value}</span>;
        }
      }
    ],
    []
  );


  const [error, setError] = useState(''); // State to store error message
  const [success, setSuccess] = useState(''); // State to store success message

  const formikConfig = () => {



    // console.log(selectedFaq.Admin_Fname)
    return {
      initialValues: {
        role: '',              // Initial value for the role field
        firstName: '',         // Initial value for the first name field
        middleName: '',        // Initial value for the middle name field (if applicable)
        lastName: '',          // Initial value for the last name field
        email: '',             // Initial value for the email field
        password: 'Password12345678',          // Initial value for the password field

      },
      validationSchema: Yup.object({

        role: Yup.string()
          .required('Role is required'),

        firstName: Yup.string()
          .required('First Name is required'),

        middleName: Yup.string()
          .required('First Name is required'),

        lastName: Yup.string()
          .required('Last Name is required'),

        email: Yup.string()
          .email('Invalid email address')
          .required('Email is required'),

        password: Yup.string()
      }),
      // validateOnMount: true,
      // validateOnChange: false,
      onSubmit: async (values, { setFieldError, setSubmitting, resetForm }) => {
        setSubmitting(true);


        try {
          let res = await axios({
            method: 'POST',
            url: 'users/create',
            data: values
          });

          toast.success('Added Successfully!', {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            // transition: Bounce,
          });

          resetForm();
          setOpenCreateAccount(false)

          getAdminList();
        } catch (err) {

          // Capture and display error from the backend
          if (err.response && err.response.data && err.response.data.message) {
            setError(err.response.data.message);

            let message = err.response.data.message
            // display error try catch
            toast.error(message, {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              // transition: Bounce,
            });

          } else {
            setError('Something went wrong. Please try again.');
          }

        }

      }
    };
  };

  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    if (result.status === "fulfilled") {
      setIsLoaded(true)

    }
  }, [result]);


  return isLoaded ?
    <Box>
      <Button
        className="mb-4 bg-green-200 mt-4"
        variant="contained"
        onClick={() => setOpenCreateAccount(true)}
        startIcon={<AddIcon />}
      >
        Add User
      </Button>

      <Table
        style={{ overflow: 'wrap' }}
        className="table-sm"
        columns={tableColumns}
        data={result?.data || []}
        searchField="lastName"
      />

      {/* <BasicTable
        rows={result?.data}
        columns={columns}
        onPageChange={onPageChange}
        page={page}
        count={count}
      /> */}
      <Formik {...formikConfig()}>
        {({
          handleSubmit,
          handleChange,
          handleBlur, // handler for onBlur event of form elements
          values,
          touched,
          errors,
          submitForm,
          setFieldTouched,
          setFieldValue,
          setFieldError,
          setErrors,
          isSubmitting
        }) => {
          return <CustomModal
            width={700}
            open={openCreateAccount}
            onClose={() => setOpenCreateAccount(false)}
            onOk={() => {
              handleSubmit()
              // setOpenCreateAccount(false)
              // onConfirmAddUser()
            }}
            onCancel={() => setOpenCreateAccount(false)}
          >
            <>
              <Grid2
                container
                spacing={1}
                sx={{ width: "100%", marginTop: "12px" }}
                justifyContent={"center"}
              >
                <Typography variant="h5" sx={{ fontWeight: 400 }}>
                  Create Account
                </Typography>
              </Grid2>

              <Box sx={{ margin: "1rem" }}>
                <Divider />
              </Box>



              <Form className="">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-1 ">

                  <Dropdown
                    className="z-50"

                    label="Role"
                    name="role"
                    value={values.role}

                    onBlur={handleBlur}
                    options={[{
                      value: 'treasurer',
                      label: 'Treasurer'
                    },
                    {
                      value: 'enterprise',
                      label: 'Enterprise'
                    },
                      // {
                      //   value: 'guest',
                      //   label: 'Guest'
                      // }


                    ]}


                    setFieldValue={setFieldValue}

                  />

                  {/* <InputText
                      isRequired
                      placeholder=""
                      label="role"
                      name="role"
                      type="role"

                      value={values.role}
                      onBlur={handleBlur} // This apparently updates `touched`?
                    /> */}


                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3 ">

                  <InputText
                    isRequired
                    placeholder=""
                    label="First Name"
                    name="firstName"
                    type="text"

                    value={values.firstName}
                    onBlur={handleBlur} // This apparently updates `touched`?
                  />

                  <InputText
                    isRequired
                    placeholder=""
                    label="Middle Name"
                    name="middleName"
                    type="text"

                    value={values.middleName}
                    onBlur={handleBlur} // This apparently updates `touched`?
                  />
                  <InputText
                    isRequired
                    placeholder=""
                    label="Last Name"
                    name="lastName"
                    type="text"

                    value={values.lastName}
                    onBlur={handleBlur} // This apparently updates `touched`?
                  />


                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-1 ">

                  <InputText
                    isRequired
                    placeholder=""
                    label="Email"
                    name="email"
                    type="text"

                    value={values.email}
                    onBlur={handleBlur} // This apparently updates `touched`?
                  />

                  {/* <InputText
                    isRequired
                    placeholder=""
                    label="Password"
                    name="password"
                    type="text"

                    value={values.password}
                    onBlur={handleBlur} // This apparently updates `touched`?
                  /> */}



                </div>
              </Form>

              {/* <Grid2
            container
            spacing={2}
            sx={{ width: "100%", marginBottom: "2rem" }}
          >
            <Grid2 sm={24} lg={24} sx={{ width: "100%" }}>
              <SimpleField
                label="Role"
                onChange={(e) =>
                  setFieldData((prevState) => ({
                    ...prevState,
                    role: e.target.value,
                  }))
                }
              />
            </Grid2>
            <Grid2 sm={24} lg={24} sx={{ width: "100%" }}>
              <SimpleField
                label="First Name"
                onChange={(e) =>
                  setFieldData((prevState) => ({
                    ...prevState,
                    firstName: e.target.value,
                  }))
                }
              />
            </Grid2>
            <Grid2 sm={24} lg={24} sx={{ width: "100%" }}>
              <SimpleField
                label="Last Name"
                onChange={(e) =>
                  setFieldData((prevState) => ({
                    ...prevState,
                    lastName: e.target.value,
                  }))
                }
              />
            </Grid2>
            <Grid2 sm={24} lg={24} sx={{ width: "100%" }}>
              <SimpleField
                label="Email"
                onChange={(e) =>
                  setFieldData((prevState) => ({
                    ...prevState,
                    email: e.target.value,
                  }))
                }
              />
            </Grid2>
            <Grid2 sm={24} lg={24} sx={{ width: "100%" }}>
              <SimpleField
                type="password"
                label="Password"
                onChange={(e) =>
                  setFieldData((prevState) => ({
                    ...prevState,
                    password: e.target.value,
                  }))
                }
              />
            </Grid2>
          </Grid2> */}

              <Box sx={{ margin: "1rem" }}>
                <Divider />
              </Box>
            </>
          </CustomModal>

        }}
      </Formik>
      <ToastContainer />
    </Box>
    : <div>
      <div className="flex justify-center items-center h-20">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>

    </div>
};
