'use client'

import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { DashboardOverview } from '@/components/dashboard/DashboardOverview'

export default function DashboardPage() {
  return (
    <div>
      <DashboardHeader
        title="Dashboard"
        description="Overview of your workspace"
      />
      <DashboardOverview />
    </div>
  )
}
