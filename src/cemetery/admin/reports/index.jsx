import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import axios from 'axios';

export const Reports = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [period, setPeriod] = useState("Annual");
  const [payments, setPayments] = useState([]);



  const [isLoaded, setIsLoaded] = useState(false);


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




  return isLoaded ?
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="space-y-4">
        <button onClick={exportToExcel} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Export to Excel
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Year:</label>
            <select className="w-full p-2 border rounded" value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="">Select a year</option>
              {[2024, 2025].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Select Period:</label>
            <select className="w-full p-2 border rounded" value={period} onChange={(e) => setPeriod(e.target.value)}>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kind of Payment</th>
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
