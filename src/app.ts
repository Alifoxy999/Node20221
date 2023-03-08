import {NextFunction} from "express";

import express  from "express";

import mongoose from "mongoose";

import {IError} from "./types/common.types";
import { userRouter } from "./routers/user.router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouter);

// --- ERROR HANDLER ---
app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;

    return res.status(status).json({
        message: err.message,
        status,
    });
});

const PORT = 5100;

app.listen(PORT, () => {
    mongoose.connect("mongodb://127.0.0.1:27017/sept-2022").then();
    console.log(`Server has started on PORT ${PORT} 🚀`);
});