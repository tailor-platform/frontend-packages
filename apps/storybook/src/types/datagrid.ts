/**
 * This file will contains types used in datagrid story
 */
export enum PaymentStatus {
  pending = "Pending",
  processing = "Processing",
  success = "Success",
  failed = "Failed",
}

export type Payment = {
  id: string;
  amount: number;
  status: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  isCreditCard: boolean;
};
