<div align="center">
  
  # 2ª Prova - Programação Avançada para WEB 
  #### Aluno: Luis Henrique Gomes Zortea | Curso: Ciência da Computação | Turma: CC5M | Professor(a): Otávio Lube Santos
</div> 

## Iniciando a API
 - Primeiramente nós construímos uma API que possibilita a criação de usuários, login e autenticação, e também a possibilidade de fazer postagens e comentários.
 - Segue a lista de comandos utilizados no projeto:
~~~~
- npm init -y -> Inicia o projeto Node.js.
- npm i typescript -> Instala o TypeScript no seu projeto.
- npx tsc --init -> Cria o arquivo de configuração tsconfig.json
- npm i ts-node -> Instala o ts-node, uma ferramenta que facilita a execução de código TypeScript.
- npx tsc -> Compila o código TypeScript para JavaScript.
~~~~
- O código do tsconfig.json:

```
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./build",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```
- Scripts que estão sendo utilizados no package.json:
~~~~
- "build": "npx tsc"
- "dev": "npx ts-node ./src/server.ts"
~~~~

 - Para configurar um servidor WEB, utilizamos os seguintes comandos:
~~~~
- npm install express -> Instala o Express como dependência regular para criar e gerenciar servidores web.
- npm i --save-dev @types/express -> Instala as definições de tipos para o Express, necessárias para integrar o Express com o TypeScript.
~~~~
- Também instalamos o ts-node-dev nos ajuda a ter mais produtividade uma vez que ele reinicializar o servidor automaticamente a medida que salvamos o projeto.
```
- npm i ts-node-dev --save-dev
```
Depois de instalado, basta atualizar o script de execução do projeto para:

```
"dev": "npx ts-node-dev ./src/server.ts"
```
- E utilizamos o Prisma também, com a seguinte configuração:
```
generator client {
  provider = "prisma-client-js"
}

model User {
  id       Int       @id @default(autoincrement())
  email    String    @unique
  name     String?
  posts    Post[]
  comments Comment[]
}

model Post {
  id        Int       @id @default(autoincrement())
  title     String
  content   String?
  published Boolean   @default(false)
  author    User      @relation(fields: [authorId], references: [id])
  authorId  Int
  comments  Comment[]
}

model Comment {
  id        Int     @id @default(autoincrement())
  title     String
  content   String
  published Boolean @default(false)
  author    User    @relation(fields: [authorId], references: [id])
  authorId  Int
  post      Post    @relation(fields: [postId], references: [id])
  postId    Int
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

```
