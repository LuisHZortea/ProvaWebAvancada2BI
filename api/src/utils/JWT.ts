import jwt from "jsonwebtoken";

interface User{
    email: string,
    password: string
}

const privateKey = "ion29348y283fjp92u3nc08273h9hufhsniovu3fi"

export async function generateJWToken(user: User){
    const token = jwt.sign(JSON.stringify(user), privateKey, {algorithm: "HS256"})
    return token;
}
