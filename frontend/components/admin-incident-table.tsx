"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import type { Incident, Volunteer } from "@/lib/types"
import {
  AlertTriangle,
  Droplets,
  Flame,
  Wind,
  Tornado,
  HelpCircle,
  UserPlus,
  CheckCircle,
  Search,
  Filter,
  ArrowUpDown,
  MapPin,
  Clock,
  Zap,
} from "lucide-react"

const disasterConfig = {
  earthquake: { icon: AlertTriangle, label: "Earthquake", color: "text-amber-500", bg: "bg-amber-500/10" },
  flood: { icon: Droplets, label: "Flood", color: "text-sky-500", bg: "bg-sky-500/10" },
  fire: { icon: Flame, label: "Fire", color: "text-red-500", bg: "bg-red-500/10" },
  hurricane: { icon: Wind, label: "Hurricane", color: "text-violet-500", bg: "bg-violet-500/10" },
  tornado: { icon: Tornado, label: "Tornado", color: "text-slate-400", bg: "bg-slate-500/10" },
  other: { icon: HelpCircle, label: "Other", color: "text-muted-foreground", bg: "bg-muted/50" },
}

const priorityConfig = {
  high: { label: "Critical", className: "bg-red-500/10 text-red-400 border-red-500/20", dot: "bg-red-500" },
  medium: { label: "Medium", className: "bg-amber-500/10 text-amber-400 border-amber-500/20", dot: "bg-amber-500" },
  low: { label: "Low", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-500" },
}

const statusConfig = {
  pending: { label: "Pending", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  assigned: { label: "In Progress", className: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
  completed: { label: "Resolved", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
}

const AUTO_ASSIGN_URL = "http://localhost:5000/api/auto-assign"
const ASSIGN_URL = "http://localhost:5000/api/assign"

interface AdminIncidentTableProps {
  incidents: Incident[]
  volunteers: Volunteer[]
  isLoading?: boolean
  onAssignSuccess?: () => void
}

export function AdminIncidentTable({
  incidents,
  volunteers,
  isLoading = false,
  onAssignSuccess,
}: AdminIncidentTableProps) {
  const [selectedVolunteer, setSelectedVolunteer] = useState<string>("")
  const [assignDialogIncidentId, setAssignDialogIncidentId] = useState<string | null>(null)
  const [autoAssigningId, setAutoAssigningId] = useState<string | null>(null)
  const [assigningId, setAssigningId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const availableVolunteers = volunteers.filter((v) => v.available)

  const handleAutoAssign = async (reportId: string) => {
    setAutoAssigningId(reportId)
    setError(null)
    try {
      const response = await fetch(AUTO_ASSIGN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId }),
      })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message ?? `Auto-assign failed (${response.status})`)
      }
      onAssignSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Auto-assign failed")
    } finally {
      setAutoAssigningId(null)
    }
  }

  const handleAssign = async (reportId: string, volunteerId: string) => {
    setAssigningId(reportId)
    setError(null)
    try {
      const response = await fetch(ASSIGN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, volunteerId }),
      })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message ?? `Assign failed (${response.status})`)
      }
      setAssignDialogIncidentId(null)
      setSelectedVolunteer("")
      onAssignSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Assign failed")
    } finally {
      setAssigningId(null)
    }
  }

  const filteredIncidents = incidents.filter(
    (incident) =>
      incident.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disasterConfig[incident.type].label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
      {error && (
        <div className="mx-4 mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 border-b border-border/50">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search incidents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-secondary/30 border-border/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-2 border-border/50 bg-secondary/30">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
          <Button variant="outline" size="sm" className="h-9 gap-2 border-border/50 bg-secondary/30">
            <ArrowUpDown className="h-4 w-4" />
            <span className="hidden sm:inline">Sort</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50 bg-secondary/20">
              <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Incident</th>
              <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Location</th>
              <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Priority</th>
              <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Status</th>
              <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Assigned</th>
              <th className="text-right p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-12 text-center">
                  <span className="inline-block h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </td>
              </tr>
            ) : (
            filteredIncidents.map((incident, index) => {
              const disaster = disasterConfig[incident.type]
              const Icon = disaster.icon
              const priority = priorityConfig[incident.priority]
              const currentStatus = incident.status
              const status = statusConfig[currentStatus]
              const isAutoAssigning = autoAssigningId === incident.id
              const isAssigning = assigningId === incident.id

              return (
                <tr
                  key={incident.id}
                  className="border-b border-border/30 hover:bg-secondary/20 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  {/* Incident Type */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("flex items-center justify-center w-9 h-9 rounded-lg", disaster.bg)}>
                        <Icon className={cn("h-4 w-4", disaster.color)} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{disaster.label}</p>
                        <p className="text-xs text-muted-foreground md:hidden flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {incident.location.slice(0, 20)}...
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="p-4 hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground/60" />
                      <span className="truncate max-w-[200px]">{incident.location}</span>
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="p-4">
                    <Badge variant="outline" className={cn("text-xs font-medium", priority.className)}>
                      <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", priority.dot)} />
                      {priority.label}
                    </Badge>
                  </td>

                  {/* Status */}
                  <td className="p-4 hidden sm:table-cell">
                    <Badge variant="outline" className={cn("text-xs", status.className)}>
                      {status.label}
                    </Badge>
                  </td>

                  {/* Assigned */}
                  <td className="p-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {incident.assignedVolunteer?.name || "—"}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="p-4 text-right">
                    {currentStatus === "pending" ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAutoAssign(incident.id)}
                          disabled={isAutoAssigning}
                          className="h-8 gap-1.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/30 disabled:opacity-50"
                        >
                          {isAutoAssigning ? (
                            <span className="h-3.5 w-3.5 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                          ) : (
                            <Zap className="h-3.5 w-3.5" />
                          )}
                          <span className="hidden sm:inline">Auto Assign</span>
                        </Button>
                        <Dialog open={assignDialogIncidentId === incident.id} onOpenChange={(open) => { if (!open) { setAssignDialogIncidentId(null); setSelectedVolunteer("") } }}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              onClick={() => setAssignDialogIncidentId(incident.id)}
                              className="h-8 gap-1.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:border-primary/30"
                            >
                              <UserPlus className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Assign</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Assign Volunteer</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 mb-4">
                                <div className={cn("flex items-center justify-center w-10 h-10 rounded-lg", disaster.bg)}>
                                  <Icon className={cn("h-5 w-5", disaster.color)} />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foreground">{disaster.label}</p>
                                  <p className="text-xs text-muted-foreground">{incident.location}</p>
                                </div>
                              </div>
                              <Select value={selectedVolunteer} onValueChange={setSelectedVolunteer}>
                                <SelectTrigger className="w-full bg-secondary/30 border-border/50">
                                  <SelectValue placeholder="Select a volunteer" />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableVolunteers.length > 0 ? (
                                    availableVolunteers.map((volunteer) => (
                                      <SelectItem key={volunteer.id} value={volunteer.id}>
                                        {volunteer.name} ({volunteer.role})
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem value="none" disabled>
                                      No volunteers available
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setAssignDialogIncidentId(null)}>
                                Cancel
                              </Button>
                              <Button
                                onClick={() => selectedVolunteer && handleAssign(incident.id, selectedVolunteer)}
                                disabled={!selectedVolunteer || isAssigning}
                                className="bg-primary hover:bg-primary/90"
                              >
                                {isAssigning ? (
                                  <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                ) : (
                                  "Confirm"
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    ) : currentStatus === "assigned" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-sky-400">
                        <Clock className="h-3.5 w-3.5" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Done
                      </span>
                    )}
                  </td>
                </tr>
              )
            }))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-4 border-t border-border/50 bg-secondary/10">
        <p className="text-sm text-muted-foreground">
          Showing {filteredIncidents.length} of {incidents.length} incidents
        </p>
      </div>
    </div>
  )
}
