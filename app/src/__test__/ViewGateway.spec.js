import { render, screen } from "@testing-library/react";

import ViewGateway from "../pages/ViewGateway";

jest.mock("react-router-dom", () => ({
  useParams: () => ({ id: 1 }),
  Link: ({ children }) => <>{children}</>,
}));

describe("ViewGateway", () => {
  test("displays info about a gateway", async () => {
    const gateway = {
      _id: 1,
      name: "Gate1",
      serialNumber: "gate-1-000",
      ipv4Address: "255.255.0.0",
      peripherals: [],
    };
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(gateway),
      })
    );

    render(<ViewGateway />);

    const name = new RegExp("Gateway - " + gateway.name);
    const sn = new RegExp(gateway.serialNumber);
    const ip = new RegExp(gateway.ipv4Address);

    expect(await screen.findByText(name)).toBeInTheDocument();
    expect(await screen.findByText(sn)).toBeInTheDocument();
    expect(await screen.findByText(ip)).toBeInTheDocument();
  });
});
