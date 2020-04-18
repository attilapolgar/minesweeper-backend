import { functionsWithRegion } from "./../../common/firebase";
import * as admin from "firebase-admin";
import { Collections } from "../../common/collections";
import { Board } from "../../common/types/Board";
import { Match } from "../../common/types/Match";
import { generateBoardForMatch, generatePublicBoardView } from "./match.utils";

export const generateBoard = functionsWithRegion.firestore
  .document(`${Collections.MATCHES}/{matchId}`)

  .onCreate(async (snapshot, context) => {
    const match = snapshot.data() as Match;
    const board: Board = generateBoardForMatch(match);
    const publicBoardView = generatePublicBoardView(board);

    await admin
      .firestore()
      .collection(Collections.BOARDS)
      .doc(context.params.matchId)
      .set(board);

    await admin
      .firestore()
      .collection(Collections.MATCHES)
      .doc(context.params.matchId)
      .update({
        view: publicBoardView,
      });

    return true;
  });
