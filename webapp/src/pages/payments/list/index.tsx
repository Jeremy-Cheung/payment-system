import React, { useState, useEffect } from "react";
import PaymentList from "../../../components/common/PaymentList"; // Make sure this path is correct
import Box from "@mui/material/Box";

// Define the client interface to match the data
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

export default function ListPayment() {
  const apiUrl = "http://localhost:5000";
  const [payments, setPayments] = useState<Payment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(`${apiUrl}/payments`); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Payment[] = await response.json();
        console.log("Payments Data:", data);
        setPayments(data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchClients();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (payments.length === 0) return <div>Loading...</div>;

  return (
    <Box sx={{ paddingTop: 8 }}>
      {payments.map((payments) => (
        <PaymentList
          key={payments.payment_id}
          payment_id={payments.payment_id}
          client={payments.client}
          amount={payments.amount}
          currency={payments.currency}
          rcpt_first_name={payments.rcpt_first_name}
          rcpt_last_name={payments.rcpt_last_name}
          rcpt_bank_name={payments.rcpt_bank_name}
          rcpt_acct_no={payments.rcpt_acct_no}
          notes={payments.notes}
          status={payments.status}
        />
      ))}
    </Box>
  );
}