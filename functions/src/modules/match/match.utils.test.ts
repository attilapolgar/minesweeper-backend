import { MatchStatus } from "./../../common/types/Match";
import {
  generateBoardForMatch,
  generateAdjacents,
  getNumberOfAdjacentMines,
  getAdjacentFields,
  getUpperField,
  getUpperLeftField,
  getUpperRightField,
  getLeftField,
  getRightField,
  getLowerLeftField,
  getLowerField,
  getLowerRightField,
  generatePublicBoardView,
} from "./match.utils";
import { Match } from "../../common/types/Match";
import { Board } from "../../common/types/Board";

const mockedMatch: Match = {
  boardSize: 16,
  numberOfMines: 51,
  activePlayer: "p1",
  createdBy: "p1",
  noPlayers: 2,
  playerIds: ["p1", "p2"],
  status: MatchStatus.STARTED,
  players: [],
  view: "",
};

/*
    [x][1][0][0]
    [2][2][2][1]
    [1][x][2][x]
    [1][1][2][1]

    [0][1][2][3]
    [4][5][6][7]
    [8][9][0][1]
    [2][3][4][5]
*/
const mockedFields4x4 = [
  { color: "red", number: null, revealed: false, mine: true, index: 0 },
  { color: "red", number: null, revealed: true, mine: false, index: 1 },
  { color: "red", number: null, revealed: true, mine: false, index: 2 },
  { color: "red", number: null, revealed: true, mine: false, index: 3 },
  { color: "red", number: null, revealed: false, mine: false, index: 4 },
  { color: "red", number: null, revealed: true, mine: false, index: 5 },
  { color: "red", number: null, revealed: true, mine: false, index: 6 },
  { color: "red", number: null, revealed: true, mine: false, index: 7 },
  { color: "red", number: null, revealed: false, mine: false, index: 8 },
  { color: "red", number: null, revealed: true, mine: true, index: 9 },
  { color: "red", number: null, revealed: false, mine: false, index: 10 },
  { color: "red", number: null, revealed: false, mine: true, index: 11 },
  { color: "red", number: null, revealed: false, mine: false, index: 12 },
  { color: "red", number: null, revealed: false, mine: false, index: 13 },
  { color: "red", number: null, revealed: false, mine: false, index: 14 },
  { color: "red", number: null, revealed: false, mine: false, index: 15 },
];

const mockedBoard4x4: Board = {
  fields: generateAdjacents(mockedFields4x4),
};

describe("generateFields", () => {
  it("should return with a board", () => {
    const result = generateBoardForMatch(mockedMatch);

    expect(result.fields.filter((field) => field.mine).length).toBe(
      mockedMatch.numberOfMines
    );
  });
});

describe("generateAdjacents", () => {
  it("should calculated the number of adjacent mines", () => {
    const result = generateAdjacents(mockedFields4x4);

    /*
    [x][1]
    [1][1]
    */
    const expectedResult = [
      { color: "red", revealed: false, mine: true, number: 0, index: 0 },
      { color: "red", revealed: true, mine: false, number: 1, index: 1 },
      { color: "red", revealed: true, mine: false, number: 0, index: 2 },
      { color: "red", revealed: true, mine: false, number: 0, index: 3 },
      { color: "red", revealed: false, mine: false, number: 2, index: 4 },
      { color: "red", revealed: true, mine: false, number: 2, index: 5 },
      { color: "red", revealed: true, mine: false, number: 2, index: 6 },
      { color: "red", revealed: true, mine: false, number: 1, index: 7 },
      { color: "red", revealed: false, mine: false, number: 1, index: 8 },
      { color: "red", revealed: true, mine: true, number: 0, index: 9 },
      { color: "red", revealed: false, mine: false, number: 2, index: 10 },
      { color: "red", revealed: false, mine: true, number: 0, index: 11 },
      { color: "red", revealed: false, mine: false, number: 1, index: 12 },
      { color: "red", revealed: false, mine: false, number: 1, index: 13 },
      { color: "red", revealed: false, mine: false, number: 2, index: 14 },
      { color: "red", revealed: false, mine: false, number: 1, index: 15 },
    ];

    expect(result).toEqual(expectedResult);
  });
});

