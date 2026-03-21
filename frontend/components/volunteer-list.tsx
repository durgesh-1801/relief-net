"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Volunteer } from "@/lib/types"
import { Shield, Heart, Truck, Radio, Home, Users } from "lucide-react"

const roleConfig = {
  rescue: { icon: Shield, label: "Rescue", color: "text-red-500", bg: "bg-red-500/10" },
  medical: { icon: Heart, label: "Medical", color: "text-pink-500", bg: "bg-pink-500/10" },
  logistics: { icon: Truck, label: "Logistics", color: "text-amber-500", bg: "bg-amber-500/10" },
  communications: { icon: Radio, label: "Comms", color: "text-sky-500", bg: "bg-sky-500/10" },
  shelter: { icon: Home, label: "Shelter", color: "text-emerald-500", bg: "bg-emerald-500/10" },
}

interface VolunteerListProps {
  volunteers: Volunteer[]
  isLoading?: boolean
  error?: string | null
}

export function VolunteerList({ volunteers, isLoading, error }: VolunteerListProps) {
  const availableCount = volunteers.filter(v => v.available).length

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-secondary/30 to-transparent pointer-events-none" />
      
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary border border-border/50">
              <Users className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Team Roster</h2>
              <p className="text-sm text-muted-foreground">{volunteers.length} registered volunteers</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
            {availableCount} available
          </Badge>
        </div>

        <div className="flex flex-col gap-2">
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <span className="h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
          volunteers.map((volunteer, index) => {
            const role = roleConfig[volunteer.role]
            const Icon = role.icon
            const initials = volunteer.name.split(" ").map(n => n[0]).join("").slice(0, 2)

            return (
              <div
                key={volunteer.id}
                className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 border border-transparent hover:border-border/50 transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border border-border/50">
                    <AvatarFallback className={cn("text-xs font-medium", role.bg, role.color)}>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">{volunteer.name}</p>
                    <div className="flex items-center gap-1.5">
                      <Icon className={cn("h-3 w-3", role.color)} />
                      <span className="text-xs text-muted-foreground">{role.label}</span>
                    </div>
                  </div>
                </div>
                <div className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                  volunteer.available
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-amber-500/10 text-amber-400"
                )}>
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    volunteer.available ? "bg-emerald-500" : "bg-amber-500"
                  )} />
                  {volunteer.available ? "Available" : "On Mission"}
                </div>
              </div>
            )
          }) )}
        </div>
      </div>
    </div>
  )
}
