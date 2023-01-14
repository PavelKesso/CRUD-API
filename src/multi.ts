import cluster from 'cluster'
import { cpus } from 'os'
import * as dotenv from 'dotenv'
import { UserServer } from "./server"
import { parsePort } from "./env/parser"
import * as http from 'http'


dotenv.config()

const numCPUs = cpus().length
const port = parsePort(process.env.PORT, 5000)


//todo: add server selection
//todo: pass storage as paremeter to servers
if (cluster.isPrimary) {
    const currentServer = 0

    const server = http.createServer(
        (req: http.IncomingMessage, res: http.ServerResponse) => {
            const balancer = http.request(
                `http://localhost:${5001}${String(req.url)}`,
                {
                    'method': req.method!!,
                    'headers': req.headers
                },
                (resp) => {
                    res.statusCode = resp.statusCode as number
                    resp.pipe(res)
                }
            )

            req.pipe(balancer)
        }
    )

    server.listen(port, () => {
        console.log('load balances started on port: ' + port);

    })

    for (let i = 1; i < numCPUs; i++) {
        cluster.fork({ PORT: port + i })
    }
} else {
    const server = new UserServer(Number.parseInt(process.env.PORT!!))
    server.run()

    process.on('exit', () => {
        server.stop()
    })
}
