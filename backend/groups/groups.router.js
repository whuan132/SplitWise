import { Router } from "express";
import {
  get_groups,
  add_group,
  get_group,
  delete_group,
  add_transaction,
  delete_transaction,
  add_member,
  delete_member,
} from "../groups/groups.controller.js";
const router = Router();

router.get("/", get_groups);
router.post("/", add_group);

router.get("/:group_id", get_group);
router.delete("/:group_id", delete_group);

router.put("/:group_id/transactions", add_transaction);
router.delete("/:group_id/transactions/:transaction_id", delete_transaction);

router.put("/:group_id/members", add_member);
router.delete("/:group_id/members/:email", delete_member);

export default router;
