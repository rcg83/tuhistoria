import mongoose from 'mongoose';

const historiaSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    contenido: String,
    fecha: { type: Date, default: Date.now }
});

export default mongoose.model('Historia', historiaSchema);
