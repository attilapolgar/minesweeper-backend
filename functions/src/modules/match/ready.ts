import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { Collections } from "../../common/collections";
import { MatchPlayer, MatchPlayerStatus } from "../../common/types/Match";

export const readyForMatch = functions.https.onCall(
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

      if (!match.playerIds.includes(uid)) {
        throw new functions.https.HttpsError(
          "failed-precondition",
          "Not in game",
          data.matchId
        );
      }

      const players = match.players.map((player: MatchPlayer) => {
        if (player.userId === uid) {
          return {
            ...player,
            status: MatchPlayerStatus.READY,
          };
        }
        return player;
      });

      const update: {
        players: MatchPlayer[];
      } = {
        players,
      };

      return snapshot.ref.update(update);
    }
  }
);
