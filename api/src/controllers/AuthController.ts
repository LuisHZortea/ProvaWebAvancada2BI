import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { CheckUserPassword } from "../utils/HashPasswords";
import { generateJWToken } from "../utils/JWT";

const prisma = new PrismaClient();

class AuthController {
  constructor() {}

  async signin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.json({
          status: 400,
          message: "Email ou password não encontrados!",
        });
      }

      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (!user) {
        return res.json({
          status: 401,
          message: "Email não existe!",
        });
      }

      const passwordCheck = await CheckUserPassword(password, user.password);

      if (!passwordCheck) {
        return res.json({
          status: 401,
          message: "Usuário ou senha inválidos!",
        });
      }

      const token = await generateJWToken(user);
      return res.json({
        status: 200,
        user: {
          token: token,
        },
      })
    } catch (error) {
      console.log(error);
      res.json({
        status: 500,
        message: error,
      });
    }
  }

  async signUp(req: Request, res: Response){
    try{
    const newUser = req.body
    if(newUser.password !== newUser.passwordCheck){
        return res.json({
            status: 400,
            message: "As senhas devem ser iguais"
        })
    }

    }catch(error){
        console.log(error);
        return res.status(500).json({
            error: error
        })
    }
}

  async signout() {}
}

export default new AuthController();
