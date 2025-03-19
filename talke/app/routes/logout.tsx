import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { matrixService } from '~/services/matrix.server';
import { destroyUserSession, getUserFromSession } from '~/utils/session.server';

export const action: ActionFunction = async ({ request }) => {
  const user = await getUserFromSession(request);
  
  if (user?.accessToken) {
    try {
      await matrixService.logout(user.accessToken);
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with session destruction even if Matrix logout fails
    }
  }

  return destroyUserSession(request);
};

export const loader: LoaderFunction = async () => {
  return redirect('/login');
};