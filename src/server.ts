import { Connection, Storage } from "./storage"
import * as http from 'http'
import { PostTransform } from "./transformers/post"
import { InvalidUUID } from "./error/InvalidUUID"
import { UserNotExist } from "./error/UserNotExist"

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
    const userByIdPatter = /^\/api\/users\/(\S*)/

    const userId = userByIdPatter.exec(req.url ?? '')?.[1]

    let code
    let message

    if (userId) {
        try {
            const user = connection.getByUid(userId)
            message = JSON.stringify(user)
            code = 200
        } catch (e: any) {
            message = e.message ?? "Internal server error"
            code = e.code ?? 404
        }
    } else {
        const users = connection.getAll()
        message = JSON.stringify(users)
        code = 200
    }

    res.statusCode = code
    res.end(message)
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
