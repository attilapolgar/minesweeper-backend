import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Collections } from "../../common/collections";
import { Board, Field } from "../../common/types/Board";
import { Match } from "../../common/types/Match";
import { generatePublicBoardView, getAdjacentFields } from "./match.utils";

let cachedMatches: { [key: string]: Match } = {};
let cachedBoards: { [key: string]: Board } = {};

export const triggerField = functions.https.onCall(
  async (data: { fieldIndex: number; matchId: string }, context) => {
    const uid = context.auth?.uid;

    if (!uid) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called " + "while authenticated."
      );
    }

    const match = await getMatch(data.matchId);
    let board = await getBoard(data.matchId);

    if (!match.playerIds.includes(uid)) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Not in game",
        data.matchId
      );
    }

    board = triggerF(cachedBoards[data.matchId], data.fieldIndex);

    const publicBoardView = generatePublicBoardView(board);

    match.view = publicBoardView;

    admin
      .firestore()
      .collection(Collections.BOARDS)
      .doc(data.matchId)
      .set(board)
      .catch((err) => {
        console.log("err", err);
      });
    cachedBoards[data.matchId] = board;

    admin
      .firestore()
      .collection(Collections.MATCHES)
      .doc(data.matchId)
      .update({
        view: publicBoardView,
      })
      .catch((err) => {
        console.log("err", err);
      });
    cachedMatches[data.matchId] = match;

    return publicBoardView;
  }
);

function triggerF(board: Board, index: number): Board {
  let fields = [...board.fields];

  fields = revealField(fields, index);

  return { ...board, fields };
}

function revealField(fields: Field[], index: number): Field[] {
  let ffields = [...fields];
  if (ffields[index].revealed) {
    return ffields;
  }

  if (ffields[index].mine) {
    ffields[index].revealed = true;
    return ffields;
  }

  if (ffields[index].number !== 0) {
    ffields[index].revealed = true;
    return ffields;
  }

  if (ffields[index].number === 0) {
    ffields[index].revealed = true;
    const adjacents = getAdjacentFields(ffields, index);
    adjacents.forEach((field) => {
      ffields = revealField(ffields, field.index);
    });

    return ffields;
  }

  return ffields;
}

async function getMatch(matchId: string): Promise<Match> {
  if (!cachedMatches[matchId]) {
    const matches = admin.firestore().collection(Collections.MATCHES);
    const snapshot = await matches.doc(matchId).get();

    if (!snapshot.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        "Match doesn't exist",
        matchId
      );
    }

    const match = snapshot.data() as Match;
    cachedMatches[matchId] = match;

    return match;
  }
  return cachedMatches[matchId];
}

async function getBoard(boardId: string): Promise<Board> {
  if (!cachedBoards[boardId]) {
    const boards = admin.firestore().collection(Collections.BOARDS);
    const snapshot = await boards.doc(boardId).get();

    if (!snapshot.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        "Board doesn't exist",
        boardId
      );
    }

    const board = snapshot.data() as Board;
    cachedBoards[boardId] = board;

    return board;
  }

  return cachedBoards[boardId];
}
