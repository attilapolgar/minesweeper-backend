import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { Collections } from "../../common/collections";
import { functionsWithRegion } from "../../common/firebase";
import { createNewMatch, joinPlayer } from "./match.utils";

export const createMatch = functionsWithRegion.https.onCall(
  async (_, context) => {
    const uid = context.auth?.uid;

    if (!uid) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called " + "while authenticated."
      );
    }

    try {
      let match = createNewMatch();
      match = joinPlayer(uid, match);
      match = {
        ...match,
        createdBy: uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await admin.firestore().collection(Collections.MATCHES).add(match);
      return match;
    } catch (error) {
      throw new functions.https.HttpsError("aborted", error);
    }
  }
);
