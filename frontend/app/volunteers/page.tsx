"use client"

import { useState, useEffect, useCallback } from "react"
import { AppShell } from "@/components/app-shell"
import { VolunteerRegistrationForm } from "@/components/volunteer-registration-form"
import { VolunteerList } from "@/components/volunteer-list"
import { StatsCard } from "@/components/stats-card"
import type { Volunteer } from "@/lib/types"
import { Users, UserCheck, Shield } from "lucide-react"

const API_URL = "http://localhost:5000/api/volunteers"

const VALID_ROLES = ["rescue", "medical", "logistics", "communications", "shelter"] as const

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

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVolunteers = useCallback(async () => {
    try {
      setError(null)
      const response = await fetch(API_URL)
      if (!response.ok) {
        throw new Error(`Failed to fetch volunteers (${response.status})`)
      }
      const data = await response.json()
      const list = Array.isArray(data) ? data : []
      setVolunteers(list.map(mapApiVolunteerToVolunteer))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load volunteers")
      setVolunteers([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVolunteers()
  }, [fetchVolunteers])

  const stats = {
    total: volunteers.length,
    available: volunteers.filter((v) => v.available).length,
    onMission: volunteers.filter((v) => !v.available).length,
  }

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>Team</span>
            <span>/</span>
            <span className="text-foreground">Volunteers</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Volunteer Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Register as a volunteer or manage the current response team roster
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatsCard
            title="Total Volunteers"
            value={stats.total}
            icon={Users}
            variant="default"
            description="Registered responders"
          />
          <StatsCard
            title="Available Now"
            value={stats.available}
            icon={UserCheck}
            variant="success"
            description="Ready for assignment"
          />
          <StatsCard
            title="On Active Duty"
            value={stats.onMission}
            icon={Shield}
            variant="warning"
            description="Currently deployed"
          />
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VolunteerRegistrationForm onSuccess={fetchVolunteers} />
          <VolunteerList volunteers={volunteers} isLoading={isLoading} error={error} />
        </div>
      </div>
    </AppShell>
  )
}
