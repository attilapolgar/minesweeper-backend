import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

import { Collections } from "../../common/collections";
import { functionsWithRegion } from "../../common/firebase";
import { Match, MatchPlayer, MatchStatus } from "../../common/types/Match";
import { joinPlayer } from "./match.utils";

export const joinMatch = functionsWithRegion.https.onCall(
  async (data: { matchId: string }, context) => {
    const uid = context.auth?.uid;

    if (!uid) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called " + "while authenticated."
      );
    }

    const matches = admin.firestore().collection(Collections.MATCHES);
    const snapshot = await matches.doc(data.matchId).get();

    if (!snapshot.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        "Match doesn't exist",
        data.matchId
      );
    }

    const match = snapshot.data() as Match;

    if (!match) {
      throw new functions.https.HttpsError(
        "not-found",
        "Match doesn't exist",
        data.matchId
      );
    }

    try {
      const { players, playerIds, status } = joinPlayer(uid, match);

      const update: {
        players: MatchPlayer[];
        playerIds: string[];
        status: MatchStatus;
      } = { players, playerIds, status };

      await snapshot.ref.update(update);
      return update;
    } catch (error) {
      throw new functions.https.HttpsError("aborted", error);
    }
  }
);
