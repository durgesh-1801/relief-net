import type { Incident, Volunteer } from "./types"

export const mockIncidents: Incident[] = [
  {
    id: "1",
    type: "earthquake",
    location: "Downtown District, Sector 4",
    description: "Building collapse reported. Multiple people trapped.",
    priority: "high",
    status: "assigned",
    assignedVolunteer: {
      id: "v1",
      name: "Sarah Chen",
      role: "rescue",
      available: false,
    },
    createdAt: new Date("2024-03-20T10:30:00"),
  },
  {
    id: "2",
    type: "flood",
    location: "Riverside Community, Zone B",
    description: "Water levels rising. Evacuation assistance needed.",
    priority: "high",
    status: "pending",
    createdAt: new Date("2024-03-20T11:00:00"),
  },
  {
    id: "3",
    type: "fire",
    location: "Industrial Area, Block 7",
    description: "Warehouse fire spreading. Medical support required.",
    priority: "medium",
    status: "assigned",
    assignedVolunteer: {
      id: "v2",
      name: "Marcus Johnson",
      role: "medical",
      available: false,
    },
    createdAt: new Date("2024-03-20T09:45:00"),
  },
  {
    id: "4",
    type: "hurricane",
    location: "Coastal Region, Area C",
    description: "Storm damage assessment needed.",
    priority: "low",
    status: "completed",
    assignedVolunteer: {
      id: "v3",
      name: "Emily Rodriguez",
      role: "logistics",
      available: true,
    },
    createdAt: new Date("2024-03-19T14:20:00"),
  },
  {
    id: "5",
    type: "tornado",
    location: "Suburban Heights, Section 2",
    description: "Power lines down. Road clearance needed.",
    priority: "medium",
    status: "pending",
    createdAt: new Date("2024-03-20T08:15:00"),
  },
]

export const mockVolunteers: Volunteer[] = [
  { id: "v1", name: "Sarah Chen", role: "rescue", available: false },
  { id: "v2", name: "Marcus Johnson", role: "medical", available: false },
  { id: "v3", name: "Emily Rodriguez", role: "logistics", available: true },
  { id: "v4", name: "James Wilson", role: "communications", available: true },
  { id: "v5", name: "Maria Garcia", role: "shelter", available: true },
  { id: "v6", name: "David Kim", role: "rescue", available: true },
]
