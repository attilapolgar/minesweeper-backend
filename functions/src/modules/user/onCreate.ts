import { functionsWithRegion } from "./../../common/firebase";
import { DEFAULT_NAME, DEFAULT_MOTTO, DEFAULT_RANK } from "./index";
import * as admin from "firebase-admin";

import { Collections } from "../../common/collections";

export const onCreateUser = functionsWithRegion.auth
  .user()
  .onCreate(async (user) => {
    try {
      const ref = admin.firestore().collection(Collections.USERS).doc(user.uid);

      const name = user.displayName || DEFAULT_NAME;
      const avatarUrl = generateAvatarUrl(name);
      const description = DEFAULT_MOTTO;
      const created = admin.firestore.FieldValue.serverTimestamp();
      const rank = DEFAULT_RANK;

      const result = await ref.set({
        name,
        description,
        avatarUrl,
        rank,
        created,
      });

      return result;
    } catch (error) {
      console.log("error", error);
    }
    return true;
  });

function generateAvatarUrl(seed: string) {
  return `https://avatars.dicebear.com/v2/gridy/${seed}.svg?options[colorful]=1`;
}
