import BasicTable from "../../../shared/Table/BasicTable";
import { useEffect, useState, useMemo, useRef } from "react";
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
} from '../../../utility';
import { BiEdit, BiSolidBank, BiMapPin, BiInfoCircle } from "react-icons/bi"; // Import icons from React Icons


import ReactToPrint from "react-to-print";

import PaymentCalculator from './PaymentCalculator';
import { list } from "postcss";



export default function PaymentInterface(props) {

  const mainContentRef = useRef();

  console.log({ props })
  let { ADDED_BY, DECEASED_NAME, DATE_PAID, KIND_PAYMENT, PERMIT_NO, ORDER_NO, AMOUNT, NUM_YEARS_PAY, NEXT_PAYMENT_DATE } = props;
  const payment = {
    datePaid: "25-06-2020",
    kindOfPayment: "Rental fee",
    permitNo: "09123",
    orNo: "09784",
    amount: "₱520.00",
    yearsCount: "4 years",
    nextPayment: "25/06/2024",
  };


  const handlePrint = () => {
    const content = document.getElementById("mainContent").innerHTML;
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
@media print {
  /* General Print Styles */
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
  }

  /* Hide non-essential elements */
  .hidden-print {
    display: none; /* Hide buttons and other non-print content */
  }

  /* Table Styling for Print */
  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 8px;
    text-align: left;
    border: 1px solid #ddd;
  }

  th {
    background-color: #4f8ef7;
    color: white;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tr:hover {
    background-color: #f1f1f1;
  }

  /* Form layout for print (Two columns for the input fields) */
  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* Two columns layout */
    gap: 16px;
  }

  .space-y-2 {
    margin-bottom: 16px;
  }

  .w-full {
    width: 100%;
  }

  /* Hide buttons during print */
  button {
    display: none;
  }

  /* Adjust table header color */
  .bg-sky-500 {
    background-color: #4f8ef7;
  }

  .bg-gray-500 {
    background-color: #b0bec5;
  }

  .bg-green-500 {
    background-color: #4caf50;
  }

  .bg-yellow-400 {
    background-color: #fbc02d;
  }
}

          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div ref={mainContentRef} className="w-full max-w-5xl mx-auto p-6 space-y-8" id="mainContent">
      <h1 className="text-2xl font-bold text-center mb-8">PAYMENTS</h1>

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 print-grid">
        <div className="space-y-2">
          <label className="text-sm font-medium">PAYER NAME</label>
          <input
            type="text"
            placeholder="Enter payer name"
            className="border-2 p-2 w-full rounded-md"
            value={ADDED_BY}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">CONTACT NUMBER</label>
          <input
            type="text"
            placeholder="Enter contact number"
            className="border-2 p-2 w-full rounded-md"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">NAME OF DECEASED</label>
          <input
            type="text"
            placeholder="Enter name of deceased"
            className="border-2 p-2 w-full rounded-md"
            value={DECEASED_NAME}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">CEMETERY LOCATION</label>
          <input
            type="text"
            placeholder="Enter cemetery location"
            className="border-2 p-2 w-full rounded-md"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mb-6">
        <button className="bg-green-500 hover:bg-green-500 text-white px-6 py-2 rounded-md no-print">
          ADD PAYMENT
        </button>
        {/* <button className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-md">
          PRINT
        </button> */}

        <button className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-md no-print"

          onClick={() => {
            handlePrint()
          }}>
          PRINT
        </button>

      </div>

      {/* Payments Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-sky-500">
            <tr>
              <th className="text-white py-2 px-4">DATE PAID</th>
              <th className="text-white py-2 px-4">RENTAL PAYMENT</th>
              <th className="text-white py-2 px-4">PERMIT NO.</th>
              <th className="text-white py-2 px-4">OR NO.</th>
              <th className="text-white py-2 px-4">AMOUNT</th>
              <th className="text-white py-2 px-4">NO. OF YEARS PAID</th>
              <th className="text-white py-2 px-4">NEXT PAYMENT</th>
              <th className="text-white py-2 px-4 no-print hidden-print">ACTION</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4">{new Date(DATE_PAID).toLocaleString()}</td>
              <td className="py-2 px-4">{KIND_PAYMENT}</td>
              <td className="py-2 px-4">{PERMIT_NO}</td>
              <td className="py-2 px-4">{ORDER_NO}</td>
              <td className="py-2 px-4">{AMOUNT}</td>
              <td className="py-2 px-4">{NUM_YEARS_PAY}</td>
              <td className="py-2 px-4">{new Date(DATE_PAID).toLocaleString()}</td>
              <td className="py-2 px-4 hidden-print">
                <button className="no-print bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-4 py-2 rounded-md flex items-center">
                  <BiEdit className="w-4 h-4 mr-1" />
                  EDIT
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Subtotal */}
      <div className="flex justify-end mt-4">
        <div className="border-2 rounded-md overflow-hidden">
          <div className="grid grid-cols-2 gap-4 p-2">
            <div className="font-medium">Subtotal</div>
            <div className="text-right">{payment.amount}</div>
          </div>
        </div>
      </div>
    </div>
  );
}


