"use client"

import { useState, useEffect } from "react"
import { AppShell } from "@/components/app-shell"
import { IncidentCard } from "@/components/incident-card"
import { StatsCard } from "@/components/stats-card"
import type { Incident } from "@/lib/types"
import { AlertTriangle, Clock, Users, CheckCircle, TrendingUp } from "lucide-react"

const VALID_DISASTER_TYPES = ["earthquake", "flood", "fire", "hurricane", "tornado", "other"] as const

function mapReportToIncident(report: {
  _id: string
  type: string
  location: string
  description: string
  status: string
  priority: string
  createdAt?: string
}): Incident {
  const rawType = report.type?.toLowerCase() ?? "other"
  const type = VALID_DISASTER_TYPES.includes(rawType as (typeof VALID_DISASTER_TYPES)[number])
    ? (rawType as Incident["type"])
    : "other"
  return {
    id: report._id,
    type,
    location: report.location ?? "",
    description: report.description ?? "",
    status: (report.status?.toLowerCase() ?? "pending") as Incident["status"],
    priority: (report.priority?.toLowerCase() ?? "medium") as Incident["priority"],
    createdAt: report.createdAt ? new Date(report.createdAt) : new Date(),
  }
}

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])

  useEffect(() => {
    fetch("http://localhost:5000/api/reports")
      .then((res) => res.json())
      .then((data: unknown) => {
        const reports = Array.isArray(data) ? data : []
        setIncidents(reports.map((r: Record<string, unknown>) => mapReportToIncident({
          _id: String(r._id ?? ""),
          type: String(r.type ?? ""),
          location: String(r.location ?? ""),
          description: String(r.description ?? ""),
          status: String(r.status ?? "pending"),
          priority: String(r.priority ?? "medium"),
          createdAt: r.createdAt != null ? String(r.createdAt) : undefined,
        })))
      })
      .catch(() => setIncidents([]))
  }, [])

  const stats = {
    total: incidents.length,
    pending: incidents.filter((i) => i.status === "pending").length,
    assigned: incidents.filter((i) => i.status === "assigned").length,
    completed: incidents.filter((i) => i.status === "completed").length,
  }

  const activeIncidents = incidents.filter((i) => i.status !== "completed")
  const recentlyCompleted = incidents.filter((i) => i.status === "completed")

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>Overview</span>
            <span>/</span>
            <span className="text-foreground">Dashboard</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Incident Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Monitor and manage active disaster response operations
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-medium">12% faster response</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Incidents"
            value={stats.total}
            icon={AlertTriangle}
            variant="primary"
            trend={{ value: 8, isPositive: false }}
            description="All reported incidents"
          />
          <StatsCard
            title="Awaiting Response"
            value={stats.pending}
            icon={Clock}
            variant="warning"
            description="Needs immediate attention"
          />
          <StatsCard
            title="In Progress"
            value={stats.assigned}
            icon={Users}
            variant="info"
            description="Currently being handled"
          />
          <StatsCard
            title="Resolved"
            value={stats.completed}
            icon={CheckCircle}
            variant="success"
            trend={{ value: 15, isPositive: true }}
            description="Successfully completed"
          />
        </div>

        {/* Active Incidents */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Active Incidents
              </h2>
              <p className="text-sm text-muted-foreground">
                {activeIncidents.length} incidents requiring attention
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {activeIncidents.map((incident, index) => (
              <div 
                key={incident.id}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <IncidentCard incident={incident} />
              </div>
            ))}
          </div>
        </section>

        {/* Recently Completed */}
        {recentlyCompleted.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Recently Resolved
                </h2>
                <p className="text-sm text-muted-foreground">
                  Completed in the last 24 hours
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {recentlyCompleted.map((incident, index) => (
                <div 
                  key={incident.id}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="opacity-70 hover:opacity-100 transition-opacity"
                >
                  <IncidentCard incident={incident} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  )
}
