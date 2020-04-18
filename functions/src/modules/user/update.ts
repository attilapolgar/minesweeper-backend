import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { Collections } from "../../common/collections";
import { functionsWithRegion } from "../../common/firebase";

export const updateUser = functionsWithRegion.https.onCall((data, context) => {
  const uid = context.auth?.uid;

  if (!uid) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called " + "while authenticated."
    );
  } else
    return admin.firestore().collection(Collections.USERS).doc(uid).update({
      name: data.name,
      description: data.description,
      avatarUrl: data.avatarUrl,
      updated: admin.firestore.FieldValue.serverTimestamp(),
    });
});
