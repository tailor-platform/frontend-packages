"use client"
import { TailorAuthProvider } from "@tailor-platform/auth/client";
import { config } from "./authConfig";
import {ReactNode} from "react";

export const Providers = ({ children }: { children: ReactNode }) => (
  <TailorAuthProvider config={config}>{children}</TailorAuthProvider>
);