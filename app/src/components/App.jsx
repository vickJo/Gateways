import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";

import { appTheme } from "../utils/themes";
import Gateways from "../pages/ListGateways";
import NewGateway from "../pages/NewGateway";
import ViewGateway from "../pages/ViewGateway";

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <Router>
        <Routes>
          <Route path="/" element={<Gateways />} />
          <Route path="/new" element={<NewGateway />} />
          <Route path="/:id" element={<ViewGateway />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
