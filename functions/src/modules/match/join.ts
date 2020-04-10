import { MatchPlayer } from "./../../common/types/Match";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { Collections } from "../../common/collections";
import { MatchStatus, MatchPlayerStatus } from "../../common/types/Match";

export const joinMatch = functions.https.onCall(
  async (data: { matchId: string }, context) => {
    const uid = context.auth?.uid;

    if (!uid) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called " + "while authenticated."
      );
    } else {
      const matches = admin.firestore().collection(Collections.MATCHES);
      const snapshot = await matches.doc(data.matchId).get();
      if (!snapshot.exists) {
        throw new functions.https.HttpsError(
          "not-found",
          "Match doesn't exist",
          data.matchId
        );
      }

      const match = snapshot.data();

      if (!match) {
        throw new functions.https.HttpsError(
          "not-found",
          "Match doesn't exist",
          data.matchId
        );
      }

      if (match.playerIds.includes(uid)) {
        throw new functions.https.HttpsError(
          "failed-precondition",
          "Already in game",
          data.matchId
        );
      }

      if (match.playerIds.length >= match.noPlayers) {
        throw new functions.https.HttpsError(
          "failed-precondition",
          "Game is full",
          data.matchId
        );
      }

      const update: {
        players: MatchPlayer[];
        playerIds: string[];
        status: MatchStatus;
      } = {
        players: match.players.concat([
          {
            userId: uid,
            score: 0,
            color: "red",
            status: MatchPlayerStatus.JOINED,
          },
        ]),
        playerIds: match.playerIds.concat([uid]),
        status: MatchStatus.READY_TO_START,
      };

      return snapshot.ref.update(update);
    }
  }
);
