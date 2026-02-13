export enum PlatformType {
  WEB = 'WEB',
  MOBILE_IOS = 'MOBILE_IOS',
  MOBILE_ANDROID = 'MOBILE_ANDROID',
}

/**
 * Retorna a plataforma atual do dispositivo
 * @returns 'WEB' sempre para web app
 */
export function getCurrentPlatform(): PlatformType.WEB {
  return PlatformType.WEB;
}
