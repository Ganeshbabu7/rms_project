// typings.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_HTTP_SERVER: string | undefined;
    // Add other environment variables here if needed
  }
}
