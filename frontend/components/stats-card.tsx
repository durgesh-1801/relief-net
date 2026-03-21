"use client"

import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: "default" | "primary" | "warning" | "success" | "info"
  description?: string
}

const variantConfig = {
  default: {
    iconBg: "bg-secondary",
    iconColor: "text-foreground",
    glow: "",
  },
  primary: {
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    glow: "group-hover:shadow-[0_0_30px_rgba(239,68,68,0.1)]",
  },
  warning: {
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    glow: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.1)]",
  },
  success: {
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    glow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]",
  },
  info: {
    iconBg: "bg-sky-500/10",
    iconColor: "text-sky-500",
    glow: "group-hover:shadow-[0_0_30px_rgba(14,165,233,0.1)]",
  },
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  variant = "default",
  description,
}: StatsCardProps) {
  const config = variantConfig[variant]

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 transition-all duration-300 hover:border-border hover:bg-card/80",
      config.glow
    )}>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-card/50 to-transparent pointer-events-none" />
      
      <div className="relative flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold tracking-tight text-foreground">
              {value}
            </p>
            {trend && (
              <div className={cn(
                "flex items-center gap-0.5 text-xs font-medium",
                trend.isPositive ? "text-emerald-500" : "text-red-500"
              )}>
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        
        <div className={cn(
          "flex items-center justify-center w-12 h-12 rounded-xl transition-transform duration-300 group-hover:scale-110",
          config.iconBg
        )}>
          <Icon className={cn("h-6 w-6", config.iconColor)} />
        </div>
      </div>
    </div>
  )
}
