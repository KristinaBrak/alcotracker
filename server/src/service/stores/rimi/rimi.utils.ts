import { ApiProduct } from '../store.types';

export const extractAlcVolume = (productName: string): ApiProduct['alcVolume'] => {
  const alcVolumeText: string[] | undefined = productName.match(/\d?\d?\,?\d\s?%/) ?? undefined;
  if (alcVolumeText) {
    const alcVolumeList: string[] = alcVolumeText[0].split('%');
    const alcVolume = Number(alcVolumeList[0].replace(',', '.').trim());
    return alcVolume;
  }
  return undefined;
};

export const extractVolume = (productName: string): ApiProduct['volume'] => {
  const volumeText = productName.match(/(\d?\,?\d+)\s?l/);
  if (volumeText) {
    const volumeOfUnit = Number(volumeText[0].replace(',', '.').replace('l', '').trim());
    const quantityText = productName.match(/(\d)\s?[Xx]\s?/);
    if (!quantityText) {
      return volumeOfUnit;
    }
    const quantity = Number(
      quantityText[0]
        .trim()
        .split(/\s?[Xx]\s?/)[0]
        .trim(),
    );
    const volume = volumeOfUnit * quantity;
    return volume;
  }
  return;
};

export const deduplicate =
  (prop: string) =>
  <T extends { [key: string]: any }>(acc: T[], item: T) =>
    acc.find(a => a[prop] === item[prop]) ? acc : [...acc, item];
