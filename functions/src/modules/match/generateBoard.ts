import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Collections } from "../../common/collections";
import { Board } from "../../common/types/Board";
import { Match } from "../../common/types/Match";
import { generateBoardForMatch } from "./match.utils";

export const generateBoard = functions.firestore
  .document(`${Collections.MATCHES}/{matchId}`)
  .onCreate(async (snapshot, context) => {
    const match = snapshot.data() as Match;
    const board: Board = generateBoardForMatch(match);

    await admin
      .firestore()
      .collection(Collections.BOARDS)
      .doc(context.params.matchId)
      .set(board);

    return true;
  });
