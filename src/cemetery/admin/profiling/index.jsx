import BasicTable from "../../../shared/Table/BasicTable";
import { useEffect, useState, useMemo } from "react";
import { Box, Button, Divider, Grid2, Stack, Typography } from "@mui/material";
import {
  useAdminAddDeceasedMutation,
  useLazyAdminFetchDeceasedQuery,
} from "../../../service/adminService";
import { useNavigate } from "react-router-dom";
import { ROUTE_ADMIN_MAPPING } from "../../../constants";
import CustomModal from "../../../shared/Modal/CustomModal";
import AddIcon from "@mui/icons-material/Add";
import { SimpleField } from "../../../shared";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
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
import {
  getToken,
  getUser,
  isNotEmpty,
  getPermission,
  getRole
} from './../../../utility';
import { BiEdit, BiSolidBank, BiMapPin, BiInfoCircle } from "react-icons/bi"; // Import icons from React Icons
export const Profiling = () => {
  const user = getUser();

  let addButtonDisabled = user.accountType === 'enterprise';
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(3);
  const [list, setList] = useState([]);
  const [openCreateAccount, setOpenCreateAccount] = useState();
  const [viewedData, setViewedData] = useState({});
  const [fieldData, setFieldData] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    suffix: "",
    address: "",
    born: "",
    died: "",
    cemeteryLocation: "",
    datePermit: "",
    natureApp: "",
    layerNiche: "",
    layerAddress: "",
    payeeLastName: "",
    payeeFirstName: "",
    payeeMiddleName: "",
    payeeSuffix: "",
    payeeContact: "",
    payeeEmail: "",
    payeeAddress: "",
  });

  const navigate = useNavigate();
  //const { data, isLoading, isSuccess, error } = useAdminFetchDeceasedQuery();
  const [addDeceased] = useAdminAddDeceasedMutation()
  const [searchDeased, result, isLoading, isSuccess, error] = useLazyAdminFetchDeceasedQuery();

  console.log({ result });

  useEffect(() => {
    searchDeased()
  }, [])


  const tableColumns = useMemo(() => [
    {
      Header: '#',
      accessor: '', // Leave empty as it doesn't correspond to data
      Cell: ({ row }) => {
        return <span>{row.index + 1}</span>;
      }
    },
    {
      Header: "First Name",
      accessor: "firstName", // Corresponds to the data field
      Cell: ({ row, value }) => {
        const navigate = useNavigate();

        const handleClick = (value) => {
          console.log("First name clicked:", value);
          // Redirect to a specific route (example: /user/123)
          // navigate(`/user/${value}`);
        };

        return <span className="text-slate-700 hover:underline 
        font-bold first-letter:uppercase" onClick={handleClick}>{value}</span>
      }
    },
    {
      Header: "Last Name",
      accessor: "lastName",
      Cell: ({ row, value }) => <span>{value}</span>
    },
    {
      Header: "Born",
      accessor: "born",
      Cell: ({ row, value }) => <span>{value}</span>
    },
    {
      Header: "Died",
      accessor: "died",
      Cell: ({ row, value }) => <span>{value}</span>
    },
    {
      Header: "Place",
      accessor: "place",
      Cell: ({ row, value }) => <span>{value}</span>
    },
    {
      Header: "Action",
      accessor: "action", // Will be handled by custom render
      Cell: ({ row }) => (
        <div className="flex space-x-4">
          {/* Edit Button */}
          {!addButtonDisabled && <button
            onClick={() => {
              setViewedData(row.original)
              document.getElementById('addDeceasedModal').showModal();
            }}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
            <BiEdit className="mr-2 text-lg" /> {/* Edit Icon */}
            Edit
          </button>}

          {/* Archive Button */}
          <button
            onClick={() => onEditRoutes(row.original)}
            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300">
            <BiMapPin className="mr-2 text-lg" /> {/* Archive Icon */}
            Map
          </button>


        </div>
        // <Stack spacing={1} direction={"row"}>
        //   <Button
        //     size="small"
        //     variant="contained"
        //     color="error"
        //     onClick={() => onEditRoutes(row.original)} // Assuming `row.original` contains the actual record data
        //   >
        //     Edit Map
        //   </Button>
        // </Stack>
      ),
    },
  ], []);



  const onEditRoutes = (data) => {
    console.log("onEditPins", data);
    const url = `${ROUTE_ADMIN_MAPPING}?id=${data.id}&location=${data.place}`;

    // Open the URL in a new tab
    window.open(url, "_blank");
  };

  const onPageChange = (value) => {
    setPage(value);
  };

  const onAddDeceasedRecord = async () => {
    const response = await addDeceased(fieldData);
    if (response.data.statusCode == 200) {
      searchDeased();
    }
  }

  const formikConfig = (viewedData) => {





    // console.log(selectedFaq.Admin_Fname)
    return {
      initialValues: {
        firstName: '',
        lastName: '',
        middleName: '',
        suffix: '',
        address: '',
        born: '',
        died: '',
        cemeteryLocation: '',
        datePermit: '',
        natureApp: '',
        layerNiche: '',
        layerAddress: '',
        payeeLastName: '',
        payeeFirstName: '',
        payeeMiddleName: '',
        payeeSuffix: '',
        payeeContact: '',
        payeeEmail: '',
        payeeAddress: '',

      },
      validationSchema: Yup.object({

        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        middleName: Yup.string().optional(),
        suffix: Yup.string().optional(),
        address: Yup.string().required('Address is required'),
        born: Yup.string()
          // .matches(
          //   /^(0[1-9]|1[0-2])-[0-3]?[0-9]-\d{4}$/,
          //   'Date must be in DD-MM-YYYY format'
          // )
          .required('Date of birth is required'),
        died: Yup.string()
          // .matches(
          //   /^(0[1-9]|1[0-2])-[0-3]?[0-9]-\d{4}$/,
          //   'Date must be in DD-MM-YYYY format'
          // )
          .required(),
        cemeteryLocation: Yup.string().required('Cemetery Location is required'),
        datePermit: Yup.string()
          // .matches(
          //   /^(0[1-9]|1[0-2])-[0-3]?[0-9]-\d{4}$/,
          //   'Date must be in DD-MM-YYYY format'
          // )
          .required('Date permit is required'),
        natureApp: Yup.string().required('Nature of Application is required'),
        layerNiche: Yup.string().required('Layer Niche is required'),
        layerAddress: Yup.string().required('Layer Address is required'),
        payeeLastName: Yup.string().required('Payee Last Name is required'),
        payeeFirstName: Yup.string().required('Payee First Name is required'),
        payeeMiddleName: Yup.string().optional(),
        payeeSuffix: Yup.string().optional(),
        payeeContact: Yup.string()
          .matches(/^\d{10}$/, 'Invalid phone number')
          .required('Payee Contact is required'),
        payeeEmail: Yup.string().email('Invalid email format').required('Payee Email is required'),
        payeeAddress: Yup.string().required('Payee Address is required'),

      }),
      // validateOnMount: true,
      // validateOnChange: false,
      onSubmit: async (values, { setFieldError, setSubmitting, resetForm }) => {
        setSubmitting(true);


        try {
          let res = await axios({
            method: 'POST',
            url: 'deceased/create',
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
          searchDeased();
          resetForm();
          setOpenCreateAccount(false)
          document.getElementById('addDeceasedModal').close();

        } catch (error) {

          console.log(error)

        }

      }
    };
  };

  const formikConfigUpdate = (viewedData) => {


    console.log({ viewedData })




    // console.log(selectedFaq.Admin_Fname)

    console.log({ viewedData })


    return {
      initialValues: {
        id: viewedData.id,
        firstName: viewedData.firstName,
        lastName: viewedData.lastName,
        middleName: viewedData.middleName,
        suffix: viewedData.suffix,
        address: viewedData.address,
        born: viewedData.born,
        died: viewedData.died,
        cemeteryLocation: viewedData.cemeteryLocation,
        datePermit: viewedData.datePermit,
        natureApp: viewedData.natureApp,
        layerNiche: viewedData.layerNiche,
        layerAddress: viewedData.layerAddress,
        payeeLastName: viewedData.payeeLastName,
        payeeFirstName: viewedData.payeeFirstName,
        payeeMiddleName: viewedData.payeeMiddleName,
        payeeSuffix: viewedData.payeeSuffix,
        payeeContact: viewedData.payeeContact,
        payeeEmail: viewedData.payeeEmail,
        payeeAddress: viewedData.payeeAddress,
        permitNumber: '',
        ORNumber: '',
        Amount: '',
      },
      validationSchema: Yup.object({
        // born: Yup.date().required('Date Paid is required'),
        // yearsPaid: Yup.number()
        //   .required('Number of Years Paid is required')
        //   .positive('Must be a positive number')
        //   .integer('Must be an integer'),
        // permitNumber: Yup.string().required('Permit # is required'),
        // ORNumber: Yup.string().required('OR # is required'),
        // Amount: Yup.number()
        //   .required('Amount is required')
        //   .positive('Must be a positive number'),

      }),
      // validateOnMount: true,
      // validateOnChange: false,
      onSubmit: async (values, { setFieldError, setSubmitting, resetForm }) => {
        setSubmitting(true);

        console.log({ values })

        // console.log({ viewedData })

        let deceasedId = viewedData.deceasedId;

        try {

          let res = await axios({
            method: 'put',
            url: `deceased/update/${deceasedId}`,
            data: values
          });
          toast.success('Updated Successfully!', {
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
          searchDeased();
          document.getElementById('addDeceasedModal').close();
          // let res = await axios({
          //   method: 'POST',
          //   url: 'payments/create',
          //   data: {
          //     ...values,
          //     deceasedId: viewedData.deceasedId
          //   }
          // });

          // toast.success('Added Successfully!', {
          //   position: "top-right",
          //   autoClose: 1000,
          //   hideProgressBar: false,
          //   closeOnClick: true,
          //   pauseOnHover: true,
          //   draggable: true,
          //   progress: undefined,
          //   theme: "light",
          //   // transition: Bounce,
          // });
          // searchDeased();
          // resetForm();
          // // setOpenCreateAccount(false)
          // document.getElementById('addPaymentModal').close();

        } catch (error) {

          console.log(error)

        }

      }
    };
  };


  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (result.status === "fulfilled") {
      setIsLoaded(true)

    }
  }, [isLoading, isSuccess, error, result.isLoading, result.isSuccess, result.error]);



  return isLoaded ?
    <Box>


      <div className="flex justify-between items-center bg-gray-100 p-5">
        {!addButtonDisabled && <Button
          variant="contained"
          onClick={() => document.getElementById('addDeceasedModal').showModal()}
          // onClick={() => setOpenCreateAccount(true)}
          startIcon={<AddIcon />}
        >
          Add Deceased
        </Button>}
        <span className=" bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          Total:  {(result?.data || []).length}
        </span>
      </div>
      {/* <BasicTable
        rows={result.data ?? []}
        columns={columns}
        onPageChange={onPageChange}
        page={page}
        count={count}
      /> */}
      <Table
        style={{ overflow: 'wrap' }}
        className="table-sm"
        columns={tableColumns}
        data={result?.data || []}
        searchField=""
      />

      {/* <CustomModal
        width={600}
        open={openCreateAccount}
        onClose={() => setOpenCreateAccount(false)}
        onOk={() => {
          setOpenCreateAccount(false);
          onAddDeceasedRecord();
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
              Add Deceased
            </Typography>
          </Grid2>

          <Box sx={{ margin: "1rem" }}>
            <Divider />
          </Box>

          <Grid2
            container
            spacing={2}
            sx={{
              width: "100%",
              marginBottom: "2rem",
              height: "500px",
              overflow: "auto",
            }}
          >
            <Grid2 sm={24} lg={24} sx={{ width: "100%" }}>
              <SimpleField
                size="medium"
                label="First Name"
                onChange={(e) =>
                  setFieldData((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
              />
            </Grid2>
            <Grid2 sm={24} lg={24} sx={{ width: "100%" }}>
              <SimpleField
                size="medium"
                label="Last Name"
                onChange={(e) =>
                  setFieldData((prev) => ({
                    ...prev,
                    lastName: e.target.value,
                  }))
                }
              />
            </Grid2>
            <Grid2 sm={24} lg={24} sx={{ width: "100%" }}>
              <SimpleField
                size="medium"
                label="Middle Name"
                onChange={(e) =>
                  setFieldData((prev) => ({
                    ...prev,
                    middleName: e.target.value,
                  }))
                }
              />
            </Grid2>
            <Grid2 sm={24} lg={24} sx={{ width: "100%" }}>
              <SimpleField
                size="medium"
                label="Suffix"
                onChange={(e) =>
                  setFieldData((prev) => ({
                    ...prev,
                    suffix: e.target.value,
                  }))
                }
              />
            </Grid2>
            <Grid2 sm={24} lg={24} sx={{ width: "100%" }}>
              <SimpleField
                size="medium"
                label="Address"
                onChange={(e) =>
                  setFieldData((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
              />
            </Grid2>
            <Grid2 sm={24} lg={24} sx={{ width: "100%" }}>
              <SimpleField
                placeHolder="DD-MM-YYYY"
                size="medium"
                label="Born (DD-MM-YYYY)"
                onChange={(e) =>
                  setFieldData((prev) => ({
                    ...prev,
                    born: e.target.value,
                  }))
                }
              />
            </Grid2>
            <Grid2 sm={24} lg={24} sx={{ width: "100%" }}>
              <SimpleField
                size="medium"
                label="Died (DD-MM-YYYY)"
                onChange={(e) =>
                  setFieldData((prev) => ({
                    ...prev,
                    died: e.target.value,
                  }))
                }
              />
            </Grid2>
            <Grid2 sm={24} lg={24} sx={{ width: "100%" }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Cemetery Location
                </InputLabel>
                <Select
                  size="medium"
                  labelId="cemeteryLocation-simple-select-label"
                  id="cemeteryLocation-simple-select"
                  value={fieldData.cemeteryLocation}
                  label="Cemetery Location"
                  onChange={(e) =>
                    setFieldData((prev) => ({
                      ...prev,
                      cemeteryLocation: e.target.value,
                    }))
                  }
                >
                  <MenuItem value={"Old Poblacion Cemetery"}>
                    Old Poblacion Cemetery
                  </MenuItem>
                  <MenuItem value={"Banban Cemetery"}>
                    Banban Cemetery
                  </MenuItem>
                  <MenuItem value={"East Velencia Cemetery"}>
                    East Valencia Cemetery
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 sm={24} lg={24} sx={{ width: "100%" }}>
              <SimpleField
                size="medium"
                label="Date Permit (DD-MM-YYYY)"
                onChange={(e) =>
                  setFieldData((prev) => ({
                    ...prev,
                    datePermit: e.target.value,
                  }))
                }
              />
            </Grid2>
            <Grid2 sm={24} lg={24} sx={{ width: "100%" }}>
              <FormControl fullWidth>
                <InputLabel id="natureApp-simple-select-label">
                  Nature App
                </InputLabel>
                <Select
                  labelId="natureApp-simple-select-label"
                  id="natureApp-simple-select"
                  value={fieldData.natureApp}
                  label="Nature App"
                  onChange={(e) =>
                    setFieldData((prev) => ({
                      ...prev,
                      natureApp: e.target.value,
                    }))
                  }
                >
                  <MenuItem value={"Construction"}>Construction</MenuItem>
                  <MenuItem value={"Excavation"}>Excavation</MenuItem>
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 sm={24} lg={24} sx={{ width: "100%" }}>
              <SimpleField
                size="medium"
                label="Layer Niche"
                onChange={(e) =>
                  setFieldData((prev) => ({
                    ...prev,
                    layerNiche: e.target.value,
                  }))
                }
              />
            </Grid2>
            <Grid2 sm={24} lg={24} sx={{ width: "100%" }}>
              <SimpleField
                size="medium"
                label="Layer Address"
                onChange={(e) =>
                  setFieldData((prev) => ({
                    ...prev,
                    layerAddress: e.target.value,
                  }))
                }
              />
            </Grid2>
            <Grid2 sm={24} lg={24} sx={{ width: "100%" }}>
              <SimpleField
                size="medium"
                label="Payee Last Name"
                onChange={(e) =>
                  setFieldData((prev) => ({
                    ...prev,
                    payeeLastName: e.target.value,
                  }))
                }
              />
            </Grid2>
            <Grid2 sm={24} lg={24} sx={{ width: "100%" }}>
              <SimpleField
                size="medium"
                label="Payee First Name"
                onChange={(e) =>
                  setFieldData((prev) => ({
                    ...prev,
                    payeeFirstName: e.target.value,
                  }))
                }
              />
            </Grid2>
            <Grid2 sm={24} lg={24} sx={{ width: "100%" }}>
              <SimpleField
                size="medium"
                label="Payee Middle Name"
                onChange={(e) =>
                  setFieldData((prev) => ({
                    ...prev,
                    payeeMiddleName: e.target.value,
                  }))
                }
              />
            </Grid2>
            <Grid2 sm={24} lg={24} sx={{ width: "100%" }}>
              <SimpleField
                size="medium"
                label="Payee Suffix"
                onChange={(e) =>
                  setFieldData((prev) => ({
                    ...prev,
                    payeeSuffix: e.target.value,
                  }))
                }
              />
            </Grid2>
            <Grid2 sm={24} lg={24} sx={{ width: "100%" }}>
              <SimpleField
                size="medium"
                label="Payee Contact"
                onChange={(e) =>
                  setFieldData((prev) => ({
                    ...prev,
                    payeeContact: e.target.value,
                  }))
                }
              />
            </Grid2>
            <Grid2 sm={24} lg={24} sx={{ width: "100%" }}>
              <SimpleField
                type="email"
                size="medium"
                label="Payee Email"
                onChange={(e) =>
                  setFieldData((prev) => ({
                    ...prev,
                    payeeEmail: e.target.value,
                  }))
                }
              />
            </Grid2>
            <Grid2 sm={24} lg={24} sx={{ width: "100%" }}>
              <SimpleField
                size="medium"
                label="Payee Address"
                onChange={(e) =>
                  setFieldData((prev) => ({
                    ...prev,
                    payeeAddress: e.target.value,
                  }))
                }
              />
            </Grid2>
          </Grid2>

          <Box sx={{ margin: "1rem" }}>
            <Divider />
          </Box>
        </>
      </CustomModal> */}

      <dialog id="addDeceasedModal" className="modal">
        <div className="modal-box w-11/12 max-w-3xl">

          {/* if there is a button in form, it will close the modal */}
          <button
            onClick={() => {
              setViewedData({});
              document.getElementById("addDeceasedModal").close();
            }}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 mb-4">✕</button>

          <div className="modal-header flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-t-lg">
            <h1 className="text-xl font-semibold">Deceased Information</h1>

          </div>
          <div className="p-2 space-y-4 md:space-y-6 sm:p-4">

            {!viewedData.id &&
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


                  console.log({ errors })
                  return <Form className="">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <InputText
                        isRequired
                        label="First Name"
                        name="firstName"
                        type="text"
                        value={values.firstName}

                        onBlur={handleBlur} // This apparently updates `touched`?
                      />

                      <InputText
                        isRequired
                        label="Last Name"
                        name="lastName"
                        type="text"
                        value={values.lastName}

                        onBlur={handleBlur} // This apparently updates `touched`?
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <InputText
                        isRequired
                        label="Middle Name"
                        name="middleName"
                        type="text"
                        value={values.middleName}

                        onBlur={handleBlur} // This apparently updates `touched`?
                      />

                      <InputText
                        isRequired
                        label="Suffix"
                        name="suffix"
                        type="text"
                        value={values.suffix}

                        onBlur={handleBlur} // This apparently updates `touched`?
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <InputText
                        isRequired
                        label="Address"
                        name="address"
                        type="text"
                        value={values.address}

                        onBlur={handleBlur} // This apparently updates `touched`?
                      />

                      <InputText
                        isRequired
                        label="Date of Birth"
                        name="born"
                        type="date"
                        value={values.born}

                        onBlur={handleBlur} // This apparently updates `touched`?
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <InputText
                        isRequired
                        label="Date of Death"
                        name="died"
                        type="date"
                        value={values.died}

                        onBlur={handleBlur} // This apparently updates `touched`?
                      />


                      {/* <InputSelect
                    isRequired
                    label="Cemetery Location"
                    name="cemeteryLocation"
                    value={fieldData.cemeteryLocation}
                    onChange={(e) =>
                      setFieldData((prev) => ({
                        ...prev,
                        cemeteryLocation: e.target.value,
                      }))
                    }
                    onBlur={handleBlur}
                  >
                    <option value="Old Poblacion Cemetery">Old Poblacion Cemetery</option>
                    <option value="Banban Cemetery">Banban Cemetery</option>
                    <option value="East Velencia Cemetery">East Valencia Cemetery</option>
                  </InputSelect> */}
                      <div className="mt-2">
                        <Dropdown

                          // icons={mdiAccount}
                          label="Cemetery Location"
                          name="cemeteryLocation"
                          placeholder=""
                          value={"Cash"}
                          setFieldValue={setFieldValue}
                          onBlur={handleBlur}
                          options={[
                            {
                              label: "Old Poblacion Cemetery",
                              value: "Old Poblacion Cemetery"
                            },
                            {
                              label: "BanBan Cemetery",
                              value: "Banban Cemetery"
                            },
                            {
                              label: "East Valencia Cemetery",
                              value: "East Velencia Cemetery"
                            }
                          ]}
                          functionToCalled={(value) => {

                            // setPlan();
                            // let user = users.find(u => {
                            //   return u.value === value
                            // })
                            setPlan(value)
                            setFieldValue('cemeteryLocation', value)
                          }}

                        /></div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <InputText
                        isRequired
                        label="Date Permit"
                        name="datePermit"
                        type="date"
                        value={values.datePermit}
                        // onChange={(e) =>
                        //   setFieldData((prev) => ({
                        //     ...prev,
                        //     datePermit: e.target.value,
                        //   }))
                        // }
                        onBlur={handleBlur} // This apparently updates `touched`?
                      />



                      <div className="mt-2">
                        <Dropdown

                          // icons={mdiAccount}
                          label="Nature App"
                          name="natureApp"
                          placeholder=""
                          value={"Cash"}
                          setFieldValue={setFieldValue}
                          onBlur={handleBlur}
                          options={[
                            {
                              label: "Construction",
                              value: "Construction"
                            },
                            {
                              label: "Excavation",
                              value: "Excavation"
                            },

                          ]}
                          functionToCalled={(value) => {

                            // setPlan();
                            // let user = users.find(u => {
                            //   return u.value === value
                            // })
                            setPlan(value)
                            setFieldValue('natureApp', value)
                          }}

                        /></div>

                      {/* <InputSelect
                    isRequired
                    label="Nature App"
                    name="natureApp"
                    value={fieldData.natureApp}
                    onChange={(e) =>
                      setFieldData((prev) => ({
                        ...prev,
                        natureApp: e.target.value,
                      }))
                    }
                    onBlur={handleBlur}
                  >
                    <option value="Construction">Construction</option>
                    <option value="Excavation">Excavation</option>
                  </InputSelect> */}


                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <InputText
                        isRequired
                        label="Layer Niche"
                        name="layerNiche"
                        type="text"
                        value={values.layerNiche}

                        onBlur={handleBlur} // This apparently updates `touched`?
                      />

                      <InputText
                        isRequired
                        label="Layer Address"
                        name="layerAddress"
                        type="text"
                        value={values.layerAddress}
                        // onChange={(e) =>
                        //   setFieldData((prev) => ({
                        //     ...prev,
                        //     layerAddress: e.target.value,
                        //   }))
                        // }
                        onBlur={handleBlur} // This apparently updates `touched`?
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <InputText
                        isRequired
                        label="Payee Last Name"
                        name="payeeLastName"
                        type="text"
                        value={values.payeeLastName}
                        // onChange={(e) =>
                        //   setFieldData((prev) => ({
                        //     ...prev,
                        //     payeeLastName: e.target.value,
                        //   }))
                        // }
                        onBlur={handleBlur} // This apparently updates `touched`?
                      />

                      <InputText
                        isRequired
                        label="Payee First Name"
                        name="payeeFirstName"
                        type="text"
                        value={values.payeeFirstName}
                        // onChange={(e) =>
                        //   setFieldData((prev) => ({
                        //     ...prev,
                        //     payeeFirstName: e.target.value,
                        //   }))
                        // }
                        onBlur={handleBlur} // This apparently updates `touched`?
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <InputText
                        isRequired
                        label="Payee Middle Name"
                        name="payeeMiddleName"
                        type="text"
                        value={values.payeeMiddleName}
                        // onChange={(e) =>
                        //   setFieldData((prev) => ({
                        //     ...prev,
                        //     payeeMiddleName: e.target.value,
                        //   }))
                        // }
                        onBlur={handleBlur} // This apparently updates `touched`?
                      />

                      <InputText
                        isRequired
                        label="Payee Suffix"
                        name="payeeSuffix"
                        type="text"
                        value={values.payeeSuffix}
                        // onChange={(e) =>
                        //   setFieldData((prev) => ({
                        //     ...prev,
                        //     payeeSuffix: e.target.value,
                        //   }))
                        // }
                        onBlur={handleBlur} // This apparently updates `touched`?
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <InputText
                        isRequired
                        label="Payee Contact"
                        name="payeeContact"
                        type="text"
                        value={values.payeeContact}
                        // onChange={(e) =>
                        //   setFieldData((prev) => ({
                        //     ...prev,
                        //     payeeContact: e.target.value,
                        //   }))
                        // }
                        onBlur={handleBlur} // This apparently updates `touched`?
                      />

                      <InputText
                        isRequired
                        label="Payee Email"
                        name="payeeEmail"
                        type="text"
                        value={values.payeeEmail}
                        // onChange={(e) =>
                        //   setFieldData((prev) => ({
                        //     ...prev,
                        //     payeeEmail: e.target.value,
                        //   }))
                        // }
                        onBlur={handleBlur} // This apparently updates `touched`?
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <InputText
                        isRequired
                        label="Payee Address"
                        name="payeeAddress"
                        type="text"
                        value={values.payeeAddress}
                        // onChange={(e) =>
                        //   setFieldData((prev) => ({
                        //     ...prev,
                        //     payeeAddress: e.target.value,
                        //   }))
                        // }
                        onBlur={handleBlur} // This apparently updates `touched`?
                      />
                    </div>

                    <div className="modal-action">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={
                          'btn mt-4 shadow-lg  bg-blue-700 font-bold text-white flex justify-center items-center'

                        }>
                        {isSubmitting ? (
                          <div><span className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full"></span> Processing </div>
                        ) : (
                          'Submit'
                        )}
                      </button>
                      <button className="btn mt-4" onClick={(e) => {
                        setViewedData({})
                        e.preventDefault();
                        document.getElementById('addDeceasedModal').close();
                      }}>
                        Close
                      </button>
                    </div>

                  </Form>
                }}
              </Formik>}
            {viewedData.id &&
              <Formik {...formikConfigUpdate(viewedData)}>
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

                  return <Form className="">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <InputText
                        isRequired
                        label="First Name"
                        name="firstName"
                        type="text"
                        value={values.firstName}

                        onBlur={handleBlur} // This apparently updates `touched`?
                      />

                      <InputText
                        isRequired
                        label="Last Name"
                        name="lastName"
                        type="text"
                        value={values.lastName}

                        onBlur={handleBlur} // This apparently updates `touched`?
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <InputText
                        isRequired
                        label="Middle Name"
                        name="middleName"
                        type="text"
                        value={values.middleName}

                        onBlur={handleBlur} // This apparently updates `touched`?
                      />

                      <InputText
                        isRequired
                        label="Suffix"
                        name="suffix"
                        type="text"
                        value={values.suffix}

                        onBlur={handleBlur} // This apparently updates `touched`?
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <InputText
                        isRequired
                        label="Address"
                        name="address"
                        type="text"
                        value={values.address}

                        onBlur={handleBlur} // This apparently updates `touched`?
                      />

                      <InputText
                        isRequired
                        label="Date of Birth"
                        name="born"
                        type="date"
                        value={values.born}

                        onBlur={handleBlur} // This apparently updates `touched`?
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <InputText
                        isRequired
                        label="Date of Death"
                        name="died"
                        type="date"
                        value={values.died}

                        onBlur={handleBlur} // This apparently updates `touched`?
                      />


                      {/* <InputSelect
                    isRequired
                    label="Cemetery Location"
                    name="cemeteryLocation"
                    value={fieldData.cemeteryLocation}
                    onChange={(e) =>
                      setFieldData((prev) => ({
                        ...prev,
                        cemeteryLocation: e.target.value,
                      }))
                    }
                    onBlur={handleBlur}
                  >
                    <option value="Old Poblacion Cemetery">Old Poblacion Cemetery</option>
                    <option value="Banban Cemetery">Banban Cemetery</option>
                    <option value="East Velencia Cemetery">East Valencia Cemetery</option>
                  </InputSelect> */}
                      <div className="mt-2">
                        <Dropdown

                          // icons={mdiAccount}
                          label="Cemetery Location"
                          name="cemeteryLocation"
                          placeholder=""
                          value={"Cash"}
                          setFieldValue={setFieldValue}
                          onBlur={handleBlur}
                          options={[
                            {
                              label: "Old Old Poblacion Cemetery",
                              value: "Old Poblacion Cemetery"
                            },
                            {
                              label: "BanBan Cemetery",
                              value: "Banban Cemetery"
                            },
                            {
                              label: "East Valencia Cemetery",
                              value: "East Velencia Cemetery"
                            }
                          ]}
                          functionToCalled={(value) => {

                            // setPlan();
                            // let user = users.find(u => {
                            //   return u.value === value
                            // })
                            setPlan(value)
                            setFieldValue('cemeteryLocation', value)
                          }}

                        /></div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <InputText
                        isRequired
                        label="Date Permit"
                        name="datePermit"
                        type="date"
                        value={values.datePermit}
                        // onChange={(e) =>
                        //   setFieldData((prev) => ({
                        //     ...prev,
                        //     datePermit: e.target.value,
                        //   }))
                        // }
                        onBlur={handleBlur} // This apparently updates `touched`?
                      />



                      <div className="mt-2">
                        <Dropdown

                          // icons={mdiAccount}
                          label="Nature App"
                          name="natureApp"
                          placeholder=""
                          value={"Cash"}
                          setFieldValue={setFieldValue}
                          onBlur={handleBlur}
                          options={[
                            {
                              label: "Construction",
                              value: "Construction"
                            },
                            {
                              label: "Excavation",
                              value: "Excavation"
                            },

                          ]}
                          functionToCalled={(value) => {

                            // setPlan();
                            // let user = users.find(u => {
                            //   return u.value === value
                            // })
                            setPlan(value)
                            setFieldValue('natureApp', value)
                          }}

                        /></div>

                      {/* <InputSelect
                    isRequired
                    label="Nature App"
                    name="natureApp"
                    value={fieldData.natureApp}
                    onChange={(e) =>
                      setFieldData((prev) => ({
                        ...prev,
                        natureApp: e.target.value,
                      }))
                    }
                    onBlur={handleBlur}
                  >
                    <option value="Construction">Construction</option>
                    <option value="Excavation">Excavation</option>
                  </InputSelect> */}


                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <InputText
                        isRequired
                        label="Layer Niche"
                        name="layerNiche"
                        type="text"
                        value={values.layerNiche}

                        onBlur={handleBlur} // This apparently updates `touched`?
                      />

                      <InputText
                        isRequired
                        label="Layer Address"
                        name="layerAddress"
                        type="text"
                        value={values.layerAddress}
                        // onChange={(e) =>
                        //   setFieldData((prev) => ({
                        //     ...prev,
                        //     layerAddress: e.target.value,
                        //   }))
                        // }
                        onBlur={handleBlur} // This apparently updates `touched`?
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <InputText
                        isRequired
                        label="Payee Last Name"
                        name="payeeLastName"
                        type="text"
                        value={values.payeeLastName}
                        // onChange={(e) =>
                        //   setFieldData((prev) => ({
                        //     ...prev,
                        //     payeeLastName: e.target.value,
                        //   }))
                        // }
                        onBlur={handleBlur} // This apparently updates `touched`?
                      />

                      <InputText
                        isRequired
                        label="Payee First Name"
                        name="payeeFirstName"
                        type="text"
                        value={values.payeeFirstName}
                        // onChange={(e) =>
                        //   setFieldData((prev) => ({
                        //     ...prev,
                        //     payeeFirstName: e.target.value,
                        //   }))
                        // }
                        onBlur={handleBlur} // This apparently updates `touched`?
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <InputText
                        isRequired
                        label="Payee Middle Name"
                        name="payeeMiddleName"
                        type="text"
                        value={values.payeeMiddleName}
                        // onChange={(e) =>
                        //   setFieldData((prev) => ({
                        //     ...prev,
                        //     payeeMiddleName: e.target.value,
                        //   }))
                        // }
                        onBlur={handleBlur} // This apparently updates `touched`?
                      />

                      <InputText
                        isRequired
                        label="Payee Suffix"
                        name="payeeSuffix"
                        type="text"
                        value={values.payeeSuffix}
                        // onChange={(e) =>
                        //   setFieldData((prev) => ({
                        //     ...prev,
                        //     payeeSuffix: e.target.value,
                        //   }))
                        // }
                        onBlur={handleBlur} // This apparently updates `touched`?
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <InputText
                        isRequired
                        label="Payee Contact"
                        name="payeeContact"
                        type="text"
                        value={values.payeeContact}
                        // onChange={(e) =>
                        //   setFieldData((prev) => ({
                        //     ...prev,
                        //     payeeContact: e.target.value,
                        //   }))
                        // }
                        onBlur={handleBlur} // This apparently updates `touched`?
                      />

                      <InputText
                        isRequired
                        label="Payee Email"
                        name="payeeEmail"
                        type="text"
                        value={values.payeeEmail}
                        // onChange={(e) =>
                        //   setFieldData((prev) => ({
                        //     ...prev,
                        //     payeeEmail: e.target.value,
                        //   }))
                        // }
                        onBlur={handleBlur} // This apparently updates `touched`?
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <InputText
                        isRequired
                        label="Payee Address"
                        name="payeeAddress"
                        type="text"
                        value={values.payeeAddress}
                        // onChange={(e) =>
                        //   setFieldData((prev) => ({
                        //     ...prev,
                        //     payeeAddress: e.target.value,
                        //   }))
                        // }
                        onBlur={handleBlur} // This apparently updates `touched`?
                      />
                    </div>

                    <div className="modal-action">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={
                          'btn mt-4 shadow-lg  bg-blue-700 font-bold text-white flex justify-center items-center'

                        }>
                        {isSubmitting ? (
                          <div><span className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full"></span> Processing </div>
                        ) : (
                          'Submit'
                        )}
                      </button>
                      <button className="btn mt-4" onClick={(e) => {
                        e.preventDefault();
                        setViewedData({})
                        document.getElementById('addDeceasedModal').close();
                      }}>
                        Close
                      </button>
                    </div>

                  </Form>
                }}
              </Formik>}
          </div>
          {/* <div className="modal-action">
            <form method="dialog">
         
              <button className="btn">Close</button>
            </form>
          </div> */}
        </div>
      </dialog>

      <dialog id="addPaymentModal" className="modal">
        <div className="modal-box w-11/12 max-w-3xl">

          {/* if there is a button in form, it will close the modal */}
          <button
            onClick={() => {
              setViewedData({});
              document.getElementById("addPaymentModal").close();
            }}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 mb-4">✕</button>

          <div className="modal-header flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-t-lg">
            <h1 className="text-xl font-semibold">Add Rental Payment</h1>

          </div>
          <div className="p-2 space-y-4 md:space-y-6 sm:p-4">


            {viewedData.id &&
              <Formik {...formikConfigUpdate(viewedData)}>
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

                  return <Form className="">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="p-4">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                          Payee Name
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          value={`${values.payeeFirstName} ${values.payeeLastName}`}
                          disabled
                          className="mt-2 p-3 w-full border border-gray-300 rounded-md bg-gray-200 text-gray-500 cursor-not-allowed focus:outline-none"
                        />
                      </div>
                      <div className="p-4">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                          Name of the Deceased
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          value={`${values.firstName} ${values.lastName}`}
                          disabled
                          className="mt-2 p-3 w-full border border-gray-300 rounded-md bg-gray-200 text-gray-500 cursor-not-allowed focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">


                      <InputText
                        isRequired
                        label="Date Paid"
                        name="born"
                        type="date"
                        value={values.born}

                        onBlur={handleBlur} // This apparently updates `touched`?
                      />
                      <InputText
                        isRequired
                        label="Number of Years Paid"
                        name="yearsPaid"
                        type="yearsPaid"
                        value={values.yearsPaid}

                        onBlur={handleBlur} // This apparently updates `touched`?
                      />
                    </div>



                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <InputText
                        isRequired
                        label="Permit #"
                        name="permitNumber"
                        type="text"
                        value={values.permitNumber}
                        // onChange={(e) =>
                        //   setFieldData((prev) => ({
                        //     ...prev,
                        //     datePermit: e.target.value,
                        //   }))
                        // }
                        onBlur={handleBlur} // This apparently updates `touched`?
                      />
                      <InputText
                        isRequired
                        label="OR #"
                        name="ORNumber"
                        type="text"
                        value={values.ORNumber}
                        // onChange={(e) =>
                        //   setFieldData((prev) => ({
                        //     ...prev,
                        //     datePermit: e.target.value,
                        //   }))
                        // }
                        onBlur={handleBlur} // This apparently updates `touched`?
                      />




                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-1">
                      <InputText
                        isRequired
                        label="Amount"
                        name="Amount"
                        type="text"
                        value={values.Amount}

                        onBlur={handleBlur} // This apparently updates `touched`?
                      />


                    </div>



                    <div className="modal-action">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={
                          'btn mt-4 shadow-lg  bg-blue-700 font-bold text-white flex justify-center items-center'

                        }>
                        {isSubmitting ? (
                          <div><span className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full"></span> Processing </div>
                        ) : (
                          'Submit'
                        )}
                      </button>
                      <button className="btn mt-4" onClick={(e) => {
                        e.preventDefault();
                        setViewedData({})
                        document.getElementById('addPaymentModal').close();
                      }}>
                        Close
                      </button>
                    </div>

                  </Form>
                }}
              </Formik>}
          </div>
          {/* <div className="modal-action">
            <form method="dialog">
         
              <button className="btn">Close</button>
            </form>
          </div> */}
        </div>
      </dialog>
      <ToastContainer />
    </Box> : <div>
      <div className="flex justify-center items-center h-20">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>

    </div>


};
