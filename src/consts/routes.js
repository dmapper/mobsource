export const prefix = process.env.NODE_ENV === 'production' ? 'http://mobsource.live' : 'http://localhost:3000'
export const API_SIGNIN = `${prefix}/signin`
export const API_SIGNUP = `${prefix}/signup`
