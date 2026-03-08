import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminPage() {
  // Server-side auth check - redirect before any rendering
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('admin_session');

  if (!authCookie) {
    redirect('/admin/login');
  }

  return <AdminDashboardClient />;
}