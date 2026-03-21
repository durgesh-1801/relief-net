export type Priority = "high" | "medium" | "low"
export type Status = "pending" | "assigned" | "completed"
export type DisasterType = "earthquake" | "flood" | "fire" | "hurricane" | "tornado" | "other"
export type VolunteerRole = "rescue" | "medical" | "logistics" | "communications" | "shelter"

export interface Incident {
  id: string
  type: DisasterType
  location: string
  description: string
  priority: Priority
  status: Status
  assignedVolunteer?: Volunteer
  createdAt: Date
}

export interface Volunteer {
  id: string
  name: string
  role: VolunteerRole
  available: boolean
}
