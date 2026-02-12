'use client'

import { SigningPage } from '@/components/signing/SigningPage'

export default function SharePage({ params }: { params: { token: string } }) {
  return <SigningPage token={params.token} />
}
