import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const url = process.env.MONGO_URI || 'mongodb://mongodb:27017/tuhistoria';
        await mongoose.connect(url);
        console.log('Base de datos conectada');
    } catch (error) {
        console.error('Error en la conexion:', error);
        process.exit(1);
    }
};