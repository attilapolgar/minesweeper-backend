import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { Collections } from "../../common/collections";
import {
  MatchPlayer,
  MatchPlayerStatus,
  Match,
  MatchStatus,
} from "../../common/types/Match";
import { sample } from "../../common/utils";

export const readyForMatch = functions.https.onCall(
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

    const started =
      players.filter((player) => player.status === MatchPlayerStatus.READY)
        .length === match.noPlayers;

    const status = started ? MatchStatus.STARTED : MatchStatus.READY_TO_START;

    const activePlayer = started ? sample(match.playerIds) : null;

    const update: {
      players: MatchPlayer[];
      status: MatchStatus;
      activePlayer: string | null;
    } = {
      players,
      status,
      activePlayer,
    };

    return snapshot.ref.update(update);
  }
);
