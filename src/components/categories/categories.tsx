import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

export default function CategoriesSelect() {
  const [age, setAge] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  return (
    <Box
      sx={{
        minWidth: { xs: "100%", md: 300 },
        mr: { xs: 0, md: 2 },
        mt: { xs: 3, md: 0 },
      }}
    >
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">All categories</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="All categories"
          value={age}
          onChange={handleChange}
        >
          <MenuItem value={10}>Sales</MenuItem>
          <MenuItem value={20}>Marketing</MenuItem>
          <MenuItem value={30}>HR sector</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
