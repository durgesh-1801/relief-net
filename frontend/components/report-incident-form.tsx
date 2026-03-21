"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { DisasterType, Priority } from "@/lib/types"
import { 
  AlertTriangle, 
  MapPin, 
  FileText, 
  Send, 
  CheckCircle,
  Flame,
  Droplets,
  Wind,
  Tornado,
  HelpCircle,
  Zap,
  Shield,
  Clock,
} from "lucide-react"

const disasterTypes: { value: DisasterType; label: string; icon: React.ElementType }[] = [
  { value: "earthquake", label: "Earthquake", icon: AlertTriangle },
  { value: "flood", label: "Flood", icon: Droplets },
  { value: "fire", label: "Fire", icon: Flame },
  { value: "hurricane", label: "Hurricane", icon: Wind },
  { value: "tornado", label: "Tornado", icon: Tornado },
  { value: "other", label: "Other", icon: HelpCircle },
]

const priorityLevels: { value: Priority; label: string; description: string; icon: React.ElementType; color: string }[] = [
  { value: "high", label: "Critical", description: "Life-threatening situation", icon: Zap, color: "text-red-500" },
  { value: "medium", label: "Urgent", description: "Requires prompt attention", icon: Shield, color: "text-amber-500" },
  { value: "low", label: "Standard", description: "Non-critical incident", icon: Clock, color: "text-emerald-500" },
]

export function ReportIncidentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    type: "" as DisasterType | "",
    location: "",
    description: "",
    priority: "" as Priority | "",
  })

  const API_URL = "http://localhost:5000/api/reports"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: formData.type,
          location: formData.location,
          description: formData.description,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message ?? `Request failed (${response.status})`)
      }

      setFormData({ type: "", location: "", description: "", priority: "" })
      setIsSubmitted(true)
      setTimeout(() => {
        setIsSubmitted(false)
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit report")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm p-12 text-center animate-scale-in">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-emerald-500" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Incident Reported Successfully
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your report has been submitted and will be reviewed by our response team immediately.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
        {/* Header gradient */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
        
        <div className="relative p-6 sm:p-8">
          {/* Form header */}
          <div className="flex items-start gap-4 mb-8">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20">
              <AlertTriangle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Report New Incident</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Provide details about the emergency situation
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}
            {/* Disaster Type Selection */}
            <div className="flex flex-col gap-3">
              <Label className="text-sm font-medium text-foreground">
                Disaster Type
              </Label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {disasterTypes.map((type) => {
                  const Icon = type.icon
                  const isSelected = formData.type === type.value
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type.value })}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200",
                        isSelected
                          ? "bg-primary/10 border-primary/40 text-primary"
                          : "bg-secondary/30 border-border/50 text-muted-foreground hover:bg-secondary/50 hover:border-border"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs font-medium">{type.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Priority Selection */}
            <div className="flex flex-col gap-3">
              <Label className="text-sm font-medium text-foreground">
                Priority Level
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {priorityLevels.map((level) => {
                  const Icon = level.icon
                  const isSelected = formData.priority === level.value
                  return (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: level.value })}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-left",
                        isSelected
                          ? "bg-primary/5 border-primary/30"
                          : "bg-secondary/30 border-border/50 hover:bg-secondary/50 hover:border-border"
                      )}
                    >
                      <div className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-lg",
                        isSelected ? "bg-primary/10" : "bg-muted/50"
                      )}>
                        <Icon className={cn("h-5 w-5", isSelected ? "text-primary" : level.color)} />
                      </div>
                      <div>
                        <span className={cn(
                          "block text-sm font-medium",
                          isSelected ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {level.label}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {level.description}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Location */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="location" className="text-sm font-medium text-foreground">
                Location
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="Enter incident location or address"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="pl-10 h-12 bg-secondary/30 border-border/50 focus:bg-secondary/50 focus:border-primary/30"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="description" className="text-sm font-medium text-foreground">
                Description
              </Label>
              <div className="relative">
                <Textarea
                  id="description"
                  placeholder="Describe the incident in detail. Include information about affected people, immediate dangers, and any assistance already on scene..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-32 bg-secondary/30 border-border/50 focus:bg-secondary/50 focus:border-primary/30 resize-none"
                  required
                />
                <FileText className="absolute right-3 top-3 h-4 w-4 text-muted-foreground/50" />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !formData.type ||
                !formData.location ||
                !formData.description ||
                !formData.priority
              }
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Submitting Report...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Submit Incident Report
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
