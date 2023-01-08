import * as http from 'http'

const server = http.createServer((req, res) => {
    console.log(req.url)
})

const port = 5000
server.listen(port, () => {
})