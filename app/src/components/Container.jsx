import { Link } from "react-router-dom";
import MuiBox from "@mui/material/Box";
import MuiButton from "@mui/material/Button";
import MuiContainer from "@mui/material/Container";
import MuiTypography from "@mui/material/Typography";

const Box = ({ children }) => (
  <MuiBox sx={{ display: "flex", flex: 1 }}>
    <MuiBox
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, 50%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {children}
    </MuiBox>
  </MuiBox>
);

function Container({ title, children, loading, error, errCallback }) {
  return (
    <MuiContainer>
      <MuiBox sx={{ my: 5 }}>
        <MuiTypography variant="h3">{title}</MuiTypography>
      </MuiBox>

      {loading ? (
        <MuiBox sx={{ display: "flex", flex: 1 }}>
          <Box>
            <MuiTypography variant="h6">Please wait...</MuiTypography>
          </Box>
        </MuiBox>
      ) : error ? (
        <MuiBox sx={{ display: "flex", flex: 1 }}>
          <Box>
            <MuiTypography variant="h6">{error}</MuiTypography>
            {errCallback && (
              <MuiButton onClick={errCallback}>Try again</MuiButton>
            )}
          </Box>
        </MuiBox>
      ) : (
        <MuiBox>
          {children}
          <MuiBox sx={{ my: 2 }}>
            <Link to="/">
              <MuiTypography>Go Home</MuiTypography>
            </Link>
          </MuiBox>
        </MuiBox>
      )}
    </MuiContainer>
  );
}

export default Container;
