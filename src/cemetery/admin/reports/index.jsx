import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import axios from 'axios';
import { Calendar } from "@/components/ui/calendar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const Reports = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [period, setPeriod] = useState("Annual");
  const [payments, setPayments] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());

  const fetchReport = async () => {
    let result = await axios({
      method: 'get',
      url: `payments_report?year=${year}&period=${period}`,
    });

    setPayments(result.data.data)
    setIsLoaded(true)
  }

  useEffect(() => {
    fetchReport()
  }, [year, period]);

  const totalPayment = payments.reduce((sum, payment) => sum + Number.parseFloat(payment.AMOUNT), 0);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(payments);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Payment_Report.xlsx");
  };

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i); // Create an array of years

  return isLoaded ?
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="space-y-4">
        <button onClick={exportToExcel} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Export to Excel
        </button>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="text-sm font-medium block mb-1">Select Year:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
                setYear(date.getFullYear());
              }}
              showYearPicker
              dateFormat="yyyy"
              className="w-full border rounded h-12 text-center"
              wrapperClassName="w-full"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium block mb-1">Select Period:</label>
            <select className="w-full p-2 border rounded h-12" value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value="Annual">Annual</option>
              <option value="Semi-Annual">Semi-Annual</option>
              <option value="Quarterly">Quarterly</option>
            </select>
          </div>
        </div>
      </div>

      <div className="text-lg font-semibold">Total Payment: {totalPayment.toFixed(2)}</div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Paid</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name of Taxpayer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">OR Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rental Payment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-6 py-4 text-sm text-gray-900">{new Date(payment.DATE_PAID).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm text-gray-900 font-bold">{payment.DECEASED_NAME}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{payment.ORDER_NO}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{payment.KIND_PAYMENT}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{payment.AMOUNT}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div> : <div>
      <div className="flex justify-center items-center h-20">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
};
