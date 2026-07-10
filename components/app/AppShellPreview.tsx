"use client";

import { useState } from "react";
import type { Lead } from "@/types";
import AppSidebar, {
  type AppPage,
} from "@/components/app/AppSidebar";
import AppHeader from "@/components/app/AppHeader";
import WelcomeOverlay from "@/components/welcome/WelcomeOverlay";
import TodayPage from "@/components/pages/TodayPage";
import CustomersPage from "@/components/pages/CustomersPage";
import CustomerDetailPage from "@/components/pages/CustomerDetailPage";
import ConversationsPage from "@/components/pages/ConversationsPage";
import BusinessPage from "@/components/pages/BusinessPage";
import SettingsPage from "@/components/pages/SettingsPage";
import { getCustomers } from "@/services/customerService";
import { getBusinessMetrics } from "@/services/businessService";

const customers = getCustomers();
const businessMetrics = getBusinessMetrics();

export default function AppShellPreview() {
  const [activePage, setActivePage] = useState<AppPage>("Today");
  const [selectedCustomer, setSelectedCustomer] =
    useState<Lead | null>(null);

  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [welcomeStep, setWelcomeStep] = useState(0);

  function handlePageChange(page: AppPage) {
    setActivePage(page);
    setSelectedCustomer(null);
    closeWelcomeExperience();
  }

  function handleCustomerSelect(customer: Lead) {
    setSelectedCustomer(customer);
    setWelcomeOpen(false);
  }

  function handleCustomerBack() {
    setSelectedCustomer(null);
    setActivePage("Customers");
  }

  function openWelcomeExperience() {
    setWelcomeOpen(true);
    setWelcomeStep(0);
    setSelectedCustomer(null);
  }

  function closeWelcomeExperience() {
    setWelcomeOpen(false);
    setWelcomeStep(0);
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
      <div className="relative overflow-hidden rounded-3xl border bg-white shadow-2xl">
        {welcomeOpen && (
          <WelcomeOverlay
            step={welcomeStep}
            onStart={() => setWelcomeStep(1)}
            onNext={() =>
              setWelcomeStep((currentStep) =>
                Math.min(currentStep + 1, 3)
              )
            }
            onClose={closeWelcomeExperience}
          />
        )}

        <div className="grid min-h-[780px] lg:grid-cols-[260px_minmax(0,1fr)]">
          <AppSidebar
            activePage={activePage}
            onPageChange={handlePageChange}
          />

          <main className="min-w-0 bg-slate-50 p-5 md:p-8">
            <AppHeader
              activePage={activePage}
              selectedCustomerName={selectedCustomer?.name}
              onStartMyDay={openWelcomeExperience}
            />

            {selectedCustomer ? (
              <CustomerDetailPage
                customer={selectedCustomer}
                onBack={handleCustomerBack}
              />
            ) : (
              <>
                {activePage === "Today" && (
                  <TodayPage
                    onViewCustomers={() =>
                      handlePageChange("Customers")
                    }
                  />
                )}

                {activePage === "Customers" && (
                  <CustomersPage
                    customers={customers}
                    onCustomerSelect={handleCustomerSelect}
                  />
                )}

                {activePage === "Conversations" && (
                  <ConversationsPage />
                )}

                {activePage === "Business" && (
                  <BusinessPage metrics={businessMetrics} />
                )}

                {activePage === "Settings" && <SettingsPage />}
              </>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}