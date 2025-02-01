
import { useEffect, useState, useMemo } from "react";
import { Box, Grid2, Stack, Typography } from "@mui/material";
import DashboardItem from "./dashboard-item";
import totalPaymentImg from "../../../assets/total_payment.png";
import treasurerImg from "../../../assets/treasurer.png";
import guestImg from "../../../assets/guest.png";
import economicImg from "../../../assets/economic_enter.png";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import { useAdminRegisterUserMutation, useLazyAdminFetchUsersQuery } from "../../../service/adminService";

export const Dashboard = () => {







  const [getAdminList, result] = useLazyAdminFetchUsersQuery()

  const [isLoaded, setIsLoaded] = useState(false);

  const [dashboardValues, setDashboardValues] = useState([])
  const [paymentList, setpaymentList] = useState([])

  useEffect(() => {
    getAdminList()

  }, [])

  const fetchAllPayments = async () => {

    let res = await axios({
      method: 'POST',
      url: 'payments/all',
      data: {}
    });

    let data = res.data.data;
    setpaymentList(data)

  }
  useEffect(() => {
    fetchAllPayments();
    if (result.status === 'fulfilled') {

      const enterprise = result.data?.filter(u => u.accountType === 'enterprise')

      const treasurer = result.data?.filter(u => u.accountType === 'treasurer')


      const guest = result.data?.filter(u => u.accountType === 'guest')





      setDashboardValues([
        {
          name: "Local Economics Enterprise",
          imageSrc: economicImg,
          value: enterprise?.length || 0,
          url: '/cemetery/admin/user-management'
        },
        {
          name: "Municipal Treasurer",
          imageSrc: treasurerImg,
          value: treasurer?.length || 0,
          url: '/cemetery/admin/user-management'
        },
        {
          name: "Guest",
          imageSrc: guestImg,
          value: guest?.length || 0,
          url: '/cemetery/admin/user-management'
        },
        {
          name: "Total Payment",
          imageSrc: totalPaymentImg,
          value: paymentList.length || 0,
          url: '/cemetery/admin/payments'
        }
      ])

      setIsLoaded(true)

    }
  }, [result]);


  const navigate = useNavigate();


  return isLoaded && (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {dashboardValues.map((item, index) => (
        <div
          key={index}
          className="cursor-pointer p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center"
          onClick={() => navigate(item.url)}
        >
          <img
            src={item.imageSrc}
            alt={item.title}
            className="w-20 h-20 object-cover rounded-lg"
          />
          <h3 className="text-md font-semibold text-green-500 mt-4">
            {item.name}
          </h3>
          <p className="text-gray-600 text-sm mt-2 font-bold">{item.value}</p>
        </div>
      ))}
    </div>
  );
};