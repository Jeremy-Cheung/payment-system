import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";

interface Client {
  client_id: number;
  first_name: string;
  last_name: string;
  addr_line1: string;
  addr_line2?: string;
  addr_line3?: string;
  postcode: string;
  country: string;
  phone_number: string;
  bank_acct_no?: string;
}

export default function ItemList({
  client_id,
  first_name,
  last_name,
  addr_line1,
  addr_line2,
  addr_line3,
  postcode,
  country,
  phone_number,
  bank_acct_no,
}: Client) {
  const [open, setOpen] = useState(false);

  const toggleCollapse = () => {
    setOpen(!open);
  };

  return (
    <Box border={1} borderColor="#656566" borderRadius={1} p={2}>
      <Grid container spacing={2} alignItems="center" onClick={toggleCollapse} style={{ cursor: 'pointer' }}>
        <Grid item xs={12}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} sm={2}>
              <Typography variant="body2">
                <strong>Client ID:</strong> {client_id}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Typography variant="body2">
                <strong>First Name:</strong> {first_name}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Typography variant="body2">
                <strong>Last Name:</strong> {last_name}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Typography variant="body2">
                <strong>Country:</strong> {country}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Typography variant="body2">
                <strong>Phone Number:</strong> {phone_number}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2} container justifyContent="flex-end" alignItems="center">
              {open ? <ExpandLess /> : <ExpandMore />}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Box mt={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={2}>
              <Typography variant="body2">
                <strong>Address Line 1:</strong> {addr_line1}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Typography variant="body2">
                <strong>Address Line 2:</strong> {addr_line2}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Typography variant="body2">
                <strong>Address Line 3:</strong> {addr_line3}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Typography variant="body2">
                <strong>Postcode:</strong> {postcode}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Typography variant="body2">
                <strong>Bank Account:</strong> {bank_acct_no}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Box>
  );
}