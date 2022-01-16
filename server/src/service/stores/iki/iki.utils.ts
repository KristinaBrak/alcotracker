import { ApiProduct, Category } from '../store.types';

export const convertToCategory = (category: string): Category => {
  const categoryDictionary: { [key: string]: Category | undefined } = {
    ['stiprieji gėrimai']: Category.STRONG,
    ['alus']: Category.LIGHT,
    ['vynas']: Category.WINE,
    ['sidras, kokteiliai']: Category.LIGHT,
  };
  return categoryDictionary[category.toLowerCase()] ?? Category.OTHER;
};

export const parseVolume = (volumeText: string): ApiProduct['volume'] => {
  if (!volumeText) {
    return;
  }
  const [volumeValueText] = volumeText.split(' ');
  return Number(volumeValueText.replace(',', '.'));
};

export const parseAlcVolume = (alcVolumeText: string): ApiProduct['alcVolume'] => {
  if (!alcVolumeText) {
    return;
  }
  return Number(alcVolumeText.replace('%', '').replace('|', '').trim().replace(',', '.'));
};
