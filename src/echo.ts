import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

if (typeof window !== 'undefined') {
  // @ts-expect-error Pusher global requis
  window.Pusher = Pusher;
}

export const echo = new Echo({
  broadcaster: 'reverb',
  key: 'tjrv8tckfd85kckiu9ee',
  wsHost: 'localhost',
  wsPort: 8081,
  wssPort: 8081,
  forceTLS: false,
  enabledTransports: ['ws', 'wss'],
  withCredentials: true,
  // URL RELATIVE : c'est le proxy Vite qui redirigera vers localhost:8000
  authEndpoint: '/api/v1/broadcasting/auth',
  auth: {
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  },
});

export function subscribeToConversation(conversationId: number, onMessageSent: (event: unknown) => void) {
  const channel = echo.private(`conversations.${conversationId}`);
  channel.listen('.message.sent', onMessageSent);
  return channel;
}

export function unsubscribeFromConversation(conversationId: number) {
  echo.leave(`conversations.${conversationId}`);
}