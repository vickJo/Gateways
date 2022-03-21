import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Container from "../components/Container";
import { peripheralSchema } from "../utils/schema";

function ViewGateway() {
  const params = useParams();

  const methods = useForm({
    defaultValues: peripheralSchema.cast(),
    resolver: yupResolver(peripheralSchema),
  });

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [removedDevices, setRemovedDevices] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notice, setNotice] = useState("");

  function closeNotice(event, reason) {
    if (reason !== "timeout") return;
    setNotice("");
  }

  function closeDialog() {
    setIsDialogOpen(false);
  }

  const fetchData = useCallback(() => {
    void (async function fetchData() {
      try {
        setLoading(true);

        const res = await fetch("http://localhost:5000/gateways/" + params.id);

        if (!res.ok) {
          throw new Error("Error loading gateway");
        }
        setData(await res.json());
        setLoading(false);
      } catch (error) {
        setNotice(error.message);
        setLoadError(error.message);
        setLoading(false);
      }
    })();
  }, [params.id]);

  async function updateDevices(devices) {
    try {
      const res = await fetch("http://localhost:5000/gateways/" + params.id, {
        method: "PATCH",
        body: JSON.stringify({ peripherals: devices }),
        headers: new Headers({ "Content-Type": "application/json" }),
      });
      if (!res.ok) {
        throw new Error("Error applying changes");
      }
      await res.json();
      setNotice("Changes were successfully applied");
      fetchData();
    } catch (err) {
      setNotice(err.message);
    }
  }

  function handleRemoveDevice(id) {
    return () => setRemovedDevices((prev) => ({ ...prev, [id]: true }));
  }

  function applyChanges() {
    const payload = (data.peripherals || []).filter(
      (device) => !removedDevices[device._id]
    );
    updateDevices(payload);
    setRemovedDevices({});
  }

  function revertChanges() {
    setRemovedDevices({});
  }

  function onAddDevice(values) {
    setIsDialogOpen(false);
    revertChanges()
    methods.reset();
    updateDevices([...(data.peripherals || []), values]);
  }

  useEffect(fetchData, [fetchData]);

  const hasChanges = Object.keys(removedDevices).length > 0;

  return (
    <Container
      loading={loading}
      error={loadError}
      errCallback={fetchData}
      title={"Gateway" + (data.name ? " - " + data.name : "")}
    >
      <Box sx={{ my: 1 }}>
        <Typography
          sx={{ pr: 1 }}
          color="GrayText"
          component="span"
          variant="caption"
        >
          Serial Number
        </Typography>
        <Typography component="span" variant="body1">
          {data.serialNumber}{" "}
        </Typography>
      </Box>
      <Box sx={{ my: 1 }}>
        <Typography
          sx={{ pr: 1 }}
          color="GrayText"
          component="span"
          variant="caption"
        >
          IPv4 Address
        </Typography>
        <Typography component="span" variant="body2">
          {data.ipv4Address}{" "}
        </Typography>
      </Box>

      <Grid sx={{ mt: 4, mb: 1 }} container justifyContent="space-between">
        <Grid item>
          <Typography sx={{ pl: 1 }} component="span" variant="h6">
            Peripheral devices:
          </Typography>
        </Grid>

        <Grid item>
          {hasChanges && (
            <>
              <Button
                sx={{ mr: 1 }}
                size="small"
                color="success"
                variant="outlined"
                onClick={revertChanges}
              >
                Revert Changes
              </Button>
              <Button
                sx={{ mr: 1 }}
                size="small"
                color="error"
                variant="outlined"
                onClick={applyChanges}
              >
                Apply Changes
              </Button>
            </>
          )}
        </Grid>
      </Grid>

      <Grid container spacing={6} sx={{ minHeight: 100 }}>
        {(data.peripherals || []).map((device) =>
          removedDevices[device._id] ? null : (
            <Grid key={device._id} item>
              <Card sx={{ minWidth: 350 }}>
                <CardContent>
                  <Typography variant="h6">{device.vendor}</Typography>
                  <Divider />
                  <Box sx={{ my: 1 }}>
                    <Typography variant="overline">ID</Typography>
                    <Typography variant="body2">{device.uid}</Typography>
                  </Box>
                  <Box sx={{ my: 1 }}>
                    <Typography variant="overline">STATUS</Typography>
                    <Typography variant="body2">{device.status}</Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: "center" }}>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={handleRemoveDevice(device._id)}
                  >
                    Remove
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )
        )}
      </Grid>

      <Grid
        sx={{ my: 4 }}
        container
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>
          <Button
            disabled={(data.peripherals || []).length >= 10}
            variant="outlined"
            onClick={() => setIsDialogOpen(true)}
          >
            Add New Device
          </Button>
        </Grid>
      </Grid>

      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogTitle>Add New Device</DialogTitle>
        <DialogContent>
          <Box component="form" autoCapitalize="off" noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  control={methods.control}
                  name="vendor"
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
              <Grid item xs={12}>
                <Controller
                  control={methods.control}
                  name="status"
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

            <Grid container sx={{ my: 4 }} justifyContent="center">
              <Grid item xs={3}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={methods.handleSubmit(onAddDevice)}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={Boolean(notice)}
        message={notice}
        autoHideDuration={5000}
        onClose={closeNotice}
      />
    </Container>
  );
}

export default ViewGateway;
