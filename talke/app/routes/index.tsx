import { redirect } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import { getUserFromSession } from '~/utils/session.server';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserFromSession(request);

  // Redirect to chat if authenticated, otherwise to login
  if (user) {
    return redirect('/chat');
  }

  return redirect('/login');
};