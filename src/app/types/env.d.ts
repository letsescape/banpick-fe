declare module NodeJS {
  interface ProcessEnv {
    APP_API_URL: string;
    PUSHER_APP_KEY: string;
    REVERB_APP_KEY: string,
    REVERB_HOST: string,
    REVERB_PORT: string,
    REVERB_SCHEME: string,
  }
}
