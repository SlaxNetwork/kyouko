export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URL: string;
            REDIS_URL: string;

            PRIVATE_KEY: string;

            PORT: number;

            DEV: boolean;
        }
    }
}
