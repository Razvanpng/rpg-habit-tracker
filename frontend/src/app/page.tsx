import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default function RootPage() {
  // daca are cookie il aruncam in dashboard, altfel la login
  const cookieStore = cookies();
  const hasToken = cookieStore.has('token');

  if (hasToken) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}