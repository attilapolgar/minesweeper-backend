export type Field = {
  mine: boolean;
  index: number;
};

export type Board = {
  size: number;
  fields: Field[];
};
