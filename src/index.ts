import { UserServer } from "./server"
import * as dotenv from 'dotenv'
import { parsePort } from "./env/parser";

dotenv.config()

const port = parsePort(process.env.PORT, 5000)

const server = new UserServer(port)
server.run()