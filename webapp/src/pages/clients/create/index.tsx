import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import countries from "../../../utils/countries";

interface FormValues {
  firstName: string;
  lastName: string;
  addrLine1: string;
  addrLine2?: string;
  addrLine3?: string;
  postcode: string;
  country: string;
  phoneNumber: string;
  bankAccount?: string;
}

interface Errors {
  [key: string]: string;
}

export default function CreateClient() {
  const [formValues, setFormValues] = React.useState<FormValues>({
    firstName: "",
    lastName: "",
    addrLine1: "",
    addrLine2: "",
    addrLine3: "",
    postcode: "",
    country: "",
    phoneNumber: "",
    bankAccount: "",
  });

  const [errors, setErrors] = React.useState<Errors>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormValues({
      ...formValues,
      [id]: value,
    });
  };

  const handleAutocompleteChange = (_: any, value: { name: string } | null) => {
    setFormValues({
      ...formValues,
      country: value ? value.name : "",
    });
  };

  // Check if entry in field
  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!formValues.firstName) newErrors.firstName = "First name is required";
    if (!formValues.lastName) newErrors.lastName = "Last name is required";
    if (!formValues.addrLine1)
      newErrors.addrLine1 = "Address line 1 is required";
    if (!formValues.postcode)
      newErrors.postcode = "Postcode/Zipcode is required";
    if (!formValues.country) newErrors.country = "Country is required";
    if (!formValues.phoneNumber)
      newErrors.phoneNumber = "Phone number is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (validate()) {
      console.log("Form submitted:", formValues);
    }
  };

  return (
    <Box sx={{ paddingTop: 8, paddingLeft: "8vw", paddingRight: "8vw" }}>
      <h1>Create Client</h1>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="firstName"
              label="First name"
              value={formValues.firstName}
              onChange={handleChange}
              helperText={errors.firstName || "(required)"}
              error={!!errors.firstName}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="lastName"
              label="Last name"
              value={formValues.lastName}
              onChange={handleChange}
              helperText={errors.lastName || "(required)"}
              error={!!errors.lastName}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="addrLine1"
              label="Address line 1"
              value={formValues.addrLine1}
              onChange={handleChange}
              helperText={errors.addrLine1 || "(required)"}
              error={!!errors.addrLine1}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="addrLine2"
              label="Address line 2"
              value={formValues.addrLine2}
              onChange={handleChange}
              helperText="(Optional)"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="addrLine3"
              label="Address line 3"
              value={formValues.addrLine3}
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
              id="phoneNumber"
              label="Phone number"
              value={formValues.phoneNumber}
              onChange={handleChange}
              helperText={errors.phoneNumber || "(Required)"}
              error={!!errors.phoneNumber}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="bankAccount"
              label="Bank account"
              value={formValues.bankAccount}
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
    </Box>
  );
}
