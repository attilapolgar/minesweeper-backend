import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { Collections } from "../../common/collections";
import {
  MatchStatus,
  Match,
  MatchPlayerStatus,
} from "../../common/types/Match";

export const createMatch = functions.https.onCall(async (data, context) => {
  try {
    const uid = context.auth?.uid;

    if (!uid) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called " + "while authenticated."
      );
    }

    const match: Match = {
      players: [
        {
          userId: uid,
          score: 0,
          color: "blue",
          status: MatchPlayerStatus.JOINED,
        },
      ],
      boardSize: 16,
      playerIds: [uid],
      noPlayers: 2,
      numberOfMines: 51,
      status: MatchStatus.WAITING,
      activePlayer: null,
      view: "",
      createdBy: uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await admin.firestore().collection(Collections.MATCHES).add(match);

    return true;
  } catch (error) {
    console.log("error", error);
    return false;
  }
});
