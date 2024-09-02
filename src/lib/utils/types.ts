export type AdviceItem = {
  id: number;
  content: string;
};

export type AppUser = {
  name: string;
  adviceIds: number[];
};
