import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import countries from "../../../utils/countries";
import Autocomplete from "@mui/material/Autocomplete";
import Notification from "../../../components/common/Notification";

const currencies = ["USD", "GBP", "EUR", "SGD", "HKD", "JPY"];

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

interface PaymentFormValues {
  client_id: number;
  amount: string;
  currency: string;
  rcpt_first_name: string;
  rcpt_last_name: string;
  rcpt_bank_name: string;
  rcpt_acct_no: string;
  notes?: string;
}

interface Errors {
  [key: string]: string;
}

export default function CreatePayment() {
  const apiUrl = "http://localhost:5000";
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [formValues, setFormValues] = useState<PaymentFormValues>({
    client_id: 0,
    amount: "",
    currency: "",
    rcpt_first_name: "",
    rcpt_last_name: "",
    rcpt_bank_name: "",
    rcpt_acct_no: "",
    notes: "",
  });
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success');
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(`${apiUrl}/clients`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  const getAlpha2CountryCode = (countryName: string) => {
    const country = countries.find((c) => c.name === countryName);
    return country ? country.code : countryName;
  };

  const handleAutocompleteChange = (_: any, client: Client | null) => {
    setSelectedClient(client);
    setFormValues((formValues) => ({
      ...formValues,
      client_id: client ? client.client_id : 0, // Update client_id based on selected client
    }));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;

    let newValue = value;

    switch (id) {
      case "rcpt_first_name":
      case "rcpt_last_name":
        newValue = value.replace(/[^a-zA-Z]/g, "");
        if (newValue.length <= 50) {
          setFormValues({ ...formValues, [id]: newValue });
        }
        break;

      case "rcpt_bank_name":
        newValue = value.replace(/[^a-zA-Z\s,.-]/g, "");
        if (newValue.length <= 50) {
          setFormValues({ ...formValues, [id]: newValue });
        }
        break;

      case "rcpt_acct_no":
        newValue = value.replace(/\D/g, "");
        if (newValue.length <= 20) {
          setFormValues({ ...formValues, [id]: newValue });
        }
        break;

      case "amount":
        newValue = value.replace(/[^0-9.]/g, "");
        const numberValue = parseFloat(newValue);
        if (newValue !== "" && !isNaN(numberValue) && numberValue >= 0.01) {
          newValue = numberValue.toFixed(2);  // Format to 2 decimal places
        } else if (newValue === "") {
          newValue = "";
        }
        setFormValues((prevValues) => ({
          ...prevValues,
          [id]: newValue,
        }));
        break;

      default:
        setFormValues({ ...formValues, [id]: value });
        break;
    }
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setFormValues((formValues) => ({
      ...formValues,
      currency: event.target.value,
    }));
  };

  const handleCloseToast = () => {
    setToastOpen(false);
  };

  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!formValues.amount) newErrors.amount = "Amount is required";
    if (!formValues.currency) newErrors.currency = "Currency is required";
    if (!formValues.rcpt_first_name)
      newErrors.rcpt_first_name = "Recipient first name is required";
    if (!formValues.rcpt_last_name)
      newErrors.rcpt_last_name = "Recipient last name is required";
    if (!formValues.rcpt_bank_name)
      newErrors.rcpt_bank_name = "Recipient bank name is required";
    if (!formValues.rcpt_acct_no)
      newErrors.rcpt_acct_no = "Recipient account number is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedClient) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        selectedClient: "You must select a client",
      }));
      return;
    }
    if (validate()) {
      try {
        console.log(formValues);
        const amountNumber = parseFloat(formValues.amount);

        if (isNaN(amountNumber) || amountNumber < 0.01) {
          throw new Error("Invalid amount");
        }

        const response = await fetch(`${apiUrl}/payments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({...formValues, amount: amountNumber,}),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Payment created successfully:", data);
        setToastMessage('Payment created');
        setToastSeverity('success');
      } catch (error) {
        console.error("Error creating payment:", error);
        setToastMessage('Request failed');
        setToastSeverity('error');
      } finally {
        setToastOpen(true);
      }
    }
  };

  return (
    <Box
      sx={{
        paddingTop: 8,
        paddingLeft: "8vw",
        paddingRight: "8vw",
        paddingBottom: 2,
      }}
    >
      <h1>Create Payment</h1>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              disablePortal
              options={clients}
              getOptionLabel={(option) =>
                `${option.first_name} ${
                  option.last_name
                } (${getAlpha2CountryCode(option.country)}) - ${
                  option.phone_number
                }`
              }
              value={selectedClient}
              onChange={handleAutocompleteChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Client"
                  required
                  helperText={errors.selectedClient || ""}
                  error={!!errors.selectedClient}
                />
              )}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
          <TextField
            required
            id="amount"
            label="Amount"
            value={formValues.amount}
            onChange={handleChange}
            inputProps={{ pattern: "[0-9]*", inputMode: "decimal" }}
            helperText={errors.amount || "(Required)"}
            error={!!errors.amount}
            fullWidth
          />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required error={!!errors.currency}>
              <InputLabel id="currency-label">Currency</InputLabel>
              <Select
                labelId="currency-label"
                id="currency"
                value={formValues.currency}
                onChange={handleSelectChange}
                label="Currency"
              >
                {currencies.map((currency) => (
                  <MenuItem key={currency} value={currency}>
                    {currency}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              id="rcpt_first_name"
              label="Recipient's First Name"
              value={formValues.rcpt_first_name}
              onChange={handleChange}
              helperText={errors.rcpt_first_name || "(Required)"}
              error={!!errors.rcpt_first_name}
              inputProps={{ maxLength: 50 }} 
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              id="rcpt_last_name"
              label="Recipient's Last Name"
              value={formValues.rcpt_last_name}
              onChange={handleChange}
              helperText={errors.rcpt_last_name || "(Required)"}
              error={!!errors.rcpt_last_name}
              inputProps={{ maxLength: 50 }} 
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="rcpt_bank_name"
              label="Recipient's Bank Name"
              value={formValues.rcpt_bank_name}
              onChange={handleChange}
              helperText={errors.rcpt_bank_name || "(Required)"}
              error={!!errors.rcpt_bank_name}
              inputProps={{ maxLength: 50 }} 
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="rcpt_acct_no"
              label="Recipient's Account Number"
              value={formValues.rcpt_acct_no}
              onChange={handleChange}
              helperText={errors.rcpt_acct_no || "(Required)"}
              error={!!errors.rcpt_acct_no}
              inputProps={{ maxLength: 20 }} 
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="notes"
              label="Notes"
              value={formValues.notes}
              onChange={handleChange}
              helperText="(Optional)"
              multiline
              rows={4}
              inputProps={{ maxLength: 255 }} 
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
      <Notification
        open={toastOpen}
        message={toastMessage}
        severity={toastSeverity}
        onClose={handleCloseToast}
      />
    </Box>
  );
}
