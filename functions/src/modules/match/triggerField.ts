import { MatchPlayer } from "./../../common/types/Match";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Collections } from "../../common/collections";
import { Board, Field } from "../../common/types/Board";
import { Match } from "../../common/types/Match";
import { generatePublicBoardView, getAdjacentFields } from "./match.utils";
import { functionsWithRegion } from "../../common/firebase";

const cachedMatches: { [key: string]: Match } = {};
const cachedBoards: { [key: string]: Board } = {};

export const triggerField = functionsWithRegion.https.onCall(
  async (data: { fieldIndex: number; matchId: string }, context) => {
    const uid = context.auth?.uid;

    if (!uid) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called " + "while authenticated."
      );
    }

    const match = await getMatch(data.matchId);
    const matchUpdates: {
      view?: string;
      activePlayer?: string | null;
      players?: MatchPlayer[];
    } = {};
    const board = await getBoard(data.matchId);

    if (!match.playerIds.includes(uid)) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Not in game",
        data.matchId
      );
    }

    const activePlayer = match.players.find(
      (player) => player.userId === match.activePlayer
    );

    if (!activePlayer) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "No active player",
        data.matchId
      );
    }

    const { endTurn, board: _board, score } = triggerF(
      board,
      data.fieldIndex,
      activePlayer.color
    );

    const publicBoardView = generatePublicBoardView(_board);

    matchUpdates.view = publicBoardView;

    if (endTurn) {
      matchUpdates.activePlayer = match.playerIds.filter(
        (playerId) => playerId !== match.activePlayer
      )[0];
    }

    if (score) {
      matchUpdates.players = match.players.map((player) => {
        if (player.userId === match.activePlayer) {
          return { ...player, score: player.score + score };
        }

        return player;
      });
    }

    admin
      .firestore()
      .collection(Collections.BOARDS)
      .doc(data.matchId)
      .set(_board)
      .catch((err) => {
        console.log("err", err);
      });
    cachedBoards[data.matchId] = _board;

    admin
      .firestore()
      .collection(Collections.MATCHES)
      .doc(data.matchId)
      .update(matchUpdates)
      .catch((err) => {
        console.log("err", err);
      });
    cachedMatches[data.matchId] = { ...match, ...matchUpdates };

    return matchUpdates;
  }
);

function triggerF(
  board: Board,
  index: number,
  color: string
): { endTurn: boolean; board: Board; score: number } {
  const { endTurn, fields, score } = revealField(board.fields, index, color);

  return { endTurn, board: { ...board, fields }, score };
}

function revealField(
  fields: Field[],
  index: number,
  color: string
): { endTurn: boolean; fields: Field[]; score: number } {
  let _fields = [...fields];
  if (_fields[index].revealed) {
    return { endTurn: false, score: 0, fields: _fields };
  }

  if (_fields[index].mine) {
    _fields[index].revealed = true;
    _fields[index].color = color;
    return { endTurn: false, score: 1, fields: _fields };
  }

  if (_fields[index].number !== 0) {
    _fields[index].revealed = true;
    _fields[index].color = color;
    return { endTurn: true, score: 0, fields: _fields };
  }

  if (_fields[index].number === 0) {
    _fields[index].revealed = true;
    _fields[index].color = color;
    const adjacents = getAdjacentFields(_fields, index);
    adjacents.forEach((field) => {
      const { fields: newFields } = revealField(_fields, field.index, color);
      _fields = newFields;
    });

    return { endTurn: true, score: 0, fields: _fields };
  }

  return { endTurn: false, score: 0, fields: _fields };
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
