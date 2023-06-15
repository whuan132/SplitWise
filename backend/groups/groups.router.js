import { Router } from "express";
import multer from "multer";
import {
  get_groups,
  add_group,
  get_group,
  accept_group,
  reject_group,
  delete_group,
  add_transaction,
  delete_transaction,
  get_receipt,
  add_member,
  delete_member,
} from "../groups/groups.controller.js";
import { checkToken } from "../users/users.middleware.js";
const router = Router();

router.get("/", get_groups);
router.post("/", add_group);

router.get("/:group_id", get_group);
router.put("/:group_id", accept_group);
router.delete("/:group_id", delete_group);
router.delete("/:group_id/members", reject_group);

router.put(
  "/:group_id/transactions",
  multer({ dest: "uploads/" }).single("receipt"),
  checkToken,
  add_transaction
);
router.delete("/:group_id/transactions/:transaction_id", delete_transaction);
router.get("/:group_id/transactions/:transaction_id/receipt", get_receipt);

router.put("/:group_id/members", add_member);
router.delete("/:group_id/members/:email", delete_member);

export default router;
