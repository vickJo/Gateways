/* eslint-disable no-template-curly-in-string */
import * as Yup from "yup";

const ipRegex =
  /^((\d|([1-9]\d)|(1\d\d)|(2[0-5]{2}))\.){3}(\d|([1-9]\d)|(1\d\d)|(2[0-5]{2}))$/;

export const gatewaySchema = Yup.object({
  name: Yup.string().label("Name").required().min(2).default(""),
  ipv4Address: Yup.string()
    .label("IPv4 address")
    .test({
      name: "ipv4",
      message: "${path} must be a valid Address",
      test: (value) => ipRegex.test(value),
      exclusive: false,
    })
    .default(""),
  peripherals: Yup.array()
    .of(
      Yup.object({
        vendor: Yup.string().label("Vendor").required().min(2).default(""),
        status: Yup.string().label("Offline").required().default("offline"),
      }).nullable()
    )
    .label("Peripheral devices")
    .default([]),
});

export const peripheralSchema = Yup.object({
  vendor: Yup.string().label("Vendor").required().min(2).default(""),
  status: Yup.string().label("Offline").required().default("offline"),
});
