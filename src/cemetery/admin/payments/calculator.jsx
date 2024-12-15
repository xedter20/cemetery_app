import { useState, useEffect } from 'react'
import InputText from '../../../components/Input/InputText';


export default function CemeteryRentCalculator({
  setFieldValue,
  values,
  handleBlur
}) {

  console.log({ values })
  const [years, setYears] = useState(values.NUM_YEARS_PAY || 1)
  const [amount, setAmount] = useState(values.AMOUNT_PER_YEAR || 100)
  const [tableData, setTableData] = useState([])
  const [grandTotal, setGrandTotal] = useState(0)
  useEffect(() => {
    const currentDate = new Date(values.DATE_PAID);
    const data = Array.from({ length: years }, (_, index) => {
      const startYear = currentDate.getFullYear() + index; // Increment year based on index
      const startMonth = currentDate.getMonth(); // Use the same start month as currentDate
      const startDay = currentDate.getDate(); // Use the same start day as currentDate
      const startDate = new Date(startYear, startMonth, startDay);

      const endYear = startYear + 1; // End year is always one year ahead of the start year
      const endDate = new Date(endYear, startMonth, startDay); // Same month/day, next year

      return {
        year: index + 1,
        amount: amount,
        validityPeriod: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
      };
    });

    setTableData(data);
    setGrandTotal(amount * years);
    setFieldValue('NEXT_PAYMENT_DATE', data[data.length - 1])
  }, [years, amount, values.DATE_PAID]);

  const paymentDateRange = values.NEXT_PAYMENT_DATE.validityPeriod;

  // Extract the last date from the range

  const lastDateStr = paymentDateRange?.split(" - ")[1];



  const date = new Date(lastDateStr);

  // Increment the date by one day
  date.setDate(date.getDate() + 1);

  // Format the new date back into the desired string format
  const nextPaymentDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

  const dateInWords = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="years" className="block text-sm font-medium text-gray-700">Number of Years</label>
          {/* <input
            id="years"
            type="number"
            min="1"
            value={years}
            onChange={(e) => setYears(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            aria-describedby="years-description"
          /> */}

          <InputText
            isRequired

            name="NUM_YEARS_PAY"
            type="text"
            value={values.NUM_YEARS_PAY}
            onChange={(e) => {
              setYears(Math.max(1, parseInt(e.target.value) || 1))
              setFieldValue('NUM_YEARS_PAY', e.target.value);
              setFieldValue('AMOUNT', amount * years);

            }}
            onBlur={handleBlur} // This apparently updates `touched`?
          />

          <p id="years-description" className="text-sm text-gray-500">Enter the number of years for the calculation</p>
        </div>
        <div className="space-y-2">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount per Year (₱)</label>
          {/* <input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            aria-describedby="amount-description"
          /> */}
          <InputText
            isRequired

            name="AMOUNT_PER_YEAR"
            type="text"
            value={values.AMOUNT_PER_YEAR}
            onChange={(e) => {
              setAmount(Math.max(0, parseFloat(e.target.value) || 0))
              setFieldValue('AMOUNT_PER_YEAR', e.target.value);
              setFieldValue('AMOUNT', amount * years);
            }}
            onBlur={handleBlur} // This apparently updates `touched`?
          />

          <p id="amount-description" className="text-sm text-gray-500">Enter the amount per year in pesos</p>
        </div>
      </div>
      {tableData.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Year</th>
                <th scope="col" className="px-6 py-3">Amount (₱)</th>
                <th scope="col" className="px-6 py-3">Validity Period</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={row.year} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4">{row.year}</td>
                  <td className="px-6 py-4">₱  {row.amount.toFixed(2)}</td>
                  <td className="px-6 py-4">{row.validityPeriod}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-semibold text-gray-900">
                <td className="px-6 py-3 text-green-500">Grand Total</td>
                <td className="px-6 py-3 text-base">₱
                  {grandTotal.toFixed(2)}

                </td>
                <td></td>
              </tr>
              <tr className="font-semibold text-gray-900">
                <td className="px-6 py-3 text-green-500">Next Payment Date</td>
                <td className="px-6 py-3 text-base">


                  {nextPaymentDate} -  {dateInWords}

                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  )
}
