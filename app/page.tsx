import ClinicHomePage from "@/components/clinic-home-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Medical Clinic & Hospital Navigation",
  description: "Medical clinic services and indoor navigation system for hospitals",
}

export default function HomePage() {
  return <ClinicHomePage />
}