export const Payments = () => {


  const user = getUser();
  let addButtonDisabled = user.accountType === 'enterprise';
  const [deceasedId, setdeceasedId] = useState('');
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(3);
  const [deceasedList, setDeceasedList] = useState([]);
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
  const [searchDeased, result] = useLazyAdminFetchDeceasedQuery();


  const [paymentList, setPaymentList] = useState([])

  const [activePaymentList, setactivePaymentList] = useState([])

  const [isLoaded, setIsLoaded] = useState(false)

  const [paymentListPerDeceased, setpaymentListPerDeceased] = useState({})

  const fetchAllDeceased = async () => {

    let res = await axios({
      method: 'POST',
      url: 'deceased/list',
      data: {}
    });

    let data = res.data.data;


    setDeceasedList(data.map((val) => {
      return {
        value: val.DECEASED_ID,
        label: `${val.FNAME} ${val.LNAME}`,
        payeeName: `${val.PAYEE_FNAME} ${val.PAYEE_LNAME}`,
        ...val
      }
    }))

  }


  const fetchAllPayments = async () => {

    let res = await axios({
      method: 'POST',
      url: 'payments/all',
      data: {}
    });

    let data = res.data.data;

    console.log({ data })

    setPaymentList(data)

  }

  useEffect(() => {
    searchDeased()
    fetchAllDeceased()
    fetchAllPayments()
    setIsLoaded(true)

  }, [])




  const payments = async () => {

    let res = await axios({
      method: 'get',
      url: `deceased/getPayments/${deceasedId}`,

    });





    setpaymentListPerDeceased(res.data.data[0])

  }

  useEffect(() => {
    if (deceasedId) {
      payments()

    }

  }, [deceasedId])


  const tableColumns = useMemo(() => [
    {
      Header: '#',
      accessor: '', // Leave empty as it doesn't correspond to data
      Cell: ({ row }) => {
        return <span>{row.index + 1}</span>;
      }
    },

    { Header: "Deceased Name", accessor: "DECEASED_NAME", Cell: ({ row, value }) => <span>{value}</span> },
    { Header: "Date Paid", accessor: "DATE_PAID", Cell: ({ row, value }) => <span>{new Date(value).toLocaleString()}</span> },
    { Header: "Rental Payment", accessor: "KIND_PAYMENT", Cell: ({ row, value }) => <span>{value}</span> },
    { Header: "Permit Number", accessor: "PERMIT_NO", Cell: ({ row, value }) => <span>{value}</span> },
    { Header: "Order Number", accessor: "ORDER_NO", Cell: ({ row, value }) => <span>{value}</span> },
    { Header: "Amount", accessor: "AMOUNT", Cell: ({ row, value }) => <span>{value}</span> },
    { Header: "Number of Years Paid", accessor: "NUM_YEARS_PAY", Cell: ({ row, value }) => <span>{value}</span> },
    { Header: "Next Payment Date", accessor: "NEXT_PAYMENT_DATE", Cell: ({ row, value }) => <span>{new Date(value).toLocaleString()}</span> },

    { Header: "Status", accessor: "STATUS", Cell: ({ row, value }) => <span>{value}</span> },
    { Header: "Added By", accessor: "ADDED_BY", Cell: ({ row, value }) => <span>{value}</span> },
    { Header: "Added Date", accessor: "ADDED_DATE", Cell: ({ row, value }) => <span>{new Date(value).toLocaleString()}</span> },
    // { Header: "Modified By", accessor: "MODIFIED_BY", Cell: ({ row, value }) => <span>{value || "N/A"}</span> },
    // { Header: "Modified Date", accessor: "MODIFIED_DATE", Cell: ({ row, value }) => <span>{value ? new Date(value).toLocaleString() : "N/A"}</span> },  
    {
      Header: "Action",
      accessor: "action", // Will be handled by custom render
      Cell: ({ row }) => (
        <div className="flex space-x-4">
          {/* Edit Button */}
          {/* {!addButtonDisabled && <button
            onClick={() => {
              setViewedData(row.original)
              document.getElementById('addPayment').showModal();
            }}
            className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
            <BiEdit className="mr-2 text-lg" /> 
            Edit
          </button>} */}


          <button
            onClick={async () => {
              //viewPaymentModal
              setViewedData(row.original);
              document.getElementById('viewPaymentModal').showModal();



              let deceasedId = row.original.DECEASED_ID;

              let filteredDeceased = deceasedList.find(d => d.value === deceasedId)




              setIsLoaded(false);
              let res = await axios({
                method: 'get',
                url: `deceased/getPayments/${deceasedId}`,

              });



              setactivePaymentList(res.data.data);
              // setFieldTouched('DECEASED_ID', true);
              // setFieldValue('DECEASED_ID', deceasedId);
              // setFieldValue('ADDED_BY', filteredDeceased.payeeName)


              setdeceasedId(deceasedId);

              setIsLoaded(true);

            }}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg
             hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300">
            <BiInfoCircle className="mr-2 text-lg" /> {/* Archive Icon */}
            View Payments
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
    navigate(
      `${ROUTE_ADMIN_MAPPING}?id=${data.id}&location=${data.place}`
    );
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
        DECEASED_ID: '',
        ADDED_BY: '',
        NUM_YEARS_PAY: '',
        AMOUNT_PER_YEAR: '',
        AMOUNT: '',
        ORDER_NO: '',
        PERMIT_NO: '',
        DATE_PAID: Date.now(),
        DECEASED_NAME: '',
        NEXT_PAYMENT_DATE: paymentListPerDeceased?.NEXT_PAYMENT_DATE || '',
        PENDING_PAYMENTS_TO_SAVE: []
      },
      validationSchema: Yup.object({


        DECEASED_ID: Yup.string().required('Required'),
        // ADDED_BY: Yup.string().required('Required'),
        // NUM_YEARS_PAY: Yup.number().required('Required'),
        // AMOUNT_PER_YEAR: Yup.number().required('Required'),
        // ORDER_NO: Yup.string().required('Required'),
        // PERMIT_NO: Yup.string().required('Required'),
        // DATE_PAID: Yup.string().required('Required'),

        // AMOUNT: Yup.number().required('Required')
      }),
      // validateOnMount: true,
      // validateOnChange: false,
      onSubmit: async (values, { setFieldTouched, setFieldValue, setFieldError, setSubmitting, resetForm }) => {
        setSubmitting(true);


        let AMOUNT = values.AMOUNT_PER_YEAR * values.NUM_YEARS_PAY



        let DECEASED_NAME = deceasedList.find(d => d.value === values.DECEASED_ID).label;




        try {

          setIsLoaded(false)


          const paymentDateRange = (values.PENDING_PAYMENTS_TO_SAVE || []).sort((a, b) => b.SEQ_NO - a.SEQ_NO);


          let NEXT_PAYMENT_DATE = paymentDateRange[0].NEXT_PAYMENT_DATE



          // console.log({ NEXT_PAYMENT_DATE })


          let res = await axios({
            method: 'POST',
            url: 'payments/create',
            data: { ...values, DECEASED_NAME, AMOUNT, NEXT_PAYMENT_DATE: NEXT_PAYMENT_DATE }
          });



          let deceasedId = values.DECEASED_ID;
          let res2 = await axios({
            method: 'get',
            url: `deceased/getPayments/${deceasedId}`,

          });



          setFieldValue('NUM_YEARS_PAY', 0);
          setactivePaymentList([])

          setactivePaymentList(res2.data.data);
          setFieldTouched('DECEASED_ID', true);
          setFieldValue('DECEASED_ID', deceasedId);
          // setFieldValue('ADDED_BY', filteredDeceased.payeeName)


          setdeceasedId(deceasedId);

          setIsLoaded(true)
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

          // searchDeased();
          // resetForm();
          // setactivePaymentList([])
          // setOpenCreateAccount(false)
          document.getElementById('addPayment').close();

          // // Extract the last date from the range
          // const lastDateStr = paymentDateRange.split(" - ")[1];


          // console.log({ lastDateStr })
          // // Parse the last date
          // const [month, day, year] = lastDateStr.split('/').map(num => parseInt(num, 10));

          // // Create a Date object for the last date
          // // Create a Date object for the last date
          // const lastDate = new Date(year, month - 1, day);

          // // Add one day to the last date (keeping the month and year unchanged)
          // lastDate.setDate(lastDate.getDate() + 1);

          // // Format the next payment date to match the "MM/DD/YYYY" format
          // const NEXT_PAYMENT_DATE = `${lastDate.getMonth() + 1}/${lastDate.getDate()}/${lastDate.getFullYear()}`

          // console.log({ NEXT_PAYMENT_DATE }); // Output: "12/4/2026"

          // const nextPaymentDate = new Date(NEXT_PAYMENT_DATE);  // Example date

          // // Adjust to Manila time zone
          // const manilaDate = nextPaymentDate.toLocaleString('en-PH', {
          //   timeZone: 'Asia/Manila',
          //   year: 'numeric',
          //   month: '2-digit',
          //   day: '2-digit',
          // }).split(',')[0];  // Extract the date part (YYYY-MM-DD)
          // // Now add the time '00:00:00' to the date
          // const date = new Date(manilaDate);
          // const formattedDate = date.getFullYear() + '-' +
          //   (date.getMonth() + 1).toString().padStart(2, '0') + '-' +
          //   date.getDate().toString().padStart(2, '0') + ' 00:00:00';

          // console.log(formattedDate);  // Output: "2026-12-16 00:00:00"tput: "2026-12-16 00:00:00"



          // let res = await axios({
          //   method: 'POST',
          //   url: 'payments/create',
          //   data: { ...values, DECEASED_NAME, AMOUNT, NEXT_PAYMENT_DATE: formattedDate }
          // });


          // searchDeased()
          // fetchAllDeceased()
          // fetchAllPayments()

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
          // document.getElementById('addPayment').close();

        } catch (error) {

          console.log(error)

        }

      }
    };
  };

  const formikConfigUpdate = (viewedData) => {






    // console.log(selectedFaq.Admin_Fname)

    console.log({ viewedData: viewedData })


    return {
      initialValues: {
        DECEASED_NAME: viewedData.DECEASED_NAME,
        DECEASED_ID: '',
        ADDED_BY: viewedData.ADDED_BY,
        NUM_YEARS_PAY: viewedData.NUM_YEARS_PAY,
        AMOUNT_PER_YEAR: viewedData.AMOUNT_PER_YEAR,
        AMOUNT: '',
        ORDER_NO: viewedData.ORDER_NO,
        PERMIT_NO: viewedData.PERMIT_NO,
        DATE_PAID: viewedData.DATE_PAID,
        NEXT_PAYMENT_DATE: ''

      },
      validationSchema: Yup.object({
        born: Yup.date().required('Date Paid is required'),
        yearsPaid: Yup.number()
          .required('Number of Years Paid is required')
          .positive('Must be a positive number')
          .integer('Must be an integer'),
        permitNumber: Yup.string().required('Permit # is required'),
        ORNumber: Yup.string().required('OR # is required'),
        Amount: Yup.number()
          .required('Amount is required')
          .positive('Must be a positive number'),

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
            method: 'POST',
            url: 'payments/create',
            data: {
              ...values,
              deceasedId: viewedData.deceasedId
            }
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
          // setOpenCreateAccount(false)
          document.getElementById('viewPaymentModal').close();

        } catch (error) {

          console.log(error)

        }

      }
    };
  };


  useEffect(() => {
    if (result.status === "fulfilled") {
      setIsLoaded(true)

    }
  }, []);

  return (
    <Box>
      {!addButtonDisabled && <Button
        variant="contained"
        onClick={() => document.getElementById('addPayment').showModal()}
        // onClick={() => setOpenCreateAccount(true)}
        startIcon={<AddIcon />}
      >
        Add Payment
      </Button>}
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
        data={paymentList || []}
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
                  <MenuItem value={"East Valencia Cemetery"}>
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

      <dialog id="addPayment" className="modal">
        <div className="modal-box w-full max-w-5xl">

          {/* if there is a button in form, it will close the modal */}
          <button
            onClick={() => {
              setViewedData({});
              document.getElementById("addPayment").close();
            }}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 mb-4">✕</button>

          {/* <div className="modal-header flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-t-lg">
            <h1 className="text-xl font-semibold">Payment Information</h1>

          </div> */}
          <div className="p-2 space-y-4 md:space-y-6 sm:p-4">


            <div className="modal-header flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-t-lg">
              <h1 className="text-xl font-semibold">Add Rental Payment</h1>

            </div>

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


                return <Form className="">
                  <div className="">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">


                      <div className="p-4">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                          Name of the Deceased
                        </label>

                        <Dropdown
                          // icons={mdiAccount}

                          name="DECEASED_ID"
                          type="text"
                          placeholder=""

                          setFieldValue={setFieldValue}
                          onBlur={handleBlur}
                          options={deceasedList}
                          functionToCalled={async (deceasedId) => {


                            let filteredDeceased = deceasedList.find(d => d.value === deceasedId)




                            setIsLoaded(false);
                            let res = await axios({
                              method: 'get',
                              url: `deceased/getPayments/${deceasedId}`,

                            });



                            setactivePaymentList(res.data.data);
                            setFieldTouched('DECEASED_ID', true);
                            setFieldValue('DECEASED_ID', deceasedId);
                            setFieldValue('ADDED_BY', filteredDeceased.payeeName)


                            setdeceasedId(deceasedId);

                            setIsLoaded(true);

                            // if (paymentListPerDeceased && paymentListPerDeceased.NEXT_PAYMENT_DATE) {
                            //   setFieldValue('DATE_PAID', new Date(paymentListPerDeceased.NEXT_PAYMENT_DATE).toISOString().split('T')[0])
                            // }


                          }}

                        />
                        {/* <input
                          id="firstName"
                          type="text"
                          value={`${values.firstName} ${values.lastName}`}

                          className="mt-2 p-2 w-full border border-gray-300 rounded-md bg-gray-200 text-gray-500 cursor-not-allowed focus:outline-none"
                        /> */}
                      </div>
                      <div className="p-4">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                          Payee Namesss
                        </label>
                        <InputText
                          isRequired
                          disabled
                          isReadOnly={true}

                          name="ADDED_BY"
                          type="text"
                          value={values.ADDED_BY}

                          onBlur={handleBlur} // This apparently updates `touched`?
                        />
                      </div>

                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      <InputText
                        isRequired
                        label=""
                        name="DATE_PAID"
                        type="hidden"
                        value={values.DATE_PAID}

                        onBlur={handleBlur} // This apparently updates `touched`?
                      />

                      {/* <InputText
                        isRequired
                        label="Permit #"
                        name="PERMIT_NO"
                        type="text"
                        value={values.PERMIT_NO}
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
                        name="ORDER_NO"
                        type="text"
                        value={values.ORDER_NO}
                        // onChange={(e) =>
                        //   setFieldData((prev) => ({
                        //     ...prev,
                        //     datePermit: e.target.value,
                        //   }))
                        // }
                        onBlur={handleBlur} // This apparently updates `touched`?
                      /> */}




                    </div>
                    {
                      isLoaded ? <PaymentCalculator
                        viewedData={viewedData}
                        isViewOnly={false}
                        setFieldValue={setFieldValue}
                        values={values}
                        handleBlur={handleBlur}
                        activePaymentList={activePaymentList}
                        deceasedList={deceasedList}

                      /> : <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
                      </div>

                    }



                    {/* <div className="grid grid-cols-1 gap-3 md:grid-cols-1">
                      <InputText
                        isRequired
                        label="Amount"
                        name="Amount"
                        type="text"
                        value={values.Amount}

                        onBlur={handleBlur} // This apparently updates `touched`?
                      />


                    </div> */}

                    {
                      values.NUM_YEARS_PAY && values.AMOUNT_PER_YEAR && values.PERMIT_NO && values.ORDER_NO ?

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
                            document.getElementById('addPayment').close();
                          }}>
                            Close
                          </button>
                        </div> : <div></div>


                    }

                  </div>

                  {/* <div className="modal-action">
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
                        document.getElementById('addPayment').close();
                      }}>
                        Close
                      </button>
                    </div> */}

                </Form>
              }}
            </Formik>

          </div>
          {/* <div className="modal-action">
            <form method="dialog">
         
              <button className="btn">Close</button>
            </form>
          </div> */}
        </div>
      </dialog>

      <dialog id="viewPaymentModal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">

          {/* if there is a button in form, it will close the modal */}
          <button
            onClick={() => {
              setViewedData({});
              document.getElementById("viewPaymentModal").close();
            }}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 mb-4">✕</button>

          <div className="modal-header flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-t-lg">
            <h1 className="text-xl font-semibold">Payment Details</h1>
            {/* <ReactToPrint
              trigger={() => <button className="mb-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded">Print Table</button>}
              content={() => this.tableRef}
            /> */}


          </div>

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


              console.log({ values })

              return <Form id="table-container"

              >
                <div className="">



                  {
                    isLoaded ? <PaymentCalculator
                      viewedData={viewedData}
                      isViewOnly={true}
                      setFieldValue={setFieldValue}
                      values={values}
                      handleBlur={handleBlur}
                      activePaymentList={activePaymentList}
                      isReadOnly={true}
                      deceasedList={deceasedList}

                    /> : <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
                    </div>

                  }





                </div>


              </Form>
            }}
          </Formik>
          {/* <div className="modal-action">
            <form method="dialog">
         
              <button className="btn">Close</button>
            </form>
          </div> */}
        </div>
      </dialog>



      <ToastContainer />
    </Box>
  );
};
