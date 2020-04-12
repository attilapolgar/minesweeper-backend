export enum FieldCodeTable {
  UNREVEALED = "_",
  MINE = "X",
  SEPARATOR = ";",
}

export type Field = {
  mine: boolean;
  index: number;
  revealed: boolean;
  number: number | null;
};

export type Board = {
  fields: Field[];
};
