import { Router } from "express";
import {
  checkAvailability,
  welcome,
} from "../controllers/check-availability.controller";
import { login, profile } from "../controllers/auth.controller";
import { destroy, importFromCsv } from "../controllers/pincodes.controller";
import { authenticated } from "../middlewares/auth.middleware";
import { upload } from "../helpers/multer";

const router = Router();

router.get("/", welcome);

router.post("/check-availability", checkAvailability);

/** Admin Functionality */
router.post("/admin/login", login);
router.get("/admin/profile", authenticated, profile);

router.post(
  "/admin/pincodes/import",
  authenticated,
  upload().single("csv"),
  importFromCsv
);
router.delete("/admin/pincodes/:ids", authenticated, destroy);

/** Get Paginated Pincodes for AG-Grid */
// router.post("/admin/pincodes/get", authenticated, get);

/** Webhooks **/
router.post("/webhooks/register", authenticated);
router.post("/webhooks/orders/create");

export { router };
