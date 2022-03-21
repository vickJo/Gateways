import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Container from "../components/Container";
import { gatewaySchema } from "../utils/schema";

function NewGateway() {
  const [devices, setDevices] = useState([]);
  const [notice, setNotice] = useState("");

  const methods = useForm({
    defaultValues: gatewaySchema.cast(),
    resolver: yupResolver(gatewaySchema),
  });

  function closeNotice(event, reason) {
    if (reason !== "timeout") return;
    setNotice("");
  }

  function addDevice() {
    const value = methods.getValues("peripherals");
    value.push({ vendor: "", status: "offline" });
    methods.setValue("peripherals", value);
    setDevices(value);
  }

  function removeDevice(idx) {
    return () => {
      const value = methods.getValues("peripherals");
      const newValue = value.map((n, i) => (i === idx ? null : n));
      methods.clearErrors(`peripherals[${idx}]`);
      methods.setValue("peripherals", newValue);
      setDevices(newValue);
    };
  }

  async function onSubmit(values) {
    try {
      const payload = {
        ...values,
        peripherals: values.peripherals.filter((n) => n),
      };
      const res = await fetch("http://localhost:5000/gateways/", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: new Headers({ "Content-Type": "application/json" }),
      });
      if (!res.ok) {
        throw new Error("Error saving gateway");
      }
      await res.json();
      setNotice("Gateway was successfully saved");
      methods.reset();
    } catch (err) {
      setNotice(err.message);
    }
  }

  const canAddNew = devices.filter((n) => n).length < 10;

  return (
    <Container title="Add new Gateway">
      <Box sx={{ my: 1 }}>
        <Box component="form" autoCapitalize="off" noValidate>
          <Grid
            container
            spacing={12}
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item xs={12} sm={6}>
              <Controller
                control={methods.control}
                name="name"
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    margin="dense"
                    label="Name"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                control={methods.control}
                name="ipv4Address"
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    margin="dense"
                    label="IPv4 Address"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Paper sx={{ mt: 2, p: 4 }} elevation={1}>
            <Typography>Peripheral Devices:</Typography>

            {devices.map((device, idx) =>
              device ? (
                <Paper key={idx} sx={{ mt: 2, mb: 4, p: 4 }} elevation={2}>
                  <Grid container justifyContent="center">
                    <Grid item container spacing={12}>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          control={methods.control}
                          name={`peripherals[${idx}].vendor`}
                          render={({ field, fieldState }) => (
                            <TextField
                              {...field}
                              fullWidth
                              size="small"
                              margin="dense"
                              label="Vendor"
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          control={methods.control}
                          name={`peripherals[${idx}].status`}
                          render={({ field, fieldState }) => (
                            <TextField
                              {...field}
                              select
                              fullWidth
                              size="small"
                              margin="dense"
                              label="Status"
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            >
                              <MenuItem value="online">Online</MenuItem>
                              <MenuItem value="offline">Offline</MenuItem>
                            </TextField>
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Button
                    sx={{ mt: 1 }}
                    color="secondary"
                    onClick={removeDevice(idx)}
                  >
                    Remove
                  </Button>
                </Paper>
              ) : null
            )}

            <Grid sx={{ mt: 2 }} container justifyContent="center">
              <Button
                variant="outlined"
                disabled={!canAddNew}
                onClick={addDevice}
              >
                Add
              </Button>
            </Grid>
          </Paper>

          <Grid container sx={{ my: 4 }} justifyContent="center">
            <Grid item xs={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={methods.handleSubmit(onSubmit)}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Snackbar
        open={Boolean(notice)}
        message={notice}
        autoHideDuration={5000}
        onClose={closeNotice}
      />
    </Container>
  );
}

export default NewGateway;
