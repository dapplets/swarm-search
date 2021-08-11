import express from "express";
import routes from "./routes";
import cors from "cors";
import path from "path";

var app = express();

app.use(cors());
app.use(express.json());

app.use('/', routes);
app.use('/', express.static(path.join(__dirname, '../src/public')));

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Not found"
    });
})

export { app }