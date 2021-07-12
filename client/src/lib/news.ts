export type NewsEntry = {
  date: string;
  content: string[];
};

export const news: NewsEntry[] = [
  {
    date: "2021-07-10",
    content: ["Pridėta nauja parduotuvė: Vynoteka"],
  },
  {
    date: "2021-05-22",
    content: [
      "Dėl rimi puslapio pertvarkos, buvo sustoję rimi prekių registacija. Vėl sutaisyta.",
    ],
  },
  { date: "2021-05-08", content: ["Pataisyta rimi parduotuvės paieška"] },
  {
    date: "2021-05-03",
    content: [
      "Galimybė įdiegti aplikaciją mobiliąjame telefone",
      "Patobulintas mobilaus puslapio rodinys",
    ],
  },
];
