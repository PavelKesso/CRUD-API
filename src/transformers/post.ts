import { Transform, TransformCallback } from "stream";
import * as http from 'http'
import { Connection } from "../storage";
import { validateUser } from "../validator/validator";

export class PostTransform extends Transform {

    res: http.ServerResponse
    connection: Connection

    constructor(res: http.ServerResponse, connection: Connection) {
        super()
        this.res = res
        this.connection = connection
    }

    _transform(
        chunk: any,
        encoding: BufferEncoding,
        callback: TransformCallback
    ): void {
        try {
            const request = JSON.parse(chunk)
            const isValidated = validateUser(request)

            if (isValidated) {
                const user = this.connection.add(
                    request.username,
                    request.age,
                    request.hobbies
                )

                this.res.statusCode = 201
                this.res.end(JSON.stringify(user))
            } else {
                this.res.statusCode = 400
                this.res.end("Request does not contain required fields. Or the fields are of the wrong type.")
            }
        } catch (error: any) {
            this.res.statusCode = error.code ?? 500
            this.res.end(
                error.code
                    ? error.message
                    : "Internal serer error.\n\treson: " + error.message
            )
        }
        callback(null, chunk)
    }
}