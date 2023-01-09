import { Connection, Storage } from "./storage"
import * as http from 'http'
import { PostTransform } from "./transformers/post"
import { PutTransform } from "./transformers/put"
import { extractUid } from "./uid/extractoe"

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
            try {
                switch (req.method) {
                    case 'GET': {
                        executeGet(req, res, this.connection)
                        break
                    }
                    case 'POST': {
                        executePost(req, res, this.connection)
                        break
                    }
                    case 'PUT': {
                        executePut(req, res, this.connection)
                        break
                    }
                    case 'DELETE': {
                        executeDelete(req, res, this.connection)
                        break
                    }
                    default: {
                        res.statusCode = 404
                        res.end("Method: " + req.method + " are not supported on api/users endpont")
                    }
                }
            } catch (e: any) {
                res.statusCode = e.code ?? 404
                res.end(e.message ?? "Internal server error")
            }
        } else {
            res.statusCode = 404
            res.end("Endpoint: " + req.url + " are not supported")
        }
    }
}

const executeGet = (
    req: http.IncomingMessage,
    res: http.ServerResponse,
    connection: Connection
) => {
    const userId = extractUid(req.url)
    let message

    if (userId) {
        const user = connection.getByUid(userId)
        message = JSON.stringify(user)
    } else {
        const users = connection.getAll()
        message = JSON.stringify(users)
    }

    res.statusCode = 200
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

function executePut(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    connection: Connection
) {
    const userId = extractUid(req.url)

    const putTransform = new PutTransform(userId, res, connection)
    req.pipe(putTransform)
}

function executeDelete(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    connection: Connection
) {
    const userId = extractUid(req.url)
    connection.delete(userId)

    res.statusCode = 200
    res.end()
}