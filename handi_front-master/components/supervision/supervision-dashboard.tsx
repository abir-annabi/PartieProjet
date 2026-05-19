"use client";

import { Card } from "@/components/ui/card";
import { EmptyState, LoadingState } from "@/components/ui/layout";
import { useSupervisionQuery } from "@/components/supervision/use-supervision-query";
import { VisibleCandidate } from "@/lib/supervision";

export function SupervisionDashboard() {
  const applications = useSupervisionQuery<VisibleCandidate[]>("/candidates");

  if (applications.loading) {
    return (
      <LoadingState
        title="Loading applications"
        description="Preparing privacy-safe supervision applications list."
      />
    );
  }

  if (applications.error || !applications.data) {
    return (
      <EmptyState
        title="Applications unavailable"
        description={applications.error || "Supervision applications could not be loaded."}
      />
    );
  }

  return (
    <Card className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Reference</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Stage</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Company</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Offer</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Region</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {applications.data.map((application) => (
            <tr key={application.application_id}>
              <td className="px-4 py-3 font-medium text-gray-900">{application.candidate_reference}</td>
              <td className="px-4 py-3 text-gray-600">{application.stage}</td>
              <td className="px-4 py-3 text-gray-600">{application.company_name}</td>
              <td className="px-4 py-3 text-gray-600">{application.offer_title}</td>
              <td className="px-4 py-3 text-gray-600">{application.region}</td>
              <td className="px-4 py-3 text-gray-600">{new Date(application.updated_at).toLocaleDateString("en-GB")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
