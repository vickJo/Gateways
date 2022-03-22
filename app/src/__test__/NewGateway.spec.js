import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import NewGateway from "../pages/NewGateway";

jest.mock("react-router-dom", () => ({
  Link: ({ children }) => <>{children}</>,
}));

describe("NewGateway", () => {
  test("can add gateway", async () => {
    const gateway = {
      peripherals: [],
      ipv4Address: "255.255.0.0",
      name: "Gate3",
    };
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(gateway),
      })
    );

    render(<NewGateway />);

    const nameField = screen.getByLabelText(/Name/i);
    const ipField = screen.getByLabelText(/IPv4 Addres/i);

    userEvent.type(nameField, gateway.name);
    userEvent.type(ipField, gateway.ipv4Address);
    userEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5000/gateways/",
        {
          method: "POST",
          body: JSON.stringify(gateway),
          headers: new Headers({ "Content-Type": "application/json" }),
        }
      );
    });
  });
});
