import * as Yup from "yup";

export const gatewaySchema = Yup.object({
  name: Yup.string().label("Name").required().default(""),
  ipv4Address: Yup.string().label("IPv4 address").required().default(""),
});

export const peripheralSchema = Yup.object({
  vendor: Yup.string().label("Vendor").required().default(""),
  status: Yup.bool().label("Status").default(false),
});
