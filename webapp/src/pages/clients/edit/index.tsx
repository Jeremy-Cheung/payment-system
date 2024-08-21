import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import countries from "../../../utils/countries";

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

interface FormValues {
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

interface Errors {
  [key: string]: string;
}

export default function UpdateClient() {
  const apiUrl = "http://localhost:5000";
  const [clients, setClients] = React.useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = React.useState<Client | null>(
    null
  );
  const [formValues, setFormValues] = React.useState<FormValues>({
    first_name: "",
    last_name: "",
    addr_line1: "",
    addr_line2: "",
    addr_line3: "",
    postcode: "",
    country: "",
    phone_number: "",
    bank_acct_no: "",
  });

  const [errors, setErrors] = React.useState<Errors>({});

  // Fetch clients on component load
  React.useEffect(() => {
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

  // Convert country name to alpha-2 code
  const getAlpha2CountryCode = (countryName: string) => {
    const country = countries.find((c) => c.name === countryName);
    return country ? country.code : countryName;
  };

  // Handle changes in the form fields
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormValues({
      ...formValues,
      [id]: value,
    });
  };

  // Handle client selection in Autocomplete
  const handleAutocompleteChange = (_: any, client: Client | null) => {
    console.log("Selected client:", client); // Log to check client object
    setSelectedClient(client);
    if (client) {
      setFormValues({
        first_name: client.first_name,
        last_name: client.last_name,
        addr_line1: client.addr_line1,
        addr_line2: client.addr_line2 || "",
        addr_line3: client.addr_line3 || "",
        postcode: client.postcode,
        country: client.country,
        phone_number: client.phone_number,
        bank_acct_no: client.bank_acct_no || "",
      });
    } else {
      setFormValues({
        first_name: "",
        last_name: "",
        addr_line1: "",
        addr_line2: "",
        addr_line3: "",
        postcode: "",
        country: "",
        phone_number: "",
        bank_acct_no: "",
      });
    }
  };

  // Validate form fields
  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!formValues.first_name) newErrors.first_name = "First name is required";
    if (!formValues.last_name) newErrors.last_name = "Last name is required";
    if (!formValues.addr_line1)
      newErrors.addr_line1 = "Address line 1 is required";
    if (!formValues.postcode)
      newErrors.postcode = "Postcode/Zipcode is required";
    if (!formValues.country) newErrors.country = "Country is required";
    if (!formValues.phone_number)
      newErrors.phone_number = "Phone number is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (event: { preventDefault: () => void }) => {
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
        const response = await fetch(
          `${apiUrl}/clients/${selectedClient.client_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formValues),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Client updated successfully:", data);
      } catch (error) {
        console.error("Error updating client:", error);
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
      <h1>Update Client</h1>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Autocomplete for selecting a client */}
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
            {errors.selectedClient && (
              <Box color="error.main">{errors.selectedClient}</Box>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="first_name"
              label="First name"
              value={formValues.first_name}
              onChange={handleChange}
              helperText={errors.first_name || "(required)"}
              error={!!errors.first_name}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="last_name"
              label="Last name"
              value={formValues.last_name}
              onChange={handleChange}
              helperText={errors.last_name || "(required)"}
              error={!!errors.last_name}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="addr_line1"
              label="Address line 1"
              value={formValues.addr_line1}
              onChange={handleChange}
              helperText={errors.addr_line1 || "(required)"}
              error={!!errors.addr_line1}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="addr_line2"
              label="Address line 2"
              value={formValues.addr_line2}
              onChange={handleChange}
              helperText="(Optional)"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="addr_line3"
              label="Address line 3"
              value={formValues.addr_line3}
              onChange={handleChange}
              helperText="(Optional)"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="postcode"
              label="Postcode/Zipcode"
              value={formValues.postcode}
              onChange={handleChange}
              helperText={errors.postcode || "(Required)"}
              error={!!errors.postcode}
              inputProps={{ maxLength: 10 }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              disablePortal
              id="country"
              options={countries}
              getOptionLabel={(option) => option.name}
              onChange={(_, value) =>
                setFormValues({
                  ...formValues,
                  country: value ? value.name : "",
                })
              }
              value={
                countries.find((c) => c.name === formValues.country) || null
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Country"
                  required
                  helperText={errors.country || "(Required)"}
                  error={!!errors.country}
                />
              )}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="phone_number"
              label="Phone number"
              value={formValues.phone_number}
              onChange={handleChange}
              helperText={errors.phone_number || "(Required)"}
              error={!!errors.phone_number}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="bank_acct_no"
              label="Bank account"
              value={formValues.bank_acct_no}
              onChange={handleChange}
              helperText="(Optional)"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
