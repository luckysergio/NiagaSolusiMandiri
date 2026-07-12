import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

export const echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  forceTLS: true,
  encrypted: true,
  
  authEndpoint: `${import.meta.env.VITE_API_URL}/broadcasting/auth`,
  
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      Accept: 'application/json',
    },
  },
});

export const updateEchoAuth = () => {
  const token = localStorage.getItem('access_token');
  if (token && echo) {
    echo.connector.pusher.config.auth = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    };
  }
};