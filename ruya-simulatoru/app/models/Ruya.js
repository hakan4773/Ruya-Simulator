import mongoose from 'mongoose';

const RuyaSchema = new mongoose.Schema({
  story: { type: String, required: true },
  mekan: { type: String, required: true },
  eylem: { type: String, required: true },
  karakter: { type: String, required: true },
  ton: { type: String, required: true },
  image_url: { type: String, required: false },
  sound_url: { type: String, required: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.models.Ruya || mongoose.model('Ruya', RuyaSchema);