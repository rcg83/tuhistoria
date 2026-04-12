import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
    try {
        const url: string = process.env.MONGO_URI || 'mongodb://mongodb:27017/tuhistoria';
        await mongoose.connect(url);
        console.log('Base de datos conectada (TS)');
    } catch (error: any) {
        console.error('Error en la conexion:', error);
        process.exit(1);
    }
};
