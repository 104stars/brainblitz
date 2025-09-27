import AuthGuard from '../../components/auth/AuthGuard'
import DashboardContent from '../../components/dashboard/DashboardContent'

export const metadata = {
  title: 'Dashboard - BrainBlitz',
  description: 'Tu panel principal de BrainBlitz. Ve tus estadísticas, únete a partidas públicas y crea nuevas competencias.',
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
