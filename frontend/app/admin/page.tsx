"use client"

import { useState, useEffect, useCallback } from "react"
import { AppShell } from "@/components/app-shell"
import { AdminIncidentTable } from "@/components/admin-incident-table"
import { StatsCard } from "@/components/stats-card"
import type { Incident, Volunteer } from "@/lib/types"
import { AlertTriangle, Users, Clock, CheckCircle, Activity, Zap } from "lucide-react"

const REPORTS_URL = "http://localhost:5000/api/reports"
const VOLUNTEERS_URL = "http://localhost:5000/api/volunteers"

const VALID_DISASTER_TYPES = ["earthquake", "flood", "fire", "hurricane", "tornado", "other"] as const
const VALID_ROLES = ["rescue", "medical", "logistics", "communications", "shelter"] as const

function mapReportToIncident(r: Record<string, unknown>): Incident {
  const rawType = String(r.type ?? "").toLowerCase()
  const type = VALID_DISASTER_TYPES.includes(rawType as (typeof VALID_DISASTER_TYPES)[number])
    ? (rawType as Incident["type"])
    : "other"
  return {
    id: String(r._id ?? ""),
    type,
    location: String(r.location ?? ""),
    description: String(r.description ?? ""),
    status: (String(r.status ?? "pending").toLowerCase() ?? "pending") as Incident["status"],
    priority: (String(r.priority ?? "medium").toLowerCase() ?? "medium") as Incident["priority"],
    createdAt: r.createdAt ? new Date(String(r.createdAt)) : new Date(),
  }
}

function mapApiVolunteerToVolunteer(v: Record<string, unknown>): Volunteer {
  const rawRole = String(v.role ?? "").toLowerCase()
  const role = VALID_ROLES.includes(rawRole as (typeof VALID_ROLES)[number])
    ? (rawRole as Volunteer["role"])
    : "rescue"
  return {
    id: String(v._id ?? ""),
    name: String(v.name ?? ""),
    role,
    available: Boolean(v.isAvailable ?? true),
  }
}

export default function AdminPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setError(null)
      const [reportsRes, volunteersRes] = await Promise.all([
        fetch(REPORTS_URL),
        fetch(VOLUNTEERS_URL),
      ])

      if (!reportsRes.ok) throw new Error(`Failed to fetch reports (${reportsRes.status})`)
      if (!volunteersRes.ok) throw new Error(`Failed to fetch volunteers (${volunteersRes.status})`)

      const [reportsData, volunteersData] = await Promise.all([
        reportsRes.json(),
        volunteersRes.json(),
      ])

      const reportsList = Array.isArray(reportsData) ? reportsData : []
      const volunteersList = Array.isArray(volunteersData) ? volunteersData : []

      setIncidents(reportsList.map(mapReportToIncident))
      setVolunteers(volunteersList.map(mapApiVolunteerToVolunteer))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data")
      setIncidents([])
      setVolunteers([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const stats = {
    total: incidents.length,
    pending: incidents.filter((i) => i.status === "pending").length,
    inProgress: incidents.filter((i) => i.status === "assigned").length,
    completed: incidents.filter((i) => i.status === "completed").length,
    volunteers: volunteers.length,
    available: volunteers.filter((v) => v.available).length,
  }

  const criticalIncidents = incidents.filter((i) => i.priority === "high" && i.status === "pending")

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>System</span>
            <span>/</span>
            <span className="text-foreground">Admin Panel</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Control Center
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage incident assignments and coordinate response teams
              </p>
            </div>
            {criticalIncidents.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 animate-pulse">
                <Zap className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-red-400">
                  {criticalIncidents.length} critical incident{criticalIncidents.length > 1 ? "s" : ""} pending
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Incidents"
            value={stats.total}
            icon={AlertTriangle}
            variant="primary"
          />
          <StatsCard
            title="Pending"
            value={stats.pending}
            icon={Clock}
            variant="warning"
          />
          <StatsCard
            title="In Progress"
            value={stats.inProgress}
            icon={Activity}
            variant="info"
          />
          <StatsCard
            title="Resolved"
            value={stats.completed}
            icon={CheckCircle}
            variant="success"
          />
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="flex items-center justify-between p-4 rounded-xl bg-card/30 border border-border/50">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary">
                <Users className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Team Status</p>
                <p className="text-xs text-muted-foreground">{stats.volunteers} total volunteers</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-emerald-500">{stats.available}</p>
              <p className="text-xs text-muted-foreground">available now</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-card/30 border border-border/50">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary">
                <Activity className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Response Rate</p>
                <p className="text-xs text-muted-foreground">Average assignment time</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-sky-500">4.2m</p>
              <p className="text-xs text-muted-foreground">avg response</p>
            </div>
          </div>
        </div>

        {/* Incident Management Table */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Incident Management</h2>
              <p className="text-sm text-muted-foreground">
                Assign volunteers and track incident status
              </p>
            </div>
          </div>
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 mb-4">
              {error}
            </div>
          )}
          <AdminIncidentTable
            incidents={incidents}
            volunteers={volunteers}
            isLoading={isLoading}
            onAssignSuccess={fetchData}
          />
        </section>
      </div>
    </AppShell>
  )
}
