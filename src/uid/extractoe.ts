const userByIdPatter = /^\/api\/users\/(\S*)/
export const extractUid = (url: string | undefined) =>
    userByIdPatter.exec(url ?? '')?.[1] ?? ''