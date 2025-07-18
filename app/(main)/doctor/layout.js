import PageHeader from "@/components/page-header";
import { Stethoscope } from "lucide-react";

export const metadata = {
    title: "Doctor Dashboard - MediMeet",
    description: "Manage your appointments and availability",
};

export default async function DoctorDashboardLayout({ children }) {
    return (
        <div className="container mx-auto px-4">
            <PageHeader icon={<Stethoscope />} title="Doctor Dashboard" />

            {children}
        </div>
    );
}