/// <reference types="vite/client" />

interface ImportMetaEnv {
   readonly VITE_API_URL: string;
   readonly VITE_API_USERS: string;
   readonly VITE_API_CARTS: string;
   readonly VITE_API_ORDERS: string;
   readonly VITE_API_EMAIL: string;
   readonly VITE_API_LOGIN: string;
   readonly VITE_API_VINYL: string;
   readonly VITE_API_CHECKOUT: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
