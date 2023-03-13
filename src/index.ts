import express from "express"
import cors from "cors"
import { config } from "dotenv"
import { logger } from "./logger"
import { userRouter } from "./user"
import { projectRouter } from "./projects"
import { iamRouter } from "./iamUsers"
import { eventsRouter } from "./events"
import { authRouter } from "./auth"
config()

const PORT = process.env.PORT ?? 5000

const app = express()

app.use(cors())
app.use(express.json())

app.use("/v1/user", userRouter)
app.use("/v1/project", projectRouter)
app.use("/v1/iam", iamRouter)
app.use("/v1/events", eventsRouter)
app.use("/v1/auth", authRouter)

app.listen(PORT, () => {
    logger.info(`Running on port ${PORT}`)
})