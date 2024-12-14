import { Box, Grid2, Stack, Typography } from "@mui/material";
import DashboardItem from "./dashboard-item";
import totalPaymentImg from "../../../assets/total_payment.png";
import treasurerImg from "../../../assets/treasurer.png";
import guestImg from "../../../assets/guest.png";
import economicImg from "../../../assets/economic_enter.png";


export const Dashboard = () => {
  

  const dashboardValues = [
    {
      name: "Local Economics Enterprise",
      imageSrc: economicImg,
      value: 10,
    },
    {
      name: "Municipal Treasurer",
      imageSrc: treasurerImg,
      value: 20,
    },
    {
      name: "Guest",
      imageSrc: guestImg,
      value: 20,
    },
    {
      name: "Total Payment",
      imageSrc: totalPaymentImg,
      value: 10,
    },
  ];

  return (
    <Grid2 container spacing={2}>
     
        {dashboardValues.map((item) => {
          return (
            <Grid2 sm={12}>
              <DashboardItem
                title={item.name}
                value={item.value}
                imageSrc={item.imageSrc}
              />
            </Grid2>
          );
        })}
     
    </Grid2>
  );
};