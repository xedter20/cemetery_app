import React, { useEffect, useState, useMemo } from "react";
import { Grid2, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

import LOGO from "../../assets/Buenavista-sm.png";
import BG from "../../assets/main-bg.jpg";
import { useNavigate } from "react-router-dom";
import { SearchTextField } from "../../shared/TextFields";

import ModalMenu from "../../shared/Modal/ModalMenu";
import MenuIcon from "@mui/icons-material/Menu";

import {
  MODAL_CLICK_ABOUT,
  MODAL_CLICK_CLOSE,
  MODAL_CLICK_CONTACT_US,
  MODAL_CLICK_HOME,
  MODAL_CLICK_LOGOUT,
  ROUTE_ABOUT,
  ROUTE_CONTACT_US,
  ROUTE_FINDER,
  ROUTE_LOGIN,
} from "../../constants";

import { useLazyClientSearchDeceasedQuery } from "../../service/clientService";
import { resetStorage } from "../../utility";



import { format } from "date-fns";


import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon, Filter, X } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"


import axios from 'axios';


import { ROUTE_GUEST_MAP_SETTING } from "./../../constants";


const mockData = [
  {
    id: "1",
    firstName: "John",
    middleName: "Robert",
    lastName: "Doe",
    dateOfDeath: "2022-05-15",
    cemetery: "Green Hills Memorial",
  },
  {
    id: "2",
    firstName: "Jane",
    middleName: "Marie",
    lastName: "Smith",
    dateOfDeath: "2023-01-22",
    cemetery: "Oakwood Cemetery",
  },
  {
    id: "3",
    firstName: "Michael",
    middleName: "James",
    lastName: "Johnson",
    dateOfDeath: "2021-11-30",
    cemetery: "Riverside Cemetery",
  },
  {
    id: "4",
    firstName: "Emily",
    middleName: "Rose",
    lastName: "Williams",
    dateOfDeath: "2023-03-10",
    cemetery: "Green Hills Memorial",
  },
  {
    id: "5",
    firstName: "David",
    middleName: "Lee",
    lastName: "Brown",
    dateOfDeath: "2022-09-05",
    cemetery: "Oakwood Cemetery",
  },
  {
    id: "6",
    firstName: "Sarah",
    middleName: "Elizabeth",
    lastName: "Jones",
    dateOfDeath: "2023-02-18",
    cemetery: "Riverside Cemetery",
  },
  {
    id: "7",
    firstName: "Robert",
    middleName: "Thomas",
    lastName: "Wilson",
    dateOfDeath: "2021-07-12",
    cemetery: "Green Hills Memorial",
  },
  {
    id: "8",
    firstName: "Jennifer",
    middleName: "Ann",
    lastName: "Taylor",
    dateOfDeath: "2022-12-03",
    cemetery: "Oakwood Cemetery",
  },
  {
    id: "9",
    firstName: "William",
    middleName: "George",
    lastName: "Anderson",
    dateOfDeath: "2023-04-25",
    cemetery: "Riverside Cemetery",
  },
  {
    id: "10",
    firstName: "Lisa",
    middleName: "Marie",
    lastName: "Martin",
    dateOfDeath: "2021-10-08",
    cemetery: "Green Hills Memorial",
  },
];

const cemeteries = [
  "Banban", "East-Valencia", "Old Poblacion"
];




