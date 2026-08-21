import { toNodeHandler } from "better-auth/node";
import { auth } from "../../../backend/src/auth.js";

export default toNodeHandler(auth);