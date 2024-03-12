import mongoose from "mongoose";
import app from "./app.js";

(async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://alayuestifanos:almazalmaz@cluster0.fn2pugc.mongodb.net/eccom"
    );
    console.log("DB CONNECTED!");

    app.on("error", (err) => {
      console.error("ERROR", err);
      throw err;
    });

    const onListening = () => {
      console.log("Listening on port 5000");
    };

    app.listen(5000, onListening);
  } catch (error) {
    console.error("Error: " + error);
    throw error;
  }
})();
