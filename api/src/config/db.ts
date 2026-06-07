import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
    try {
        const url: string = process.env.MONGO_URI || 'mongodb://mongodb:27017/tuhistoria';
        await mongoose.connect(url);
    } catch (error: any) {
        process.exit(1);
    }
};
