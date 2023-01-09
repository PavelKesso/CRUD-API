export function parsePort(port: string | undefined, defaultPort: number): number {
    if (port === undefined) {
        return returnDefaultPort(defaultPort)
    } else {
        try {
            const intPort = parseInt(port)
            if (isNaN(intPort)) {
                return returnDefaultPort(defaultPort)
            } else {
                return intPort
            }
        } catch (error: any) {
            return returnDefaultPort(defaultPort)
        }
    }
}

function returnDefaultPort(defaultPort: number) {
    console.log('.env do not contains correct PORT value. Server will start with default post: ' + defaultPort);
    return defaultPort;
}