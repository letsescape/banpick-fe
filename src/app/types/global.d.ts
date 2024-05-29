import Echo from 'laravel-echo';

declare global {
  interface Window {
    Pusher: any;
    Echo?: Echo;
  }
}

declare module 'laravel-echo' {
  interface Echo {}
}