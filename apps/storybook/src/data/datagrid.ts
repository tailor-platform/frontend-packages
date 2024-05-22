/**
 * This file will contain the data used in datagrid story
 */

import { ColumnDef } from "@tanstack/react-table";
import { Payment, PaymentStatus } from "../types/datagrid";

export const COLUMNS: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
    meta: {
      type: "enum",
      enumType: PaymentStatus,
      //accessorKey is not provided at compile time inside ColumnDef https://github.com/TanStack/table/issues/4423
      accessorKey: "status",
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    meta: {
      type: "string",
      accessorKey: "email",
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    meta: {
      type: "number",
      accessorKey: "amount",
    },
  },
  {
    accessorKey: "createdAt",
    header: "CreatedAt",
    size: 80,
    meta: {
      type: "date",
      accessorKey: "createdAt",
    },
  },
  {
    accessorKey: "isCreditCard",
    header: "CreditCardUsed",
    meta: {
      type: "boolean",
      accessorKey: "isCreditCard",
    },
  },
  {
    accessorKey: "updatedAt",
    header: "UpdatedAt",
    size: 40,
    meta: {
      type: "dateTime",
      accessorKey: "updatedAt",
    },
  },
];

export const DATA: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
    createdAt: "2023-11-14",
    isCreditCard: true,
    updatedAt: "2023-11-14 12:00:00",
  },
  {
    id: "a6b2c3d4",
    amount: 200,
    status: "processing",
    email: "john@example.com",
    createdAt: "2023-11-13",
    isCreditCard: false,
    updatedAt: "2023-11-13 12:00:00",
  },
  {
    id: "f8e7d6c5",
    amount: 150,
    status: "success",
    email: "sara@example.com",
    createdAt: "2023-11-12",
    isCreditCard: false,
    updatedAt: "2023-11-12 12:00:00",
  },
  {
    id: "b5c4d3e2",
    amount: 50,
    status: "failed",
    email: "fail@example.com",
    createdAt: "2023-11-11",
    isCreditCard: true,
    updatedAt: "2023-11-11 12:00:00",
  },
  {
    id: "12345678",
    amount: 300,
    status: "pending",
    email: "example1@example.com",
    createdAt: "2023-11-10",
    isCreditCard: true,
    updatedAt: "2023-11-10 12:00:00",
  },
  {
    id: "23456789",
    amount: 400,
    status: "processing",
    email: "example2@example.com",
    createdAt: "2023-11-09",
    isCreditCard: true,
    updatedAt: "2023-11-09 12:00:00",
  },
  {
    id: "34567890",
    amount: 500,
    status: "success",
    email: "example3@example.com",
    createdAt: "2023-11-08",
    isCreditCard: false,
    updatedAt: "2023-11-08 12:00:00",
  },
  {
    id: "718ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
    createdAt: "2023-11-14",
    isCreditCard: true,
    updatedAt: "2023-11-14 12:00:00",
  },
  {
    id: "a6b1c3d4",
    amount: 200,
    status: "processing",
    email: "john@example.com",
    createdAt: "2023-11-13",
    isCreditCard: false,
    updatedAt: "2023-11-13 12:00:00",
  },
  {
    id: "f8e7d6c1",
    amount: 150,
    status: "success",
    email: "sara@example.com",
    createdAt: "2023-11-12",
    isCreditCard: false,
    updatedAt: "2023-11-12 12:00:00",
  },
  {
    id: "b5c4d3e1",
    amount: 50,
    status: "failed",
    email: "fail@example.com",
    createdAt: "2023-11-11",
    isCreditCard: true,
    updatedAt: "2023-11-11 12:00:00",
  },
  {
    id: "42345678",
    amount: 300,
    status: "pending",
    email: "example1@example.com",
    createdAt: "2023-11-10",
    isCreditCard: true,
    updatedAt: "2023-11-10 12:00:00",
  },
  {
    id: "53456789",
    amount: 400,
    status: "processing",
    email: "example2@example.com",
    createdAt: "2023-11-09",
    isCreditCard: true,
    updatedAt: "2023-11-09 12:00:00",
  },
  {
    id: "64567890",
    amount: 500,
    status: "success",
    email: "example3@example.com",
    createdAt: "2023-11-08",
    isCreditCard: false,
    updatedAt: "2023-11-08 12:00:00",
  },
  {
    id: "8269362",
    amount: 500,
    status: "success",
    email: "example3@example.com",
    createdAt: "2023-11-08",
    isCreditCard: false,
    updatedAt: "2024-05-10 12:00:00",
  },
];
