import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
app.use(cors());
app.use(express.json());

const MONGODB_URI = "mongodb://localhost:27017/notebook";

mongoose.connect(MONGODB_URI).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("MongoDB connection error:", err);
});

const folderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  icon: { type: String },
  coverStyle: { type: String, default: "solid" },
  password: { type: String },
  createdAt: { type: Number, default: Date.now }
});
folderSchema.virtual('id').get(function() { return this._id.toHexString(); });
folderSchema.set('toJSON', { virtuals: true });

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
journalEntrySchema.virtual('id').get(function() { return this._id.toHexString(); });
journalEntrySchema.set('toJSON', { virtuals: true });

const settingsSchema = new mongoose.Schema({
  theme: { type: String, default: "cream" },
  font: { type: String, default: "Caveat" },
  serifFont: { type: String, default: "Lora" },
  paper: { type: String, default: "ruled" }
});
settingsSchema.virtual('id').get(function() { return this._id.toHexString(); });
settingsSchema.set('toJSON', { virtuals: true });

const FolderModel = mongoose.models.Folder || mongoose.model("Folder", folderSchema);
const JournalEntryModel = mongoose.models.JournalEntry || mongoose.model("JournalEntry", journalEntrySchema);
const SettingsModel = mongoose.models.Settings || mongoose.model("Settings", settingsSchema);

// API Routes
app.get('/api/folders', async (req, res) => {
  const folders = await FolderModel.find().lean();
  res.json(folders.map(f => {
    const { password, ...rest } = f;
    return { ...rest, id: f._id.toString(), hasPassword: !!password };
  }));
});

app.get('/api/folders/:id', async (req, res) => {
  const f = await FolderModel.findById(req.params.id).lean();
  if (!f) return res.status(404).json({ error: "Not found" });
  
  if (f.password && req.headers['x-folder-password'] !== f.password) {
    return res.status(401).json({ error: "Unauthorized", isLocked: true });
  }
  
  const { password, ...rest } = f;
  res.json({ ...rest, id: f._id.toString(), hasPassword: !!f.password });
});

app.post('/api/folders', async (req, res) => {
  const { name, color, coverStyle, icon, password } = req.body;
  const f = await FolderModel.create({ name: name?.trim() || "Untitled", color, coverStyle: coverStyle || "solid", icon, password: password || undefined });
  const { password: _p, ...rest } = f.toObject();
  res.json({ ...rest, id: f._id.toString(), hasPassword: !!f.password });
});

app.patch('/api/folders/:id', async (req, res) => {
  await FolderModel.findByIdAndUpdate(req.params.id, req.body);
  res.json({ success: true });
});

app.delete('/api/folders/:id', async (req, res) => {
  await FolderModel.findByIdAndDelete(req.params.id);
  await JournalEntryModel.deleteMany({ folderId: req.params.id });
  res.json({ success: true });
});

app.get('/api/entries', async (req, res) => {
  const { folderId } = req.query;
  
  if (folderId) {
    const f = await FolderModel.findById(folderId).lean();
    if (f && f.password && req.headers['x-folder-password'] !== f.password) {
      return res.status(401).json({ error: "Unauthorized", isLocked: true });
    }
  }

  const query = folderId ? { folderId } : {};
  const entries = await JournalEntryModel.find(query).sort({ createdAt: -1 }).lean();
  res.json(entries.map(e => ({ ...e, id: e._id.toString() })));
});

app.get('/api/entries/:id', async (req, res) => {
  const e = await JournalEntryModel.findById(req.params.id).lean();
  if (!e) return res.status(404).json({ error: "Not found" });
  
  const f = await FolderModel.findById(e.folderId).lean();
  if (f && f.password && req.headers['x-folder-password'] !== f.password) {
    return res.status(401).json({ error: "Unauthorized", isLocked: true, folderId: e.folderId });
  }

  res.json({ ...e, id: e._id.toString() });
});

app.post('/api/entries', async (req, res) => {
  const { folderId } = req.body;
  const now = Date.now();
  const e = await JournalEntryModel.create({
    folderId,
    title: "Untitled",
    content: "",
    tags: [],
    createdAt: now,
    updatedAt: now
  });
  res.json({ ...e.toObject(), id: e._id.toString() });
});

app.patch('/api/entries/:id', async (req, res) => {
  await JournalEntryModel.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: Date.now() });
  res.json({ success: true });
});

app.delete('/api/entries/:id', async (req, res) => {
  await JournalEntryModel.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

const DEFAULT_SETTINGS = { theme: "cream", font: "Caveat", serifFont: "Lora", paper: "ruled" };

app.get('/api/settings', async (req, res) => {
  const settings = await SettingsModel.findOne().lean();
  if (!settings) return res.json(DEFAULT_SETTINGS);
  res.json({
    theme: settings.theme || DEFAULT_SETTINGS.theme,
    font: settings.font || DEFAULT_SETTINGS.font,
    serifFont: settings.serifFont || DEFAULT_SETTINGS.serifFont,
    paper: settings.paper || DEFAULT_SETTINGS.paper,
  });
});

app.post('/api/settings', async (req, res) => {
  const settings = await SettingsModel.findOne();
  if (!settings) {
    await SettingsModel.create(req.body);
  } else {
    await SettingsModel.findByIdAndUpdate(settings._id, req.body);
  }
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log('API Server running on port 3000');
});
