/**
 * This file will contains types used in datagrid story
 */
export enum PaymentStatus {
  pending = "pending",
  processing = "processing",
  success = "success",
  failed = "failed",
}

export type Payment = {
  id: string;
  amount: number;
  status: PaymentStatus;
  email: string;
  createdAt: string;
  isCreditCard: boolean;
};
