

import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
const router = Router();

router.route("/register").post(
     // Multer is middleware it is injecting before the function that save the data into the database
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:coverImage,
            maxCount:1
        }
    ]),
    registerUser
    )

export default router;