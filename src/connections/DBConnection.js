import mongoose from "mongoose";
  import dotenv from "dotenv";

  dotenv.config();
  
  // const port = process.env.DB_PORT;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const domain = process.env.DB_DOMAINNAME;
  const name = process.env.DB_NAME;

const dbUrl = `mongodb+srv://${user}:${password}@${domain}/${name}`;

mongoose.connect(dbUrl)
  .then(() => {
    console.log("MongoDB connected successfully...");
  })
  .catch(err => {
    console.log("Error connecting MongoDB", err);
  });
