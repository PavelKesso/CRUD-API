import { Transform, TransformCallback } from "stream";
import * as http from 'http'
import { Connection } from "../storage";
import { validateUserPut } from "../validator/validator";

export class PutTransform extends Transform {

    uid: string
    res: http.ServerResponse
    connection: Connection

    constructor(uid: string, res: http.ServerResponse, connection: Connection) {
        super()
        this.uid = uid
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
            const isValidated = validateUserPut(request)

            if (isValidated) {
                const user = this.connection.update(
                    this.uid,
                    request.name,
                    request.age,
                    request.hobbies
                )

                this.res.statusCode = 200
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