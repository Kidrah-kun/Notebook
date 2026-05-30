import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  createdAt: { type: Number, default: Date.now }
});

const journalEntrySchema = new mongoose.Schema({
  folderId: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, default: "" },
  mood: { type: String },
  tags: { type: [String], default: [] },
  paper: { type: String },
  font: { type: String },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now }
});

const settingsSchema = new mongoose.Schema({
  theme: { type: String, default: "cream" },
  font: { type: String, default: "Caveat" },
  paper: { type: String, default: "ruled" }
});

// Create a unified id field getter
folderSchema.virtual('id').get(function() { return this._id.toHexString(); });
folderSchema.set('toJSON', { virtuals: true });
folderSchema.set('toObject', { virtuals: true });

journalEntrySchema.virtual('id').get(function() { return this._id.toHexString(); });
journalEntrySchema.set('toJSON', { virtuals: true });
journalEntrySchema.set('toObject', { virtuals: true });

settingsSchema.virtual('id').get(function() { return this._id.toHexString(); });
settingsSchema.set('toJSON', { virtuals: true });
settingsSchema.set('toObject', { virtuals: true });

export const FolderModel = mongoose.models.Folder || mongoose.model("Folder", folderSchema);
export const JournalEntryModel = mongoose.models.JournalEntry || mongoose.model("JournalEntry", journalEntrySchema);
export const SettingsModel = mongoose.models.Settings || mongoose.model("Settings", settingsSchema);
