import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";

import Container from "../components/Container";

function Gateways() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [notice, setNotice] = useState("");

  function closeNotice(event, reason) {
    if (reason !== "timeout") return;
    setNotice("");
  }

  async function removeGateway(id) {
    try {
      const res = await fetch("http://localhost:5000/gateways/" + id, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Error removing gateway");
      }
      setNotice("Gateway was successfully removed");
      fetchData();
    } catch (err) {
      setNotice(err.message);
    }
  }

  const fetchData = useCallback(() => {
    void (async function fetchData() {
      try {
        setLoading(true);

        const res = await fetch("http://localhost:5000/gateways/");

        if (!res.ok) {
          throw new Error("Error loading gateways");
        }
        setData(await res.json());
        setLoading(false);
      } catch (error) {
        setLoadError(error.message);
        setLoading(false);
      }
    })();
  }, []);

  useEffect(fetchData, [fetchData]);

  const columns = [
    {
      field: "serialNumber",
      headerName: "Serial Number",
      minWidth: 400,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 250,
      renderCell: ({ formattedValue, id }) => (
        <Link sx={{ cursor: "pointer" }} to={"/" + id}>
          {formattedValue}
        </Link>
      ),
    },
    {
      field: "ipv4Address",
      headerName: "IPv4 Address",
      minWidth: 200,
    },
    {
      field: "numOfDevices",
      headerName: "No. of Devices",
      align: "right",
      minWidth: 150,
      renderCell: ({ row }) => row.peripherals?.length,
    },
    {
      field: "_id",
      headerName: "",
      align: "center",
      minWidth: 200,
      hideSortIcons: true,
      renderCell: ({ id }) => (
        <Button
          size="small"
          sx={{ cursor: "pointer" }}
          onClick={() => removeGateway(id)}
        >
          Remove
        </Button>
      ),
    },
  ];

  const rows = data.map((row) => ({ ...row, id: row._id }));

  return (
    <Container error={loadError} errCallback={fetchData}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3">Gateways</Typography>
        </Grid>
        <Grid item>
          <Button
            size="small"
            variant="outlined"
            onClick={() => navigate("/new")}
          >
            Add new Gateway
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ mt: 4, height: "calc(100vh - 250px)" }}>
        <DataGrid
          columns={columns}
          rows={rows}
          loading={loading}
          pageSize={10}
        />
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

export default Gateways;
