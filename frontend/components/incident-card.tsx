"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { Incident } from "@/lib/types"
import {
  AlertTriangle,
  Droplets,
  Flame,
  Wind,
  Tornado,
  HelpCircle,
  MapPin,
  User,
  Clock,
  ArrowUpRight,
} from "lucide-react"

const disasterConfig = {
  earthquake: { 
    icon: AlertTriangle, 
    label: "Earthquake",
    gradient: "from-amber-500/20 to-amber-500/5",
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10 border-amber-500/20",
  },
  flood: { 
    icon: Droplets, 
    label: "Flood",
    gradient: "from-sky-500/20 to-sky-500/5",
    iconColor: "text-sky-500",
    iconBg: "bg-sky-500/10 border-sky-500/20",
  },
  fire: { 
    icon: Flame, 
    label: "Fire",
    gradient: "from-red-500/20 to-red-500/5",
    iconColor: "text-red-500",
    iconBg: "bg-red-500/10 border-red-500/20",
  },
  hurricane: { 
    icon: Wind, 
    label: "Hurricane",
    gradient: "from-violet-500/20 to-violet-500/5",
    iconColor: "text-violet-500",
    iconBg: "bg-violet-500/10 border-violet-500/20",
  },
  tornado: { 
    icon: Tornado, 
    label: "Tornado",
    gradient: "from-slate-500/20 to-slate-500/5",
    iconColor: "text-slate-400",
    iconBg: "bg-slate-500/10 border-slate-500/20",
  },
  other: { 
    icon: HelpCircle, 
    label: "Other",
    gradient: "from-muted/50 to-muted/20",
    iconColor: "text-muted-foreground",
    iconBg: "bg-muted/50 border-muted",
  },
}

const priorityConfig = {
  high: {
    label: "Critical",
    className: "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20",
    dot: "bg-red-500",
  },
  medium: {
    label: "Medium",
    className: "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20",
    dot: "bg-amber-500",
  },
  low: {
    label: "Low",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20",
    dot: "bg-emerald-500",
  },
}

const statusConfig = {
  pending: {
    label: "Awaiting Response",
    className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  assigned: {
    label: "In Progress",
    className: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  },
  completed: {
    label: "Resolved",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
}

interface IncidentCardProps {
  incident: Incident
}

function formatDate(date: Date): string {
  const month = date.toLocaleString("en-US", { month: "short" })
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? "PM" : "AM"
  const hour12 = hours % 12 || 12
  const minuteStr = minutes.toString().padStart(2, "0")
  return `${month} ${day}, ${hour12}:${minuteStr} ${ampm}`
}

export function IncidentCard({ incident }: IncidentCardProps) {
  const [formattedDate, setFormattedDate] = useState<string>("")
  
  useEffect(() => {
    setFormattedDate(formatDate(incident.createdAt))
  }, [incident.createdAt])

  const disaster = disasterConfig[incident.type]
  const Icon = disaster.icon
  const priority = priorityConfig[incident.priority]
  const status = statusConfig[incident.status]

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-card/80 hover:shadow-lg hover:shadow-background/50 animate-fade-in">
      {/* Top gradient based on disaster type */}
      <div className={cn(
        "absolute inset-x-0 top-0 h-24 bg-gradient-to-b pointer-events-none opacity-50",
        disaster.gradient
      )} />
      
      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-3">
            <div className={cn(
              "flex items-center justify-center w-11 h-11 rounded-xl border transition-transform duration-300 group-hover:scale-105",
              disaster.iconBg
            )}>
              <Icon className={cn("h-5 w-5", disaster.iconColor)} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">
                  {disaster.label}
                </h3>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                <MapPin className="h-3.5 w-3.5" />
                <span className="truncate max-w-[180px]">{incident.location}</span>
              </div>
            </div>
          </div>
          
          {/* Priority badge with pulse for high priority */}
          <Badge variant="outline" className={cn("text-xs font-medium", priority.className)}>
            <span className={cn(
              "w-1.5 h-1.5 rounded-full mr-1.5",
              priority.dot,
              incident.priority === "high" && "animate-pulse"
            )} />
            {priority.label}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
          {incident.description}
        </p>

        {/* Divider */}
        <div className="h-px bg-border/50 mb-4" />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {incident.assignedVolunteer ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10">
                  <User className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {incident.assignedVolunteer.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {incident.assignedVolunteer.role}
                  </span>
                </div>
              </div>
            ) : (
              <Badge variant="outline" className={status.className}>
                {status.label}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span suppressHydrationWarning>
              {formattedDate || "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
