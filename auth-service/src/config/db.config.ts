import mongoose from 'mongoose'
export const dbConnect = async (): Promise<void> => {
  try {
    const MONGODB_URL = process.env.MONGODB_URL
    if (!MONGODB_URL) {
      console.log("Mongodb url not found");
      process.exit(1)
    }
    mongoose.connect(MONGODB_URL)
    console.log("Auth service Database connected successfully");

  } catch (error) {
    if (error instanceof Error) {
      console.log("Auth service Database connection failed", error.message);
      process.exit(1)
    }
    else {
      console.log("Auth service Database connection failed with unkown Error");
      process.exit(1)
    }
  }
}