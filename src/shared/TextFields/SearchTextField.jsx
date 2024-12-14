import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { Button, Typography, List, ListItem, ListItemText } from "@mui/material";

import { useDispatch } from 'react-redux';  // Or your preferred state management

import { useLazyClientSearchDeceasedResultListDexQuery, useLazyClientSearchDeceasedQuery } from "../../service/clientService";
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export function SearchTextField({ onSearch, onChange, setErrorMessage }) {
  const [filteredNames, setFilteredNames] = React.useState([]);
  const [searchText, setSearchText] = React.useState("");
  const [dropdownVisible, setDropdownVisible] = React.useState(false);
  const debouncedFullname = useDebounce(searchText, 500);  // Debounce delay of 500ms

  const dispatch = useDispatch();

  const [triggerSearch, { data, error, isLoading }] = useLazyClientSearchDeceasedResultListDexQuery();
  const [names, setNames] = React.useState([]);
  React.useEffect(() => {
    const search = async () => {
      if (debouncedFullname) {
        try {
          const { data } = await triggerSearch(debouncedFullname);
          let { deceasedList
          } = data;


          const fullNames = deceasedList.map(deceased => {
            const { firstName, middleName, lastName } = deceased;
            // Create full name by joining first, middle, and last names
            return `${[firstName, middleName, lastName].filter(Boolean).join(' ')}` // Join if any name is available

          });
          console.log({ fullNames })
          setFilteredNames(fullNames)
        } catch (error) {
          console.error('Error during search:', error);  // Handle any errors
        }
      }
    };

    search();  // Call the async function
  }, [debouncedFullname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchText);
    setDropdownVisible(false); // Hide dropdown after search
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setErrorMessage(''); // Clear any error message
    setSearchText(value);
    if (onChange) onChange(value);

    // Filter names based on the input text
    const filtered = names.filter((name) =>
      name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredNames(filtered);

    // Only show dropdown if there is input or filtered names
    setDropdownVisible(true);
  };

  return (
    <Paper
      component="form"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: "100%",
        position: "relative",
      }}
      onSubmit={handleSearch}
    >
      <InputBase
        onChange={handleInputChange}
        value={searchText}
        fullWidth
        size="large"
        sx={{ ml: 1, flex: 1 }}
        placeholder="Juan Dela Cruz"
        inputProps={{ "aria-label": "Search user" }}
      />
      <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <Button type="submit" onClick={() => {
        onSearch(name);
      }}>
        <Typography fontWeight={800}>Search</Typography>
      </Button>

      {/* Dropdown for filtered names */}
      {dropdownVisible && (
        <List
          sx={{
            position: "absolute",
            top: "100%", // Ensures the dropdown appears directly below the input field
            width: "100%",
            maxHeight: 200,
            overflowY: "auto",
            bgcolor: "white",
            boxShadow: 3,
            borderRadius: 1,
            zIndex: 1, // Ensures dropdown appears on top
          }}
        >
          {filteredNames.length < 1 && (
            <ListItem button key={1}>
              <ListItemText primary={"No results found."} />
            </ListItem>
          )}
          {filteredNames.map((name, index) => (
            <ListItem
              button
              key={index}
              onClick={() => {
                onSearch(name);
                setDropdownVisible(false);
              }}
            >
              <ListItemText primary={name} />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}
