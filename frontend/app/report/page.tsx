"use client"

import { AppShell } from "@/components/app-shell"
import { ReportIncidentForm } from "@/components/report-incident-form"
import { AlertTriangle, Clock, Shield } from "lucide-react"

export default function ReportPage() {
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>Incidents</span>
            <span>/</span>
            <span className="text-foreground">Report</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Report an Incident
          </h1>
          <p className="text-muted-foreground mt-1">
            Submit details about a disaster or emergency situation that requires response coordination
          </p>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-card/30 border border-border/50">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <AlertTriangle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Accurate Details</p>
              <p className="text-xs text-muted-foreground">Provide precise location and situation info</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-card/30 border border-border/50">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-500/10">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Quick Response</p>
              <p className="text-xs text-muted-foreground">Reports are processed within minutes</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-card/30 border border-border/50">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10">
              <Shield className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Expert Team</p>
              <p className="text-xs text-muted-foreground">Trained volunteers assigned automatically</p>
            </div>
          </div>
        </div>

        <ReportIncidentForm />
      </div>
    </AppShell>
  )
}
