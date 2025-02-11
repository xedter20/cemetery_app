import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"


import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { toast } from "@/components/ui/use-toast"
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

import { format } from "date-fns";


import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"



const EmailEditor = ({ setSubject, setMessage, email = '', message = '', subject = '', setEmail, amount = 0,
  dueDate = '', deceaseName = '', cemeteryLocation = '', payeeFullName = '' }) => {



  console.log({ email })





  // Handle changes to subject and message inputs

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };




  const handleSubmit = async (e) => {
    try {

      e.preventDefault()


      if (!email || !message) {

        toast.error('Email and message content is required', {
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
        let res = await axios({
          method: 'POST',
          url: 'sendPaymentReminder',
          data: {
            email: email,
            message: message
          }
        });
        toast.success('Sent Successfully!', {
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

      }




    } catch (error) {

      toast.error('Something went wrong!', {
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


    }



    // Here you would typically send the email using an API
    // For this example, we'll just show a success message
    // toast({
    //   title: "Email Sent",
    //   description: "Your reminder email has been sent successfully.",
    // })
  }


  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Compose Payment Reminder Email</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Recipient Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="recipient@example.com"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" type="text" value={subject}
            onChange={handleSubjectChange}

            required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" rows={10}
            value={message} // Ensure message state is bound to the textarea
            onChange={handleMessageChange}
            required />
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full"
          onClick={handleSubmit}

        >
          Send Reminder
        </Button>
      </CardFooter>

    </Card>
  )
}


export const Notification = () => {
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("Payment Reminder")



  const [searchTerm, setSearchTerm] = useState("")
  const [dueDateFilter, setDueDateFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const [message, setMessage] = useState(
    `Dear ${selectedUser?.PAYEE_FNAME || "Valued Customer"} ${selectedUser?.PAYEE_LNAME || ""},\n\n
    This is a friendly reminder that your payment (${selectedUser?.AMOUNT_PER_YEAR ? selectedUser?.AMOUNT_PER_YEAR.toFixed(2) : "0.00"}) is due on (${selectedUser?.NEXT_PAYMENT_DATE ? format(selectedUser?.NEXT_PAYMENT_DATE, "PPP") : "N/A"}) for ${selectedUser?.DECEASED_NAME || "your loved one"} located at ${selectedUser?.CMTRY_LOC || "the cemetery"}. Please ensure to make the payment at your earliest convenience. If you have any questions or concerns, please don't hesitate to contact us.\n\n
    Thank you for your prompt attention to this matter.\n\n
    Best regards,\n`
  );



  const [isOpen, setModalOpen] = useState(false)



  // const users = [
  //   { id: 1, name: "John Doe", email: "john@example.com", dueAmount: 100, dueDate: "2023-06-15" },
  //   { id: 2, name: "Jane Smith", email: "jane@example.com", dueAmount: 150, dueDate: "2023-06-20" },
  //   { id: 3, name: "Bob Johnson", email: "bob@example.com", dueAmount: 200, dueDate: "2023-06-25" },
  // ]


  const [payeeList, setPayeeList] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(1);

  const fetchAllPayee = async () => {
    try {
      let res = await axios({
        method: 'get',
        url: 'fetchAllDuePayments',
        params: { month: selectedMonth },
      });

      let data = res.data.data;
      setPayeeList(data);
    } catch (error) {
      console.error('Error fetching payee data:', error);
    }
  };


  useEffect(() => {
    fetchAllPayee()

  }, [selectedMonth])



  useEffect(() => {
    if (selectedUser && selectedUser.PAYEE_EMAIL) {
      setEmail(selectedUser.PAYEE_EMAIL)

      setMessage(`Dear ${selectedUser?.PAYEE_FNAME} ${selectedUser?.PAYEE_LNAME},\n\nThis is a friendly reminder that your payment (${selectedUser?.AMOUNT_PER_YEAR.toFixed(2)}) is due on (${selectedUser?.NEXT_PAYMENT_DATE && format(selectedUser?.NEXT_PAYMENT_DATE, "PPP")} for ${selectedUser?.DECEASED_NAME} located at ${selectedUser?.CMTRY_LOC}. Please ensure to make the payment at your earliest convenience.\n\nIf you have any questions or concerns, please don't hesitate to contact us.\n\nThank you for your prompt attention to this matter.\n\nBest regards,\n`)

    }




  }, [selectedUser])




  const openModal = (user) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }



  const filteredUsers = useMemo(() => {
    return payeeList.filter((user) => {
      const matchesSearch =
        user.PAYEE_FNAME.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.PAYEE_EMAIL.toLowerCase().includes(searchTerm.toLowerCase())



      return matchesSearch
    })
  }, [searchTerm, dueDateFilter, payeeList])


  const handleMonthChange = (value) => {
    console.log('Selected month:', value);
    setSelectedMonth(value);
    fetchAllPayee();
  };

  return <div>
    <div className="space-y-2">

      <div className="space-y-2 mb-4">
        <Label htmlFor="month-duration">Select Upcoming Due Duration (in Months)</Label>
        <Select id="month-duration" onValueChange={handleMonthChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => (
              <SelectItem key={i + 1} value={i + 1}>
                {i + 1} Month{(i > 0) ? 's' : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
    <Tabs defaultValue="users" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="users">Payee List</TabsTrigger>
        <TabsTrigger value="compose">Compose Reminder</TabsTrigger>
      </TabsList>
      <TabsContent value="users">
        {/* <UserList onSendReminder={openModal} /> */}
        <div className="flex space-x-4 justify-end mt-2 mb-2">
          <Input
            placeholder="Search by payee name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          {/* <Select value={dueDateFilter} onValueChange={setDueDateFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by due date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
          </SelectContent>
        </Select> */}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Deceased Name</TableHead>
              <TableHead>Payee Name</TableHead>
              <TableHead>Payee Email</TableHead>
              <TableHead>Due Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => {

              let payeeFullName = `${user.PAYEE_FNAME} ${user.PAYEE_LNAME}`
              return <TableRow key={user.DECEASED_ID}>
                <TableCell>{user.DECEASED_NAME}</TableCell>
                <TableCell>{payeeFullName}</TableCell>
                <TableCell>{user.PAYEE_EMAIL}</TableCell>
                <TableCell>{user.AMOUNT}</TableCell>
                <TableCell>{

                  format(user.NEXT_PAYMENT_DATE, "PPP")
                }</TableCell>
                <TableCell>
                  <Button onClick={() => {
                    setModalOpen(true)
                    setSelectedUser(user)

                  }}>Send Reminder</Button>
                </TableCell>
              </TableRow>
            })}
          </TableBody>
        </Table>
      </TabsContent>
      <TabsContent value="compose">


        <EmailEditor
          setEmail={setEmail}
          setMessage={setMessage} // Ensure setMessage is passed down here as well
          setSubject={setSubject} // Ensure setSubject is passed down here
          email={email}
          subject={subject}
          message={message}
          amount={selectedUser?.AMOUNT_PER_YEAR}
          deceaseName={`${selectedUser?.DECEASED_NAME}`}
          dueDate={`${selectedUser?.NEXT_PAYMENT_DATE}`}
          cemeteryLocation={`${selectedUser?.CMTRY_LOC}`}
          payeeFullName={`${selectedUser?.PAYEE_FNAME} ${selectedUser?.PAYEE_LNAME}`}
        />
      </TabsContent>


      <Dialog open={isOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[700px]">
          {/* <DialogHeader>
          <DialogTitle>Compose Payment Reminder Email</DialogTitle>
        </DialogHeader> */}
          <EmailEditor
            setEmail={setEmail}
            setMessage={setMessage} // Ensure setMessage is passed down here as well
            setSubject={setSubject} // Ensure setSubject is passed down here
            email={email}
            subject={subject}
            message={message}
            amount={selectedUser?.AMOUNT_PER_YEAR}
            deceaseName={`${selectedUser?.DECEASED_NAME}`}
            dueDate={`${selectedUser?.NEXT_PAYMENT_DATE}`}
            cemeteryLocation={`${selectedUser?.CMTRY_LOC}`}
            payeeFullName={`${selectedUser?.PAYEE_FNAME} ${selectedUser?.PAYEE_LNAME}`}
          />
        </DialogContent>
      </Dialog>


      <ToastContainer />
      {/* This modal is redundant and should be removed */}
      {/* <EmailReminderModal 
    isOpen={isModalOpen} 
    onClose={() => setIsModalOpen(false)}
    user={selectedUser}
  /> */}
    </Tabs>
  </div>
};