export const Finder = () => {
  const [search, setSearch] = React.useState();
  const [searchDeased, result] = useLazyClientSearchDeceasedQuery(search);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const onModalMenuClick = (id) => {
    switch (id) {
      case MODAL_CLICK_CLOSE:
        setOpen(false);
        break;
      case MODAL_CLICK_ABOUT:
        navigate(ROUTE_ABOUT);
        break;
      case MODAL_CLICK_CONTACT_US:
        navigate(ROUTE_CONTACT_US);
        break;
      case MODAL_CLICK_HOME:
        navigate(ROUTE_FINDER);
        break;
      case MODAL_CLICK_LOGOUT:
        resetStorage();
        navigate(ROUTE_LOGIN);
        break;
    }
  };



  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilters, setSelectedFilters] = useState(["firstName", "lastName"])
  const [selectedCemetery, setSelectedCemetery] = useState(null)
  const [dateOfDeath, setDateOfDeath] = useState()
  const [filteredResults, setFilteredResults] = useState([])

  const [isLoaded, setIsLoaded] = useState(false)


  const [deceasedList, setDeceasedList] = useState([]);
  const fetchAllDeceased = async () => {
    let res = await axios({
      method: 'get',
      url: 'deceased/list'
    });

    let data = res.data.data

    let mappedData = data.map((data) => {
      return {
        id: data.DECEASED_ID,
        firstName: data.FNAME,
        middleName: data.MNAME,
        lastName: data.LNAME,
        dateOfDeath: data.DIED,
        cemetery: data.CMTRY_LOC,
        place: data.CMTRY_LOC,
      }
    })
    setDeceasedList(mappedData)


    setIsLoaded(true)
  }


  useEffect(() => {
    fetchAllDeceased()

  }, [])


  const handleFilterToggle = (filter) => {
    setSelectedFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setSelectedFilters(["firstName", "lastName"])
    setSelectedCemetery(null)
    setDateOfDeath(undefined)
  }

  const filterResults = useMemo(() => {
    return (searchTerm) => {
      if (!searchTerm.trim()) return []
      return deceasedList.filter((record) => {
        const matchesSearch = selectedFilters.some((filter) =>
          record[filter].toLowerCase().includes(searchTerm.toLowerCase()),
        )
        const matchesCemetery = !selectedCemetery || record.cemetery === selectedCemetery
        const matchesDate = !dateOfDeath || record.dateOfDeath === format(dateOfDeath, "yyyy-MM-dd")
        return matchesSearch && matchesCemetery && matchesDate
      })
    }
  }, [selectedFilters, selectedCemetery, dateOfDeath, deceasedList])

  useEffect(() => {

    console.log({ deceasedList })
    const results = filterResults(searchTerm)
    setFilteredResults(results)
  }, [searchTerm, filterResults, deceasedList])

  const onEditRoutes = (data) => {

    // const url = `${ROUTE_GUEST_MAP_SETTING}?id=${data.id}&location=${data.place}`;

    // // Open the URL in a new tab
    // window.open(url, "_blank");
  };

  return isLoaded && (
    <Paper
      sx={{
        background: "black",
        minHeight: "100vh",
        display: "flex",
        backgroundImage: `url("${BG}")`,
      }}
    >
      <Box
        justifyContent={"flex-end"}
        sx={{
          display: "flex",
          padding: "2rem",
          top: 0,
          right: 0,
          position: "absolute",
        }}
      >
        <Box sx={{ border: "1px solid white" }}>
          <Button
            onClick={() => setOpen(true)}
            sx={{ p: 1, background: "transparent", width: "130px" }}
            variant="contained"
            endIcon={<MenuIcon />}
          >
            MENU
          </Button>
        </Box>
      </Box>
      <Box
        justifyContent={"center"}
        alignItems={"center"}
        sx={{
          background: "rgba(0,0,0, 0.6)",
          width: "100%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Grid2
          sx={{
            width: "800px",
          }}
          container
          justifyContent={"start"}
          alignItems={"center"}
          alignContent={"center"}
        >
          <Stack
            spacing={1}
            direction={"column"}
            justifyItems={"center"}
            justifyContent={"center"}
            sx={{ margin: 2 }}
          >
            <Box sx={{ display: "flex", justifyContent: "start" }}>
              <img src={LOGO} height={100} />
            </Box>
            <Typography
              textAlign={"start"}
              color="white"
              variant="body1"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              BUENAVISTA, GUIMARAS
            </Typography>
            <Typography
              textAlign={"start"}
              color="white"
              variant="h5"
              noWrap
              component="div"
              fontWeight={900}
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              PUBLIC CEMETERY MANAGEMENT
            </Typography>
            <Typography
              variant="caption"
              color="white"
              fontWeight={100}
              textAlign={"start"}
            >
              (OLD POBLACION | EAST VALENCIA | BANBAN CEMETERY)
            </Typography>

          </Stack>
          <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Cemetery Records Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter search term"
                    className="flex-grow"
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <Label className="text-sm font-medium">Filters</Label>
                          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                            <X className="h-4 w-4 mr-2" />
                            Clear All
                          </Button>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Search in:</Label>
                          <div className="mt-2 space-y-2">
                            {["firstName", "middleName", "lastName"].map((filter) => (
                              <div key={filter} className="flex items-center space-x-2">
                                <Checkbox
                                  id={filter}
                                  checked={selectedFilters.includes(filter)}
                                  onCheckedChange={() => handleFilterToggle(filter)}
                                />
                                <Label htmlFor={filter} className="capitalize">
                                  {filter.replace(/([A-Z])/g, " $1").trim()}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Cemetery:</Label>
                          <RadioGroup value={selectedCemetery || ""} onValueChange={setSelectedCemetery} className="mt-2">
                            {cemeteries.map((cemetery) => (
                              <div key={cemetery} className="flex items-center space-x-2">
                                <RadioGroupItem value={cemetery} id={cemetery} />
                                <Label htmlFor={cemetery}>{cemetery}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Date of Death:</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={`w-full justify-start text-left font-normal mt-2 ${!dateOfDeath && "text-muted-foreground"}`}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateOfDeath ? format(dateOfDeath, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={dateOfDeath} onSelect={setDateOfDeath} initialFocus />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  {searchTerm.trim() === "" ? (
                    <p className="text-center text-gray-500">Enter a search term to see results</p>
                  ) : filteredResults.length === 0 ? (
                    <p className="text-center text-gray-500">No results found</p>
                  ) : (
                    filteredResults.map((record) => (
                      <Card key={record.id}
                        onClick={() => {

                          const url = `${ROUTE_GUEST_MAP_SETTING}?id=${record.id}&location=${record.place}`;

                          // Open the URL in a new tab
                          window.open(url, "_blank");
                        }}

                      >
                        <CardContent className="p-4">
                          <h3 className="font-semibold">{`${record.firstName} ${record.middleName} ${record.lastName}`}</h3>
                          <p className="text-sm text-gray-500">{`Date of Death: ${record.dateOfDeath}`}</p>
                          <p className="text-sm text-gray-500">{`Cemetery: ${record.cemetery}`}</p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

        </Grid2>
      </Box>
      <ModalMenu open={open} handleClick={(id) => onModalMenuClick(id)} />
    </Paper>
  );
};
