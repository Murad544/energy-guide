export type ResourceCategory = "az" | "world" | "tech" | "market";

export type ResourceItem = {
  title: string;
  url: string;
  source: string;
  category: ResourceCategory;
};
