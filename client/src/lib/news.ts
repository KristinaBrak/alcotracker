export type NewsEntry = {
  date: string;
  content: string[];
};

export const news: NewsEntry[] = [
  { date: "2021-05-08", content: ["Pataisyta rimi parduotuvės paieška"] },
  {
    date: "2021-05-03",
    content: [
      "Galimybė įdiegti aplikaciją mobiliąjame telefone",
      "Patobulintas mobilaus puslapio rodinys",
    ],
  },
];
