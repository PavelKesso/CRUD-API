import { Connection, Storage } from "./storage";
import * as http from 'http'
import { PostTransform } from "./transformers/post";

export class UserServer {
    connection: Connection
    port: number

    constructor(port: number) {
        const storage = new Storage()
        this.connection = storage.newConnection()
        this.port = port
    }

    run() {
        const server = http.createServer(this.userServer)
        server.listen(this.port)
    }

    userServer = (req: http.IncomingMessage, res: http.ServerResponse) => {
        if (req.url?.startsWith('/api/users')) {
            switch (req.method) {
                case 'GET': {
                    executeGet(req, res, this.connection)
                }
                case 'POST': {
                    executePost(req, res, this.connection)
                }
                case 'PUT': {
                    executePut(req, res)
                }
                case 'DELETE': {
                    executeDelete(req, res)
                }
                default: {

                }
            }
        }
    }
}

const executeGet = (
    req: http.IncomingMessage,
    res: http.ServerResponse,
    connection: Connection
) => {
    const users = connection.getAll()
    const answer = JSON.stringify(users)
    res.statusCode = 200
    res.end(answer)
}

function executePost(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    connection: Connection
) {
    const postTransform = new PostTransform(res, connection)
    req.pipe(postTransform)
}

function executePut(req: http.IncomingMessage, res: http.ServerResponse) {

}

function executeDelete(req: http.IncomingMessage, res: http.ServerResponse) {

}
