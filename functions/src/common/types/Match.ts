import * as admin from "firebase-admin";

export enum MatchStatus {
  WAITING = "WAITING",
  READY_TO_START = "READY_TO_START",
  STARTED = "STARTED",
  FINISHED = "FINISHED",
}

export enum MatchPlayerStatus {
  JOINED = "JOINED",
  READY = "READY",
}

export type MatchPlayer = {
  userId: string;
  score: number;
  color: string;
  status: MatchPlayerStatus;
};

export type Match = {
  playerIds: string[];
  players: MatchPlayer[];
  id?: string;
  owner: string;
  status: MatchStatus;
  createdAt: admin.firestore.FieldValue;
  noPlayers: number;
};
