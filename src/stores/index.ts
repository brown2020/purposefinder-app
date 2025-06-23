// Export the initialization hook
export { useInitializeStores } from './useInitializeStores';

// Export all store hooks
export { useAuthStore } from './useAuthStore';
export { default as useProfileStore } from './useProfileStore';
export { usePurposeStore, defaultPurpose } from './usePurposeStore';
export { useMoonshotStore, defaultMoonshot } from './useMoonshotStore';
export { useIntroStore, defaultIntro } from './useIntroStore';

// You can also export any common types or interfaces here if needed
export type { IntroType } from './useIntroStore';
export type { MoonshotType } from './useMoonshotStore';
export type { PurposeType } from './usePurposeStore';
export type { AuthState } from './useAuthStore';
export type { ProfileType } from './useProfileStore';