describe("getNumberOfAdjacentMines", () => {
  it("should return the number of adjacent mines", () => {
    expect(getNumberOfAdjacentMines(mockedFields4x4, 0)).toEqual(0);
    expect(getNumberOfAdjacentMines(mockedFields4x4, 1)).toEqual(1);
    expect(getNumberOfAdjacentMines(mockedFields4x4, 2)).toEqual(0);
    expect(getNumberOfAdjacentMines(mockedFields4x4, 3)).toEqual(0);
    expect(getNumberOfAdjacentMines(mockedFields4x4, 4)).toEqual(2);
    expect(getNumberOfAdjacentMines(mockedFields4x4, 5)).toEqual(2);
    expect(getNumberOfAdjacentMines(mockedFields4x4, 6)).toEqual(2);
    expect(getNumberOfAdjacentMines(mockedFields4x4, 7)).toEqual(1);
    expect(getNumberOfAdjacentMines(mockedFields4x4, 8)).toEqual(1);
    expect(getNumberOfAdjacentMines(mockedFields4x4, 9)).toEqual(0);
    expect(getNumberOfAdjacentMines(mockedFields4x4, 10)).toEqual(2);
    expect(getNumberOfAdjacentMines(mockedFields4x4, 11)).toEqual(0);
    expect(getNumberOfAdjacentMines(mockedFields4x4, 12)).toEqual(1);
    expect(getNumberOfAdjacentMines(mockedFields4x4, 13)).toEqual(1);
    expect(getNumberOfAdjacentMines(mockedFields4x4, 14)).toEqual(2);
    expect(getNumberOfAdjacentMines(mockedFields4x4, 15)).toEqual(1);
  });
});

describe("getAdjacentFields", () => {
  it("should return the adjacent fields", () => {
    const result = getAdjacentFields(mockedFields4x4, 1);

    /*
      [x][T][x][ ]
      [x][x][x][ ]
      [ ][ ][ ][ ]
      [ ][ ][ ][ ]
    */
    const expectedResult = [
      mockedFields4x4[0],
      mockedFields4x4[2],
      mockedFields4x4[4],
      mockedFields4x4[5],
      mockedFields4x4[6],
    ];

    expect(result).toEqual(expectedResult);
  });
});

describe("getUpperLeftField", () => {
  it("should return the upper left field", () => {
    expect(getUpperLeftField(mockedFields4x4, 0)).toBeNull();
    expect(getUpperLeftField(mockedFields4x4, 1)).toBeNull();
    expect(getUpperLeftField(mockedFields4x4, 2)).toBeNull();
    expect(getUpperLeftField(mockedFields4x4, 3)).toBeNull();
    expect(getUpperLeftField(mockedFields4x4, 4)).toBeNull();
    expect(getUpperLeftField(mockedFields4x4, 5)).toEqual(mockedFields4x4[0]);
    expect(getUpperLeftField(mockedFields4x4, 6)).toEqual(mockedFields4x4[1]);
    expect(getUpperLeftField(mockedFields4x4, 7)).toEqual(mockedFields4x4[2]);
    expect(getUpperLeftField(mockedFields4x4, 8)).toBeNull();
    expect(getUpperLeftField(mockedFields4x4, 9)).toEqual(mockedFields4x4[4]);
    expect(getUpperLeftField(mockedFields4x4, 10)).toEqual(mockedFields4x4[5]);
    expect(getUpperLeftField(mockedFields4x4, 11)).toEqual(mockedFields4x4[6]);
    expect(getUpperLeftField(mockedFields4x4, 12)).toBeNull();
    expect(getUpperLeftField(mockedFields4x4, 13)).toEqual(mockedFields4x4[8]);
    expect(getUpperLeftField(mockedFields4x4, 14)).toEqual(mockedFields4x4[9]);
    expect(getUpperLeftField(mockedFields4x4, 15)).toEqual(mockedFields4x4[10]);
  });
});

