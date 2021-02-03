import axios from "axios";
import cheerio from "cheerio";
import { Category, Product } from "../store.types";

interface RimiCategory {
  name: string;
  link: string;
}

const rimiURL = "https://www.rimi.lt";

const rimiAlcoholURL =
  "https://www.rimi.lt/e-parduotuve/lt/produktai/alkoholiniai-gerimai/c/SH-1";

const beerURL =
  "https://www.rimi.lt/e-parduotuve/lt/produktai/alkoholiniai-gerimai/alus/c/SH-1-1/";

export const getBeer = async () => {
  try {
    const { data } = await axios.get(beerURL, {
      headers: {
        Cookie:
          "rimi_storefront_session=eyJpdiI6Im9oblVcL29wMFN4enRvNDhIN25Nam9nPT0iLCJ2YWx1ZSI6ImxXZlVHbEl0OW54ZG11UXdJaWFLcWFcL25QUE9rdzZvZ0l1SUR0am0wU1BGeHRrUFwvR05vTlBUMlJVTXRYQmFBUSIsIm1hYyI6IjFlNWE3OTAxMTZkOTQ1ZTQ1NGRiMmI4YmIyMGNjMmU0MzU0Yzc3YzhiNDVhZTMzM2M1ZjQxZmUzOGQ2N2FkZTAifQ%3D%3D; ",
      },
    });

    const $ = cheerio.load(data);
    $.html();
    const beerList: string[] = [];
    $("li.product-grid__item > div.js-product-container").each((_, el) => {
      const beer = $(el).attr("data-gtm-eec-product") ?? "";
      beerList.push(beer);
      console.log("Each", beer);
    });
    return beerList;
  } catch (error) {
    throw new Error(error.message);
  }
};

const fetchVolume = async (url: string) => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        Cookie:
          "rimi_storefront_session=eyJpdiI6Im9oblVcL29wMFN4enRvNDhIN25Nam9nPT0iLCJ2YWx1ZSI6ImxXZlVHbEl0OW54ZG11UXdJaWFLcWFcL25QUE9rdzZvZ0l1SUR0am0wU1BGeHRrUFwvR05vTlBUMlJVTXRYQmFBUSIsIm1hYyI6IjFlNWE3OTAxMTZkOTQ1ZTQ1NGRiMmI4YmIyMGNjMmU0MzU0Yzc3YzhiNDVhZTMzM2M1ZjQxZmUzOGQ2N2FkZTAifQ%3D%3D; ",
      },
    });

    const $ = cheerio.load(data);
    $.html();
    const volume: string[] = [];
    $("div.product__list-wrapper> ul.list > li > span").each((_, el) => {
      if ($(el).text() === "Kiekis") {
        const volumeText = $(el).siblings().text();
        volume.push(volumeText.split("l")[0].trim());
      }
    });
    return volume[0];
  } catch (error) {
    return "??";
  }
};

const convertToCategory = (category: string) => {
  const categoryDictionary: { [key: string]: Category | undefined } = {
    ["vynas"]: Category.WINE,
    ["degtinė"]: Category.STRONG,
    ["viskis"]: Category.STRONG,
    ["brendis"]: Category.STRONG,
    ["trauktinė ir likeris"]: Category.STRONG,
    ["tekila"]: Category.STRONG,
    ["romas"]: Category.STRONG,
    ["konjakas"]: Category.STRONG,
    ["džinas"]: Category.STRONG,
    ["alus"]: Category.LIGHT,
    ["sidras"]: Category.LIGHT,
    ["kokteiliai"]: Category.LIGHT,
    ["nealkoholiniai gėrimai"]: Category.FREE,
  };

  return categoryDictionary[category.toLowerCase()] ?? Category.OTHER;
};

export const fetchRimiCategoryProducts = async ({
  name,
  link,
}: RimiCategory) => {
  const products: Product[] = [];
  try {
    const { data } = await axios.get(link, {
      headers: {
        Cookie:
          "rimi_storefront_session=eyJpdiI6Im9oblVcL29wMFN4enRvNDhIN25Nam9nPT0iLCJ2YWx1ZSI6ImxXZlVHbEl0OW54ZG11UXdJaWFLcWFcL25QUE9rdzZvZ0l1SUR0am0wU1BGeHRrUFwvR05vTlBUMlJVTXRYQmFBUSIsIm1hYyI6IjFlNWE3OTAxMTZkOTQ1ZTQ1NGRiMmI4YmIyMGNjMmU0MzU0Yzc3YzhiNDVhZTMzM2M1ZjQxZmUzOGQ2N2FkZTAifQ%3D%3D; ",
      },
    });

    const $ = cheerio.load(data);
    $.html();
    $("li.product-grid__item > div.js-product-container").each(
      async (_, el) => {
        const details = $(el).attr("data-gtm-eec-product") ?? "";

        //Attribute (data-gtm-eec-product) structure with examples:
        // {"id":"1363162",
        // "name":"Alus \u0160VYTURYS EKSTRA, 5,2 %, 6 X 0,5 l sk.",
        // "category":"SH-1-1-2",
        // "brand":null,
        // "price":5.89,
        // "currency":"EUR"}

        const product = JSON.parse(details);
        const productDetails = product.name.split(", ");

        const productName = productDetails[0];
        const productCategory = convertToCategory(name);
        const productPrice = product.price;

        const alcVolumeText: string[] = product.name.match(/\d?\,?\d\s?%/) ?? [
          "-1%",
        ];
        const alcVolumes: string[] = alcVolumeText[0].split("%");
        const alcVolume = Number(alcVolumes[0].replace(",", ".").trim());

        const image =
          $(el).find("div.card__image-wrapper > div > img").attr("src") ?? "#";
        const productLink = rimiURL + ($(el).children("a").attr("href") ?? "/");

        const volume = Number(await fetchVolume(productLink));

        products.push({
          name: productName,
          category: productCategory,
          price: productPrice,
          alcVolume,
          volume,
          link: productLink,
          image,
        });

        console.log("Each", {
          name: productName,
          category: productCategory,
          price: productPrice,
          alcVolume,
          volume,
          link: productLink,
          image,
        });
      }
    );
    return products;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchRimiCategories = async () => {
  try {
    const { data } = await axios.get(rimiAlcoholURL, {
      headers: {
        Cookie:
          "rimi_storefront_session=eyJpdiI6Im9oblVcL29wMFN4enRvNDhIN25Nam9nPT0iLCJ2YWx1ZSI6ImxXZlVHbEl0OW54ZG11UXdJaWFLcWFcL25QUE9rdzZvZ0l1SUR0am0wU1BGeHRrUFwvR05vTlBUMlJVTXRYQmFBUSIsIm1hYyI6IjFlNWE3OTAxMTZkOTQ1ZTQ1NGRiMmI4YmIyMGNjMmU0MzU0Yzc3YzhiNDVhZTMzM2M1ZjQxZmUzOGQ2N2FkZTAifQ%3D%3D; ",
      },
    });

    const $ = cheerio.load(data);
    $.html();
    const urlList: RimiCategory[] = [];

    $(
      "#main > nav > div.category-menu__wrapper.-child.js-child-categories > a[href='/e-parduotuve/lt/produktai/alkoholiniai-gerimai/c/SH-1']"
    )
      .siblings()
      .find("li > a")
      .each((_, el) => {
        const alcoURL = $(el).attr("href") ?? "";
        const alcoName = $(el).text() ?? "";
        console.log("name", alcoName);
        urlList.push({ name: alcoName, link: alcoURL });
      });
    return urlList;
  } catch (error) {
    throw new Error(error.message);
  }
};
