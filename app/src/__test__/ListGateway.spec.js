import { render, screen, waitFor } from "@testing-library/react";

import ListGateways from "../pages/ListGateways";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
  Link: ({ children }) => <>{children}</>,
}));

describe("ListGateways", () => {
  test("displays a list of gateways", async () => {
    const gateways = [
      {
        _id: 1,
        name: "Gate1",
        serialNumber: "gate-1-000",
        ipv4Address: "255.255.0.0",
        peripherals: [],
      },
      {
        _id: 2,
        name: "Gate2",
        serialNumber: "gate-2-000",
        ipv4Address: "255.255.0.255",
        peripherals: [],
      },
    ];
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(gateways),
      })
    );

    render(<ListGateways />);

    await waitFor(() => {
      screen.getByText(/Add New Gateway/i);
    });

    gateways.forEach((gateway) => {
      const name = new RegExp(gateway.name);
      const sn = new RegExp(gateway.serialNumber);
      const ip = new RegExp(gateway.ipv4Address);

      expect(screen.getByText(name)).toBeInTheDocument();
      expect(screen.getByText(sn)).toBeInTheDocument();
      expect(screen.getByText(ip)).toBeInTheDocument();
    });
  });
});