describe("getUpperField", () => {
  it("should return the upper field", () => {
    expect(getUpperField(mockedFields4x4, 0)).toBeNull();
    expect(getUpperField(mockedFields4x4, 1)).toBeNull();
    expect(getUpperField(mockedFields4x4, 2)).toBeNull();
    expect(getUpperField(mockedFields4x4, 3)).toBeNull();
    expect(getUpperField(mockedFields4x4, 4)).toEqual(mockedFields4x4[0]);
    expect(getUpperField(mockedFields4x4, 5)).toEqual(mockedFields4x4[1]);
    expect(getUpperField(mockedFields4x4, 6)).toEqual(mockedFields4x4[2]);
    expect(getUpperField(mockedFields4x4, 7)).toEqual(mockedFields4x4[3]);
    expect(getUpperField(mockedFields4x4, 8)).toEqual(mockedFields4x4[4]);
    expect(getUpperField(mockedFields4x4, 9)).toEqual(mockedFields4x4[5]);
    expect(getUpperField(mockedFields4x4, 10)).toEqual(mockedFields4x4[6]);
    expect(getUpperField(mockedFields4x4, 11)).toEqual(mockedFields4x4[7]);
    expect(getUpperField(mockedFields4x4, 12)).toEqual(mockedFields4x4[8]);
    expect(getUpperField(mockedFields4x4, 13)).toEqual(mockedFields4x4[9]);
    expect(getUpperField(mockedFields4x4, 14)).toEqual(mockedFields4x4[10]);
    expect(getUpperField(mockedFields4x4, 15)).toEqual(mockedFields4x4[11]);
  });
});

describe("getUpperRightField", () => {
  it("should return the upper right field", () => {
    expect(getUpperRightField(mockedFields4x4, 0)).toBeNull();
    expect(getUpperRightField(mockedFields4x4, 1)).toBeNull();
    expect(getUpperRightField(mockedFields4x4, 2)).toBeNull();
    expect(getUpperRightField(mockedFields4x4, 3)).toBeNull();
    expect(getUpperRightField(mockedFields4x4, 4)).toEqual(mockedFields4x4[1]);
    expect(getUpperRightField(mockedFields4x4, 5)).toEqual(mockedFields4x4[2]);
    expect(getUpperRightField(mockedFields4x4, 6)).toEqual(mockedFields4x4[3]);
    expect(getUpperRightField(mockedFields4x4, 7)).toBeNull();
    expect(getUpperRightField(mockedFields4x4, 8)).toEqual(mockedFields4x4[5]);
    expect(getUpperRightField(mockedFields4x4, 9)).toEqual(mockedFields4x4[6]);
    expect(getUpperRightField(mockedFields4x4, 10)).toEqual(mockedFields4x4[7]);
    expect(getUpperRightField(mockedFields4x4, 11)).toBeNull();
    expect(getUpperRightField(mockedFields4x4, 12)).toEqual(mockedFields4x4[9]);
    expect(getUpperRightField(mockedFields4x4, 13)).toEqual(
      mockedFields4x4[10]
    );
    expect(getUpperRightField(mockedFields4x4, 14)).toEqual(
      mockedFields4x4[11]
    );
    expect(getUpperRightField(mockedFields4x4, 15)).toBeNull();
  });
});

