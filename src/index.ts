import { UserServer } from "./server";

const server = new UserServer(5000)
server.run()