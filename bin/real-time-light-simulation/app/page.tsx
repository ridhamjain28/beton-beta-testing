import { LightingStudio } from "@/components/lighting-studio"
import { AccessGate } from "@/components/access-gate"

export default function Page() {
  return (
    <AccessGate>
      <LightingStudio />
    </AccessGate>
  )
}