describe("getLeftField", () => {
  it("should return the left field", () => {
    expect(getLeftField(mockedFields4x4, 0)).toBeNull();
    expect(getLeftField(mockedFields4x4, 1)).toEqual(mockedFields4x4[0]);
    expect(getLeftField(mockedFields4x4, 2)).toEqual(mockedFields4x4[1]);
    expect(getLeftField(mockedFields4x4, 3)).toEqual(mockedFields4x4[2]);
    expect(getLeftField(mockedFields4x4, 4)).toBeNull;
    expect(getLeftField(mockedFields4x4, 5)).toEqual(mockedFields4x4[4]);
    expect(getLeftField(mockedFields4x4, 6)).toEqual(mockedFields4x4[5]);
    expect(getLeftField(mockedFields4x4, 7)).toEqual(mockedFields4x4[6]);
    expect(getLeftField(mockedFields4x4, 8)).toBeNull;
    expect(getLeftField(mockedFields4x4, 9)).toEqual(mockedFields4x4[8]);
    expect(getLeftField(mockedFields4x4, 10)).toEqual(mockedFields4x4[9]);
    expect(getLeftField(mockedFields4x4, 11)).toEqual(mockedFields4x4[10]);
    expect(getLeftField(mockedFields4x4, 12)).toBeNull;
    expect(getLeftField(mockedFields4x4, 13)).toEqual(mockedFields4x4[12]);
    expect(getLeftField(mockedFields4x4, 14)).toEqual(mockedFields4x4[13]);
    expect(getLeftField(mockedFields4x4, 15)).toEqual(mockedFields4x4[14]);
  });
});

describe("getRightField", () => {
  it("should return the right field", () => {
    expect(getRightField(mockedFields4x4, 0)).toEqual(mockedFields4x4[1]);
    expect(getRightField(mockedFields4x4, 1)).toEqual(mockedFields4x4[2]);
    expect(getRightField(mockedFields4x4, 2)).toEqual(mockedFields4x4[3]);
    expect(getRightField(mockedFields4x4, 3)).toBeNull();
    expect(getRightField(mockedFields4x4, 4)).toEqual(mockedFields4x4[5]);
    expect(getRightField(mockedFields4x4, 5)).toEqual(mockedFields4x4[6]);
    expect(getRightField(mockedFields4x4, 6)).toEqual(mockedFields4x4[7]);
    expect(getRightField(mockedFields4x4, 7)).toBeNull();
    expect(getRightField(mockedFields4x4, 8)).toEqual(mockedFields4x4[9]);
    expect(getRightField(mockedFields4x4, 9)).toEqual(mockedFields4x4[10]);
    expect(getRightField(mockedFields4x4, 10)).toEqual(mockedFields4x4[11]);
    expect(getRightField(mockedFields4x4, 11)).toBeNull();
    expect(getRightField(mockedFields4x4, 12)).toEqual(mockedFields4x4[13]);
    expect(getRightField(mockedFields4x4, 13)).toEqual(mockedFields4x4[14]);
    expect(getRightField(mockedFields4x4, 14)).toEqual(mockedFields4x4[15]);
    expect(getRightField(mockedFields4x4, 15)).toBeNull;
  });
});

describe("getLowerLeftField", () => {
  it("should return the upper left field", () => {
    expect(getLowerLeftField(mockedFields4x4, 0)).toBeNull();
    expect(getLowerLeftField(mockedFields4x4, 1)).toEqual(mockedFields4x4[4]);
    expect(getLowerLeftField(mockedFields4x4, 2)).toEqual(mockedFields4x4[5]);
    expect(getLowerLeftField(mockedFields4x4, 3)).toEqual(mockedFields4x4[6]);
    expect(getLowerLeftField(mockedFields4x4, 4)).toBeNull();
    expect(getLowerLeftField(mockedFields4x4, 5)).toEqual(mockedFields4x4[8]);
    expect(getLowerLeftField(mockedFields4x4, 6)).toEqual(mockedFields4x4[9]);
    expect(getLowerLeftField(mockedFields4x4, 7)).toEqual(mockedFields4x4[10]);
    expect(getLowerLeftField(mockedFields4x4, 8)).toBeNull();
    expect(getLowerLeftField(mockedFields4x4, 9)).toEqual(mockedFields4x4[12]);
    expect(getLowerLeftField(mockedFields4x4, 10)).toEqual(mockedFields4x4[13]);
    expect(getLowerLeftField(mockedFields4x4, 11)).toEqual(mockedFields4x4[14]);
    expect(getLowerLeftField(mockedFields4x4, 12)).toBeNull();
    expect(getLowerLeftField(mockedFields4x4, 13)).toBeNull();
    expect(getLowerLeftField(mockedFields4x4, 14)).toBeNull();
    expect(getLowerLeftField(mockedFields4x4, 15)).toBeNull();
  });
});

