import { ApiProduct } from '../store.types';

export const parseVolumeLidl = (basicQuantity: string): ApiProduct['volume'] => {
  const volumeMatch = basicQuantity.match(new RegExp(`(?<volume>\\d*\\,?\\d+)\\s?l`));

  const volume = volumeMatch?.groups?.volume;
  if (volume) {
    return Number(volume.replace(',', '.'));
  }
  return;
};

export const parseAlcVolumeLidl = (basicQuantity: string): ApiProduct['alcVolume'] => {
  const alcVolumeMatch = basicQuantity.match(
    new RegExp(`[,|]\\s*(?<alcVolume>\\d+(\\,\\d+)?)\\s*%.*alk`),
  );

  const alcVolume = alcVolumeMatch?.groups?.alcVolume;
  if (alcVolume) {
    return Number(alcVolume.replace(',', '.'));
  }
  return;
};
