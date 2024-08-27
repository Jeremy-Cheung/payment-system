import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import countries from "../../../utils/countries";
import Notification from "../../../components/common/Notification";

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

export default function CreateClient() {
  const apiUrl = "http://localhost:5000";
  const [formValues, setFormValues] = useState<FormValues>({
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

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
    "success"
  );
  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;

    let newValue = value;

    switch (id) {
      case "first_name":
      case "last_name":
        newValue = value.replace(/[^a-zA-Z]/g, ""); 
        if (newValue.length <= 50) {
          setFormValues({ ...formValues, [id]: newValue });
        }
        break;

      case "addr_line1":
      case "addr_line2":
      case "addr_line3":
        newValue = value.replace(/[^a-zA-Z0-9\s,.-]/g, ""); 
        if (newValue.length <= 100) {
          setFormValues({ ...formValues, [id]: newValue });
        }
        break;

      case "postcode":
        newValue = value.replace(/[^a-zA-Z0-9]/g, ""); 
        if (newValue.length <= 10) {
          setFormValues({ ...formValues, [id]: newValue });
        }
        break;

      case "phone_number":
        newValue = value.replace(/\D/g, ""); 
        if (newValue.length <= 15 && newValue.length >= 9) {
          setFormValues({ ...formValues, [id]: newValue });
        }
        break;

      case "bank_acct_no":
        newValue = value.replace(/\D/g, ""); 
        if (newValue.length <= 20) {
          setFormValues({ ...formValues, [id]: newValue });
        }
        break;

      default:
        setFormValues({ ...formValues, [id]: value });
        break;
    }
  };

  const handleAutocompleteChange = (_: any, value: { name: string } | null) => {
    setFormValues({
      ...formValues,
      country: value ? value.name : "",
    });
  };

  const handleCloseToast = () => {
    setToastOpen(false);
  };

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

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (validate()) {
      try {
        console.log(apiUrl);
        const response = await fetch(`${apiUrl}/clients`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setToastMessage("Client created");
        setToastSeverity("success");
      } catch (error) {
        console.error("Error creating client:", error);
        setToastMessage("Request failed");
        setToastSeverity("error");
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
      <h1>Create Client</h1>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="first_name"
              label="First name"
              value={formValues.first_name}
              onChange={handleChange}
              helperText={errors.first_name || "(Required)"}
              error={!!errors.first_name}
              inputProps={{ maxLength: 50 }}
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
              helperText={errors.last_name || "(Required)"}
              error={!!errors.last_name}
              inputProps={{ maxLength: 50 }} 
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
              helperText={errors.addr_line1 || "(Required)"}
              error={!!errors.addr_line1}
              inputProps={{ maxLength: 100 }}
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
              inputProps={{ maxLength: 100 }} 
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
              inputProps={{ maxLength: 100 }}
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
              onChange={handleAutocompleteChange}
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
              inputProps={{ maxLength: 15, minLength: 9 }} // 15 max length for international
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
              inputProps={{ maxLength: 20 }}
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
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ justifyContent: "flex-end" }}
              >
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