describe("getLowerField", () => {
  it("should return the upper field", () => {
    expect(getLowerField(mockedFields4x4, 0)).toEqual(mockedFields4x4[4]);
    expect(getLowerField(mockedFields4x4, 1)).toEqual(mockedFields4x4[5]);
    expect(getLowerField(mockedFields4x4, 2)).toEqual(mockedFields4x4[6]);
    expect(getLowerField(mockedFields4x4, 3)).toEqual(mockedFields4x4[7]);
    expect(getLowerField(mockedFields4x4, 4)).toEqual(mockedFields4x4[8]);
    expect(getLowerField(mockedFields4x4, 5)).toEqual(mockedFields4x4[9]);
    expect(getLowerField(mockedFields4x4, 6)).toEqual(mockedFields4x4[10]);
    expect(getLowerField(mockedFields4x4, 7)).toEqual(mockedFields4x4[11]);
    expect(getLowerField(mockedFields4x4, 8)).toEqual(mockedFields4x4[12]);
    expect(getLowerField(mockedFields4x4, 9)).toEqual(mockedFields4x4[13]);
    expect(getLowerField(mockedFields4x4, 10)).toEqual(mockedFields4x4[14]);
    expect(getLowerField(mockedFields4x4, 11)).toEqual(mockedFields4x4[15]);
    expect(getLowerField(mockedFields4x4, 12)).toBeNull();
    expect(getLowerField(mockedFields4x4, 13)).toBeNull();
    expect(getLowerField(mockedFields4x4, 14)).toBeNull();
    expect(getLowerField(mockedFields4x4, 15)).toBeNull();
  });
});

describe("getLowerRightField", () => {
  it("should return the upper right field", () => {
    expect(getLowerRightField(mockedFields4x4, 0)).toEqual(mockedFields4x4[5]);
    expect(getLowerRightField(mockedFields4x4, 1)).toEqual(mockedFields4x4[6]);
    expect(getLowerRightField(mockedFields4x4, 2)).toEqual(mockedFields4x4[7]);
    expect(getLowerRightField(mockedFields4x4, 3)).toBeNull();
    expect(getLowerRightField(mockedFields4x4, 4)).toEqual(mockedFields4x4[9]);
    expect(getLowerRightField(mockedFields4x4, 5)).toEqual(mockedFields4x4[10]);
    expect(getLowerRightField(mockedFields4x4, 6)).toEqual(mockedFields4x4[11]);
    expect(getLowerRightField(mockedFields4x4, 7)).toBeNull();
    expect(getLowerRightField(mockedFields4x4, 8)).toEqual(mockedFields4x4[13]);
    expect(getLowerRightField(mockedFields4x4, 9)).toEqual(mockedFields4x4[14]);
    expect(getLowerRightField(mockedFields4x4, 10)).toEqual(
      mockedFields4x4[15]
    );
    expect(getLowerRightField(mockedFields4x4, 11)).toBeNull();
    expect(getLowerRightField(mockedFields4x4, 12)).toBeNull();
    expect(getLowerRightField(mockedFields4x4, 13)).toBeNull();
    expect(getLowerRightField(mockedFields4x4, 14)).toBeNull();
    expect(getLowerRightField(mockedFields4x4, 15)).toBeNull();
  });
});

describe("generatePublicBoardView", () => {
  it("should return with the encoded view", () => {
    const result = generatePublicBoardView(mockedBoard4x4);

    expect(result).toEqual("_;1;0;0;_;2;2;1;_;X:red;_;_;_;_;_;_");
  });
});
