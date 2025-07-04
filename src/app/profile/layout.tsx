import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Perfil | RioPorto',
  description: 'Acesse seu perfil e dashboard na RioPorto',
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}