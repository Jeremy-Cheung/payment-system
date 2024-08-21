import React, { useState, useEffect } from "react";
import ItemList from "../../../components/common/ItemList"; // Make sure this path is correct
import Box from "@mui/material/Box";

// Define the client interface to match the data shape
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

export default function ListClient() {
  const apiUrl = "http://localhost:5000";
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(`${apiUrl}/clients`); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Client[] = await response.json();
        setClients(data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchClients();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (clients.length === 0) return <div>Loading...</div>;

  return (
    <Box sx={{ paddingTop: 8 }}>
      {clients.map((client) => (
        <ItemList
          key={client.client_id}
          client_id={client.client_id}
          first_name={client.first_name}
          last_name={client.last_name}
          addr_line1={client.addr_line1}
          addr_line2={client.addr_line2}
          addr_line3={client.addr_line3}
          postcode={client.postcode}
          country={client.country}
          phone_number={client.phone_number}
          bank_acct_no={client.bank_acct_no}
        />
      ))}
    </Box>
  );
}
