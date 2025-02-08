const express = require("express");
const dotenv = require("dotenv");
const connect = require("./db/connect");
const AuthRouter = require("./routes/auth.routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
//------------------------------------------------------
dotenv.config();
const app = express();
PORT = process.env.PORT || 5000;

//------------------------------------------------------

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/auth", AuthRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}
//------------------------------------------------------

app.listen(PORT, () => {
  connect();
  console.log(`Server running on port  ${PORT}`);
});
