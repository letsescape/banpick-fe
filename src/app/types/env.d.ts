
declare module NodeJS {
  interface ProcessEnv {
    APP_API_URL: string;
    PUSHER_APP_KEY: string;
  }
}