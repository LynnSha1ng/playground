/// <reference types="vite/client" />

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

interface ImportMetaEnv {
  readonly VITE_BATCH_SIZE: string;
  readonly VITE_LIST_OFFSET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
