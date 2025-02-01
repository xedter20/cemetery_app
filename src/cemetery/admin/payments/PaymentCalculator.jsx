
import { useEffect, useState, useMemo, useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';

import { Button } from "@/components/ui/button"
import InputText from '../../../components/Input/InputText';
const formatDate = (date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}


const PaymentTable = ({ viewedData, activePaymentList, setFieldValue, values, isReadOnly = false }) => {

  console.log(values.NUM_YEARS_PAY)
  const [additionalYears, setAdditionalYears] = useState(values.NUM_YEARS_PAY || 0);
  const [additionalAmountPerYear, setAdditionalAmountPerYear] = useState(0);
  const [additionalPermitNo, setAdditionalPermitNo] = useState('');
  const [additionalORNo, setAdditionalORNo] = useState('');

  // Calculate total baseline years and amount
  const baselineYears = activePaymentList.reduce(
    (sum, payment) => sum + payment.NUM_YEARS_PAY,
    0
  );
  const baselineAmount = activePaymentList.reduce(
    (sum, payment) => sum + payment.AMOUNT_PER_YEAR * payment.NUM_YEARS_PAY,
    0
  );

  const totalYears = baselineYears + additionalYears;
  const totalAmount =
    baselineAmount + additionalAmountPerYear * additionalYears;



  // let currentSeqNo = activePaymentList[0]?.SEQ_NO || 1
  // let currentDate = new Date(activePaymentList[0]?.DATE_PAID)
  // Generate rows for baseline payments
  // activePaymentList.forEach((payment) => {
  //   const startDate = new Date(payment.DATE_PAID)
  //   for (let i = 0; i < payment.NUM_YEARS_PAY; i++) {
  //     const validityStartDate = new Date(startDate)
  //     validityStartDate.setFullYear(validityStartDate.getFullYear() + i)
  //     const validityEndDate = new Date(validityStartDate)
  //     validityEndDate.setFullYear(validityEndDate.getFullYear() + 1)
  //     validityEndDate.setDate(validityEndDate.getDate() - 1) // Subtract one day to get the last day of the previous year
  //     rows.push({
  //       ...payment,
  //       SEQ_NO: currentSeqNo++,
  //       AMOUNT: payment.AMOUNT_PER_YEAR.toFixed(2),
  //       DATE_PAID: payment.DATE_PAID,
  //       STATUS: 'Paid',
  //       VALIDITY_PERIOD: `${formatDate(validityStartDate)} - ${formatDate(validityEndDate)}`
  //     });
  //     currentDate = new Date(validityEndDate)
  //     currentDate.setDate(currentDate.getDate() + 1) // Set to the next day after the e
  //   }
  // });


  const rows = useMemo(() => {
    let generatedRows = [];
    let currentSeqNo = activePaymentList[0]?.SEQ_NO || 1;



    let currentDate =



      new Date(activePaymentList[0]?.DATE_PAID || Date.now());

    // Generate rows for baseline payments
    activePaymentList.forEach((payment) => {
      const startDate = new Date(currentDate);
      for (let i = 0; i < payment.NUM_YEARS_PAY; i++) {
        const validityStartDate = new Date(startDate);
        validityStartDate.setFullYear(validityStartDate.getFullYear() + i);
        const validityEndDate = new Date(validityStartDate);
        validityEndDate.setFullYear(validityEndDate.getFullYear() + 1);
        validityEndDate.setDate(validityEndDate.getDate() - 1);

        generatedRows.push({
          ...payment,
          SEQ_NO: currentSeqNo++,
          AMOUNT: payment.AMOUNT_PER_YEAR.toFixed(2),
          DATE_PAID: payment.DATE_PAID,
          STATUS: 'Paid',
          VALIDITY_PERIOD: `${formatDate(validityStartDate)} - ${formatDate(validityEndDate)}`,

        });

        currentDate = new Date(validityEndDate);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    // Generate rows for additional years
    for (let i = 0; i < additionalYears; i++) {
      const validityStartDate = new Date(currentDate);
      const validityEndDate = new Date(validityStartDate);
      validityEndDate.setFullYear(validityEndDate.getFullYear() + 1);
      validityEndDate.setDate(validityEndDate.getDate() - 1);


      const NEXT_PAYMENT_DATE_CUSTOM = new Date(validityEndDate);

      console.log({ NEXT_PAYMENT_DATE_CUSTOM })
      // Add 1 day
      NEXT_PAYMENT_DATE_CUSTOM.setDate(NEXT_PAYMENT_DATE_CUSTOM.getDate() + 1);






      // Format as YYYY-MM-DD in local time (Philippine Standard Time)
      const year = NEXT_PAYMENT_DATE_CUSTOM.getFullYear();
      const month = String(NEXT_PAYMENT_DATE_CUSTOM.getMonth() + 1).padStart(2, "0"); // Month is zero-based
      const day = String(NEXT_PAYMENT_DATE_CUSTOM.getDate()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}`;


      generatedRows.push({
        ...activePaymentList[0],
        SEQ_NO: currentSeqNo++,
        AMOUNT: additionalAmountPerYear.toFixed(2),
        ORDER_NO: additionalORNo,
        PERMIT_NO: additionalPermitNo,
        DATE_PAID: 'Pending',
        STATUS: 'Pending',
        VALIDITY_PERIOD: `${formatDate(validityStartDate)} ---- ${formatDate(validityEndDate)}`,
        NEXT_PAYMENT_DATE: formattedDate,
      });

      currentDate = new Date(validityEndDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return generatedRows;
  }, [activePaymentList, additionalYears, additionalAmountPerYear, additionalPermitNo, additionalORNo]);


  useEffect(() => {
    setFieldValue('PENDING_PAYMENTS_TO_SAVE', rows);
  }, [rows, setFieldValue]);


  console.log({ isReadOnly })
  return (
    <div className="space-y-4 p-4">
      {!isReadOnly &&

        <div className="grid grid-cols-4 gap-4 ">
          <div>
            <label
              htmlFor="additionalYears"
              className="block text-sm font-medium text-gray-700 mb-2">
              Number of Additional Years
            </label>
            <Input
              id="additionalYears"
              name="additionalYears"
              type="number"
              value={additionalYears}
              onChange={e => {

                const val = Number.parseInt(e.target.value) || 0;
                setFieldValue('NUM_YEARS_PAY', val);
                setAdditionalYears(val)
              }
              }
              min="0"
            />
          </div>
          <div>
            <label
              htmlFor="additionalAmountPerYear"
              className="block text-sm font-medium text-gray-700 mb-2">
              Additional Amount Per Year
            </label>
            <Input
              id="additionalAmountPerYear"
              name="additionalAmountPerYear"
              type="number"
              value={additionalAmountPerYear}

              onChange={e => {
                const val = Number.parseInt(e.target.value) || 0;
                setFieldValue('AMOUNT_PER_YEAR', val);
                setFieldValue('AMOUNT', val);
                setAdditionalAmountPerYear(val)
              }}
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label
              htmlFor="additionalAmountPerYear"
              className="block text-sm font-medium text-gray-700 mb-2">
              Permit #
            </label>
            <Input
              id="PERMIT_NO"
              name="PERMIT_NO"
              type="text"
              value={additionalPermitNo}

              onChange={e => {
                const val = e.target.value || '';
                setFieldValue('PERMIT_NO', val);
                setAdditionalPermitNo(val)
              }}

              min="0"

            />
          </div>

          <div>
            <label
              htmlFor="additionalAmountPerYear"
              className="block text-sm font-medium text-gray-700 mb-2">
              OR #
            </label>
            <Input
              id="ORDER_NO"
              name="ORDER_NO"
              type="text"
              value={additionalORNo}

              onChange={e => {
                const val = e.target.value || '';
                setFieldValue('ORDER_NO', val);
                setAdditionalORNo(val)
              }}

            />
          </div>

        </div>}
      <Table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
        <TableHeader className="bg-gray-100">
          <TableRow className="text-sm text-gray-500">
            <TableHead className="px-4 py-3 text-left font-medium text-gray-700">SEQ NO</TableHead>
            {/* <TableHead className="px-4 py-3 text-left font-medium text-gray-700">Deceased Name</TableHead> */}
            <TableHead className="px-4 py-3 text-left font-medium text-gray-700">Date Paid</TableHead>
            <TableHead className="px-4 py-3 text-left font-medium text-gray-700">Kind of Payment</TableHead>
            <TableHead className="px-4 py-3 text-left font-medium text-gray-700">Permit No</TableHead>
            <TableHead className="px-4 py-3 text-left font-medium text-gray-700">Order No</TableHead>
            <TableHead className="px-4 py-3 text-left font-medium text-gray-700">Amount</TableHead>
            <TableHead className="px-4 py-3 text-left font-medium text-gray-700">Status</TableHead>
            <TableHead className="px-4 py-3 text-left font-medium text-gray-700">Validity Period</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="text-sm text-gray-700">
          {rows.sort((a, b) => a.SEQ_NO - b.SEQ_NO).map((row, index) => (
            <TableRow key={index} className="border-b border-gray-200">
              <TableCell className="px-4 py-3">{index + 1}</TableCell>
              {/* <TableCell className="px-4 py-3">{row.DECEASED_NAME}</TableCell> */}
              <TableCell className="px-4 py-3">
                {row.DATE_PAID === 'Pending'
                  ? `Pending - ${new Date().toLocaleDateString()}`
                  : new Date(row.DATE_PAID).toLocaleDateString()}
              </TableCell>
              <TableCell className="px-4 py-3">{row.KIND_PAYMENT}</TableCell>
              <TableCell className="px-4 py-3">{row.PERMIT_NO}</TableCell>
              <TableCell className="px-4 py-3">{row.ORDER_NO}</TableCell>
              <TableCell className="px-4 py-3">₱{row.AMOUNT}</TableCell>
              <TableCell className="px-4 py-3">{row.STATUS}</TableCell>
              <TableCell className="px-4 py-3">{row.VALIDITY_PERIOD}</TableCell>
            </TableRow>
          ))}

          <TableRow className="bg-gray-100">
            <TableCell colSpan={7} className="text-right px-4 py-3 font-semibold text-gray-700">
              Total Amount:
            </TableCell>
            <TableCell colSpan={2} className="px-4 py-3 font-semibold text-gray-700">
              ₱{totalAmount.toFixed(2)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

    </div>
  );
};

export default function PaymentTableDemo({
  viewedData,
  activePaymentList = [],
  setFieldValue,
  values,
  deceasedList,
  isReadOnly = false
}) {
  const printableAreaRef = useRef(null)

  const handlePrint = () => {
    const printContent = printableAreaRef.current?.innerHTML;
    const printWindow = window.open('', '_blank');

    if (printWindow) {
      const styles = [...document.styleSheets]
        .map((styleSheet) => {
          try {
            return [...styleSheet.cssRules].map(rule => rule.cssText).join('\n');
          } catch (error) {
            return ''; // Ignore cross-origin stylesheets
          }
        })
        .join('\n');

      printWindow.document.write(`
        <html>
          <head>
            <title>Print Payment Records</title>
            <style>${styles}</style>
          </head>
          <body>
            ${printContent}
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() { window.close(); };
              };
            </script>
          </body>
        </html>
      `);

      printWindow.document.close();
    }
  };



  let payeeInfo = deceasedList.find((d) => {
    return d.DECEASED_ID === viewedData.DECEASED_ID
  });

  console.log({ payeeInfo })

  return <div className="container mx-auto p-4" >

    {isReadOnly && <div className='flex justify-end'>
      <Button onClick={handlePrint} className="mb-4 bg-green-500">
        Print
      </Button>
    </div>}

    <div
      id="printable-area" ref={printableAreaRef}
    >
      {isReadOnly && <div className="grid grid-cols-4">



        <div className="p-4">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
            Payee Name
          </label>
          <InputText
            isRequired
            disabled
            isReadOnly={true}

            name="ADDED_BY"
            type="text"
            value={values.ADDED_BY || viewedData.ADDED_BY}


          />
        </div>

        <div className="p-4">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
            Contact Number
          </label>
          <InputText
            isRequired
            disabled
            isReadOnly={true}

            name="PAYEE_CONTACT"
            type="text"
            value={payeeInfo?.PAYEE_CONTACT}


          />
        </div>


        <div className="p-4">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
            Name of the Deceased
          </label>
          <InputText
            isRequired
            disabled
            isReadOnly={true}

            name="ADDED_BY"
            type="text"
            value={values.DECEASED_NAME || viewedData?.DECEASED_NAME}


          />



        </div>

        <div className="p-4">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
            Cemetery Location
          </label>
          <InputText
            isRequired
            disabled
            isReadOnly={true}

            name="CMTRY_LOC"
            type="text"
            value={payeeInfo?.CMTRY_LOC}


          />


        </div>


      </div>}
      <PaymentTable
        viewedData={viewedData}
        activePaymentList={activePaymentList.sort((a, b) => a.SEQ_NO - b.SEQ_NO)}
        setFieldValue={setFieldValue}
        values={values}
        isReadOnly={isReadOnly}
      />
    </div>

  </div>
}
