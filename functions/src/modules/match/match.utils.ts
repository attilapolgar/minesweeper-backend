import { FieldCodeTable } from "./../../common/types/Board";
import { Field, Board } from "../../common/types/Board";
import { Match } from "../../common/types/Match";

export function generateBoardForMatch(match: Match): Board {
  return {
    fields: generateFields(match.boardSize, 51),
  };
}

export function generateFields(
  boardSize: number,
  minesToGenerate: number
): Field[] {
  const numberOfFields = boardSize * boardSize;
  const emptyFields = generateEmptyFields(numberOfFields);

  let numberOfMines = 0;
  while (numberOfMines < minesToGenerate) {
    const randomField = Math.floor(Math.random() * numberOfFields);
    if (!emptyFields[randomField].mine) {
      emptyFields[randomField].mine = true;
      numberOfMines++;
    }
  }

  return generateAdjacents(emptyFields);
}

export function generateEmptyFields(numberOfFields: number) {
  return Array(numberOfFields)
    .fill(null)
    .map((_, i) => ({
      id: `field-${i}`,
      revealed: false,
      mine: false,
      number: 0,
      found: false,
      color: null,
      index: i,
    }));
}

export function generateAdjacents(fields: Field[]): Field[] {
  return fields.map((field, i) => ({
    ...field,
    number: getNumberOfAdjacentMines(fields, i),
  }));
}

export function getNumberOfAdjacentMines(
  fields: Field[],
  index: number
): number {
  return getAdjacentFields(fields, index).filter((field) => field.mine).length;
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

export function getAdjacentFields(fields: Field[], index: number): Field[] {
  return [
    getUpperLeftField(fields, index),
    getUpperField(fields, index),
    getUpperRightField(fields, index),
    getLeftField(fields, index),
    getRightField(fields, index),
    getLowerLeftField(fields, index),
    getLowerField(fields, index),
    getLowerRightField(fields, index),
  ].filter(notEmpty);
}

export function getUpperField(fields: Field[], index: number): Field | null {
  const upperIndex = index - Math.sqrt(fields.length);
  return fields[upperIndex] ? fields[upperIndex] : null;
}

export function getUpperLeftField(
  fields: Field[],
  index: number
): Field | null {
  const rowSize = Math.sqrt(fields.length);
  if (index % rowSize === 0) {
    return null;
  }
  const upperLeftIndex = index - rowSize - 1;
  return fields[upperLeftIndex] ? fields[upperLeftIndex] : null;
}

export function getUpperRightField(
  fields: Field[],
  index: number
): Field | null {
  const rowSize = Math.sqrt(fields.length);
  if (index % rowSize === rowSize - 1) {
    return null;
  }
  const upperRightIndex = index - rowSize + 1;
  return fields[upperRightIndex] ? fields[upperRightIndex] : null;
}

export function getLowerLeftField(
  fields: Field[],
  index: number
): Field | null {
  const rowSize = Math.sqrt(fields.length);
  if (index % rowSize === 0) {
    return null;
  }
  const lowerLeftIndex = index + rowSize - 1;
  return fields[lowerLeftIndex] ? fields[lowerLeftIndex] : null;
}

export function getLowerField(fields: Field[], index: number): Field | null {
  const lowerIndex = index + Math.sqrt(fields.length);
  return fields[lowerIndex] ? fields[lowerIndex] : null;
}

export function getLowerRightField(
  fields: Field[],
  index: number
): Field | null {
  const rowSize = Math.sqrt(fields.length);
  if (index % rowSize === rowSize - 1) {
    return null;
  }
  const lowerRightIndex = index + rowSize + 1;
  return fields[lowerRightIndex] ? fields[lowerRightIndex] : null;
}

export function getLeftField(fields: Field[], index: number): Field | null {
  const rowSize = Math.sqrt(fields.length);
  if (index % rowSize === 0) {
    return null;
  }
  return fields[index - 1];
}

export function getRightField(fields: Field[], index: number): Field | null {
  const rowSize = Math.sqrt(fields.length);
  if (index % rowSize === rowSize - 1) {
    return null;
  }
  return fields[index + 1];
}

export function generatePublicBoardView(board: Board): string {
  return board.fields
    .map((field) => {
      if (!field.revealed) {
        return FieldCodeTable.UNREVEALED;
      }
      if (!field.mine) {
        return field.number;
      }

      if (field.mine) {
        return FieldCodeTable.MINE;
      }

      return "";
    })
    .join(FieldCodeTable.SEPARATOR);
}
