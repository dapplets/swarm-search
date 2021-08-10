import express, { NextFunction, Request, Response } from "express";
import routes from "./routes";
import cors from "cors";

var app = express();

app.use(cors());
app.use(express.json());

app.use('/', routes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Not found"
    });
})

export { app }