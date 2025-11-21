import { Schema, model } from 'mongoose';

const alertSchema = new Schema({
  made_by: String,
  title: String,
  type: String,
  description: String,
  position: { lat: Number, lng: Number }
});

export default model("Alert", alertSchema);