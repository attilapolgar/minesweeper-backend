import * as admin from "firebase-admin";

export { onCreateUser } from "./modules/user/onCreate";
export { updateUser } from "./modules/user/update";

export { createMatch } from "./modules/match/create";
export { joinMatch } from "./modules/match/join";
export { readyForMatch } from "./modules/match/ready";
export { generateBoard } from "./modules/match/generateBoard";
export { triggerField } from "./modules/match/triggerField";

admin.initializeApp();
