import { Outlet } from '@remix-run/react';
import { ThemeProvider } from '~/components/ui/ThemeProvider';
import NotificationSnackbar from '~/components/notifications/NotificationSnackbar';
import { useNotification } from '~/hooks/useNotification';

export default function AppLayout() {
  const { notification, hideNotification } = useNotification();

  return (
    <ThemeProvider>
      <Outlet />
      <NotificationSnackbar
        notification={notification}
        onClose={hideNotification}
      />
    </ThemeProvider>
  );
}