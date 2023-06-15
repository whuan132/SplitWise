import groupsModel from "./groups.model.js";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

export const get_groups = async (req, res, next) => {
  try {
    const token = req.body["tokenData"];
    const results = await groupsModel.find({
      "members.email": token.email,
    });
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

export const add_group = async (req, res, next) => {
  try {
    const title = req.body["title"];
    const token = req.body["tokenData"];
    const results = await groupsModel.create({
      title: title,
      members: [
        {
          user_id: token._id,
          fullname: token.fullname,
          email: token.email,
          pending: false,
        },
      ],
    });
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

export const get_group = async (req, res, next) => {
  try {
    const token = req.body["tokenData"];
    const results = await groupsModel.findOne({
      "members.user_id": token._id,
      _id: req.params.group_id,
    });
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

// accept the invitation
export const accept_group = async (req, res, next) => {
  try {
    const token = req.body["tokenData"];
    const results = await groupsModel.updateOne(
      {
        _id: req.params.group_id,
        "members.email": token.email,
        "members.pending": true,
      },
      {
        $set: {
          "members.$": {
            user_id: token._id,
            fullname: token.fullname,
            email: token.email,
            pending: false,
          },
        },
      }
    );
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

// reject the invitation
export const reject_group = async (req, res, next) => {
  try {
    const token = req.body["tokenData"];
    const results = await groupsModel.updateOne(
      {
        _id: req.params.group_id,
        "members.email": token.email,
        "members.pending": true,
      },
      {
        $pull: {
          members: {
            email: token.email,
          },
        },
      }
    );
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

export const delete_group = async (req, res, next) => {
  try {
    const token = req.body["tokenData"];
    const results = await groupsModel.deleteOne({
      _id: req.params.group_id,
      "members.user_id": token._id,
      "members.pending": false,
    });
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

export const add_transaction = async (req, res, next) => {
  try {
    const token = req.body["tokenData"];
    const { originalname, filename } = req.file;
    const { title, description, category, amount, date } = req.body;
    const trans = {
      title,
      description,
      category,
      amount: parseFloat(amount),
      date: new Date(date).getTime(),
      paid_by: { user_id: token._id, fullname: token.fullname },
      receipt: {
        filename,
        originalname,
      },
      _id: new mongoose.Types.ObjectId(),
    };
    const results = await groupsModel.updateOne(
      {
        "members.user_id": token._id,
        _id: req.params.group_id,
      },
      {
        $push: {
          transactions: trans,
        },
      }
    );
    res.json({ success: true, data: trans });
  } catch (error) {
    next(error);
  }
};

export const delete_transaction = async (req, res, next) => {
  try {
    const token = req.body["tokenData"];
    const results = await groupsModel.updateOne(
      {
        "members.user_id": token._id,
        _id: req.params.group_id,
      },
      {
        $pull: {
          transactions: {
            _id: req.params.transaction_id,
          },
        },
      }
    );
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

export const get_receipt = async (req, res, next) => {
  try {
    const token = req.body["tokenData"];
    const { group_id, transaction_id } = req.params;
    const results = await groupsModel.findOne({
      _id: group_id,
      "members.user_id": token._id,
      "members.pending": false,
      "transactions._id": transaction_id,
    });
    if (results && results.transactions) {
      const receipt = results.transactions.find(
        (t) => t._id.toString() === transaction_id
      );
      if (receipt && receipt.receipt) {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const file_path = path.join(
          __dirname,
          "..",
          "uploads",
          receipt.receipt.filename
        );
        res.download(file_path, receipt.receipt.originalname);
        return;
      }
      throw new Error("Receipt not found");
    }
  } catch (error) {
    next(error);
  }
};

// invitations
export const add_member = async (req, res, next) => {
  try {
    const token = req.body["tokenData"];

    const exist = await groupsModel.findOne({
      _id: req.params.group_id,
      "members.email": req.body["email"],
    });
    if (exist) throw new Error("Memeber is exist");

    const results = await groupsModel.updateOne(
      {
        _id: req.params.group_id,
        "members.user_id": token._id,
        "members.pending": false,
      },
      {
        $push: {
          members: {
            email: req.body["email"],
            pending: true,
          },
        },
      }
    );
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

export const delete_member = async (req, res, next) => {
  try {
    const token = req.body["tokenData"];
    const results = await groupsModel.updateOne(
      {
        _id: req.params.group_id,
        "members.user_id": token._id,
        "members.pending": false,
      },
      {
        $pull: {
          members: {
            email: req.params.email,
          },
        },
      }
    );
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};
