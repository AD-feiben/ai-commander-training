/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GISCUS_REPO: string
  readonly VITE_GISCUS_REPO_ID: string
  readonly VITE_GISCUS_CATEGORY: string
  readonly VITE_GISCUS_CATEGORY_ID: string
  readonly VITE_GISCUS_MAPPING: string
  readonly VITE_GISCUS_REACTIONS_ENABLED: string
  readonly VITE_GISCUS_EMIT_METADATA: string
  readonly VITE_GISCUS_INPUT_POSITION: string
  readonly VITE_TENCENT_ADS_APP_ID: string
  readonly VITE_TENCENT_ADS_PLACEMENT_ID: string
  readonly VITE_GOOGLE_ADSENSE_CLIENT_ID: string
  readonly VITE_GOOGLE_ADSENSE_SLOT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
