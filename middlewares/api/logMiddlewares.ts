
export function loggMiddleware(request: Request) {
    return { response: request.method + " " + request.url }
}