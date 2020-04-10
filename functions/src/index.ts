import * as admin from "firebase-admin";

export { onCreateUser } from "./modules/user/onCreate";
export { updateUser } from "./modules/user/update";

export { createMatch } from "./modules/match/create";
export { joinMatch } from "./modules/match/join";
export { readyForMatch } from "./modules/match/ready";

admin.initializeApp();
