import express from "express"
import cors from "cors"
import { config } from "dotenv"
import { logger } from "./logger"
import { userRouter } from "./user"
import { projectRouter } from "./projects"
import { iamRouter } from "./iamUsers"
config()

const PORT = process.env.PORT ?? 5000

const app = express()

app.use(cors())

app.use("/v1/user", userRouter)
app.use("/v1/project", projectRouter)
app.use("/v1/iam", iamRouter)

app.listen(PORT, () => {
    logger.info(`Running on port ${PORT}`)
})