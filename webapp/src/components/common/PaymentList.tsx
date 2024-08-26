import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import countries from "../../utils/countries";

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

interface Payment {
  payment_id: number;
  client: Client;
  amount: number;
  currency: string;
  rcpt_first_name: string;
  rcpt_last_name: string;
  rcpt_bank_name: string;
  rcpt_acct_no: string;
  notes?: string;
  status: string;
}

export default function PaymentList({
  payment_id,
  client,
  amount,
  currency,
  rcpt_first_name,
  rcpt_last_name,
  rcpt_bank_name,
  rcpt_acct_no,
  notes,
  status: initialStatus,
}: Payment) {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState(initialStatus);

  const toggleCollapse = () => {
    setOpen(!open);
  };

  const getAlpha2CountryCode = (countryName: string) => {
    const country = countries.find((c) => c.name === countryName);
    return country ? country.code : countryName;
  };

  const buttonColor =
    status === "pending" ? "#ebb65b" : status === "approved" ? "#58d160" : "#ebb65b";

  const handleApprove = async () => {
    try {
      const response = await fetch(`http://localhost:5000/payments/${payment_id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedResponse = await fetch(`http://localhost:5000/payments/${payment_id}`);
      if (!updatedResponse.ok) {
        throw new Error('Failed to fetch updated payment');
      }

      const updatedPayment = await updatedResponse.json();
      setStatus(updatedPayment.status);
      setModalOpen(false);
    } catch (error) {
      console.error('Error approving payment:', error);
    }
  };

  return (
    <Box border={1} borderColor="#656566" borderRadius={1} p={2}>
      <Grid
        container
        spacing={2}
        alignItems="center"
        onClick={toggleCollapse}
        style={{ cursor: "pointer" }}
      >
        {/* Collapsed View */}
        <Grid item xs={12}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} sm={3}>
              <Typography variant="body2">
                <strong>
                  PAYEE: {client.first_name} {client.last_name} {"("}{getAlpha2CountryCode(client.country)}{")"} - {client.phone_number}
                </strong>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="body2">
                <strong>
                  TOTAL - {amount} {currency}
                </strong>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="body2">
                <strong>
                  RECIPIENT: {rcpt_first_name} {rcpt_last_name}
                </strong>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3} container justifyContent="flex-end" alignItems="center">
              {open ? <ExpandLess /> : <ExpandMore />}
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} container justifyContent="flex-end">
          <Button
            onClick={(e) => {
              e.stopPropagation(); // Prevents the collapse toggle
              if (status !== "approved") {
                setModalOpen(true);
              }
            }}
            variant="contained"
            sx={{ 
              backgroundColor: buttonColor, 
              '&:hover': { backgroundColor: buttonColor },
              '&:disabled': { backgroundColor: buttonColor } // Ensure color is consistent when disabled
            }}
            disabled={status === "approved"}
          >
            <Box sx={{ marginLeft: 2, marginRight: 2 }}>{status}</Box>
          </Button>
        </Grid>
      </Grid>

      <Collapse in={open}>
        <Box mt={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={2}>
              <Typography variant="body2">
                <strong>Bank:</strong> {rcpt_bank_name} {rcpt_acct_no}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={10}>
              <Box sx={{ backgroundColor: '#d9dbde', borderRadius: 1, padding: 2 }}>
                <Box>Notes</Box>
                {notes}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Collapse>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Approve Payment</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to approve this payment?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleApprove} color="primary">
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}