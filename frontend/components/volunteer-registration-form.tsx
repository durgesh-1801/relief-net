"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { VolunteerRole } from "@/lib/types"
import { 
  Users, 
  User, 
  MapPin,
  CheckCircle,
  Shield,
  Heart,
  Truck,
  Radio,
  Home,
} from "lucide-react"

const volunteerRoles: { value: VolunteerRole; label: string; description: string; icon: React.ElementType }[] = [
  { value: "rescue", label: "Rescue Ops", description: "Search and rescue missions", icon: Shield },
  { value: "medical", label: "Medical", description: "First aid and medical care", icon: Heart },
  { value: "logistics", label: "Logistics", description: "Supply chain management", icon: Truck },
  { value: "communications", label: "Comms", description: "Coordination and dispatch", icon: Radio },
  { value: "shelter", label: "Shelter", description: "Temporary housing ops", icon: Home },
]

const API_URL = "http://localhost:5000/api/volunteers"

interface VolunteerRegistrationFormProps {
  onSuccess?: () => void
}

export function VolunteerRegistrationForm({ onSuccess }: VolunteerRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    role: "" as VolunteerRole | "",
  })

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
          name: formData.name,
          role: formData.role,
          location: formData.location || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message ?? `Request failed (${response.status})`)
      }

      setFormData({ name: "", location: "", role: "" })
      setIsSubmitted(true)
      onSuccess?.()
      setTimeout(() => setIsSubmitted(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to register volunteer")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm p-8 text-center animate-scale-in">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />
        <div className="relative">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Registration Complete
          </h3>
          <p className="text-sm text-muted-foreground">
            Thank you for volunteering. We will contact you soon.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
      
      <div className="relative p-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 border border-primary/20">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Join Our Team</h2>
            <p className="text-sm text-muted-foreground">Register as a volunteer responder</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
          {/* Name */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="pl-10 h-11 bg-secondary/30 border-border/50 focus:bg-secondary/50 focus:border-primary/30"
                required
              />
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
                placeholder="City, region or area"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="pl-10 h-11 bg-secondary/30 border-border/50 focus:bg-secondary/50 focus:border-primary/30"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-foreground">
              Specialty
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {volunteerRoles.map((role) => {
                const Icon = role.icon
                const isSelected = formData.role === role.value
                return (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: role.value })}
                    className={cn(
                      "flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200",
                      isSelected
                        ? "bg-primary/10 border-primary/40 text-primary"
                        : "bg-secondary/30 border-border/50 text-muted-foreground hover:bg-secondary/50 hover:border-border"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{role.label}</span>
                  </button>
                )
              })}
            </div>
            {formData.role && (
              <p className="text-xs text-muted-foreground mt-1">
                {volunteerRoles.find((r) => r.value === formData.role)?.description}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !formData.name || !formData.role}
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Registering...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Join Team
              </span>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
