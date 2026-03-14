import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function titleCaseWord(word: string) {
  if (!word) return word

  return word
    .split("'")
    .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : part))
    .join("'")
}

export function formatDisplayText(value: string) {
  const normalized = value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  if (!normalized) return ""

  return normalized
    .split(" ")
    .map((word) => titleCaseWord(word))
    .join(" ")
}

const INTENT_LABEL_OVERRIDES: Record<string, string> = {
  up_and_comers: "Up-and-Comers",
  role_models: "Role Models",
  door_openers: "Door-Openers",
  collaborators: "Collaborators",
  anyone_whos_vibing: "Anyone Who's Vibing",
}

export function formatIntentLabel(value: string) {
  const normalized = value.trim().toLowerCase()
  return INTENT_LABEL_OVERRIDES[normalized] ?? formatDisplayText(value)
}
