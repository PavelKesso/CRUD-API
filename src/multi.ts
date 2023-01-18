import cluster, { Worker } from 'cluster'
import { cpus } from 'os'
import * as dotenv from 'dotenv'
import { UserServer } from "./server"
import { parsePort } from "./env/parser"
import * as http from 'http'
import { Connection, Storage } from './storage'
import { User } from './user'
import { watch,  } from 'fs'
import { Http2ServerResponse } from 'http2'
import { stdout } from 'process'
import { pipeline, Readable } from 'stream'
import { ReadableStream } from 'stream/web'

dotenv.config()

const numCPUs = cpus().length + 1
const port = parsePort(process.env.PORT, 5000)

//todo: pass storage as paremeter to servers
if (cluster.isPrimary) {
    let currentServer = 1

    const server = http.createServer(
        (req: http.IncomingMessage, res: http.ServerResponse) => {
            const balancer = http.request(
                `http://localhost:${port + currentServer}${String(req.url)}`,
                {
                    'method': req.method!!,
                    'headers': req.headers
                },
                (resp) => {
                    res.statusCode = resp.statusCode as number
                    resp.pipe(res)
                }
            )

            res.setHeader
            res.writeHead
            res.write

            pipeline()

            new Readable.from()

            currentServer = (currentServer == (numCPUs - 1))
                ? 1
                : currentServer + 1

            req.pipe(balancer)
        }
    )

    server.listen(port, () => {
        console.log('load balances started on port: ' + port);

    })

    const workers = new Array<Worker>()

    for (let i = 1; i < numCPUs; i++) {
        const worker = cluster.fork({ PORT: port + i })
        workers.push(worker)
    }

    cluster.on('message', (worker, msg: { users: Map<String, User> }) => {
        workers.forEach((worker) => {
            worker?.send(msg)
        })
    })
} else {
    const storage = new Storage()
    
    const server = new UserServer(
        Number.parseInt(process.env.PORT!!),
        storage.newConnection()
    )
    server.run()

    process.on('message', (msg: { users: Map<String, User> }) => {
        storage.updateUsers(msg.users)
    })

    process.on('exit', () => {
        server.stop()
    })
}
