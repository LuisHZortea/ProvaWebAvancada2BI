<div align="center">
  
  # 2ª Prova - Programação Avançada para WEB 
  #### Aluno: Luis Henrique Gomes Zortea | Curso: Ciência da Computação | Turma: CC5M | Professor(a): Otávio Lube Santos
</div> 

## Iniciando o projeto da API
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
- Os arquivos:
~~~~
server.ts: Ele usa o express.json() para permitir o processamento de dados JSON no corpo das requisições. Além disso,
ele organiza a aplicação usando rotas para usuários, posts, comentários e autenticação. As rotas importadas do UserRouter, PostRouter, CommentRouter e AuthRouter são integradas ao servidor.
~~~~
- Routes:
~~~~
AuthRoutes.ts: Define as rotas de autenticação para login (/signin), cadastro (/signup), e logout (/signout). A função de login (signin) é delegada ao AuthController.

UserRoutes.ts, PostRoutes.ts, CommentRoutes.ts:
Essas rotas são responsáveis por interagir com os recursos de usuários, posts e comentários, respectivamente. Elas mapeiam os endpoints de CRUD (Create, Read, Update, Delete) para cada um desses recursos.
As requisições a essas rotas são processadas pelos controllers correspondentes (como UserController, PostController, CommentController).
~~~~
~~~~
JWT.ts:
Lida com a geração e verificação de tokens JWT (JSON Web Tokens).
Ele tem uma função generateJWToken, que gera um token para o usuário após um login bem-sucedido. Esse token pode ser usado para autenticar o usuário nas próximas requisições.
A chave privada para assinar o token está definida como "ion29348y283fjp92u3nc08273h9hufhsniovu3fi", e o algoritmo de assinatura é o HS256.

HashPasswords.ts:
Este módulo lida com a hash de senhas usando bcrypt. Ele tem funções para criar hashes de senhas (CreateHashPassword) e verificar se uma senha corresponde ao hash armazenado (CheckUserPassword).
Essas funções são usadas principalmente no processo de autenticação (no login e no cadastro de usuários).

UserMiddleware.ts:
Define um middleware que verifica se a requisição possui um token de autorização no cabeçalho.
Isso pode ser usado para proteger rotas, garantindo que apenas usuários autenticados possam acessar certos recursos.
A função analyseToken verifica a presença do token no cabeçalho de autorização da requisição.
~~~~
- Controllers: 
~~~~
AuthController.ts:
Gerencia a autenticação de usuários. O controlador possui a função signin, que recebe as credenciais do usuário (email e senha),
verifica se o email e a senha estão corretos, e, em caso de sucesso, gera um token JWT. O signUp é onde os usuários se registrariam no sistema. O signout é responsável por invalidar o token
ou limpar a sessão do usuário.

UserController.ts:
Controla o gerenciamento de usuários. Ele tem funções para listar (listUser), criar (createUser),
atualizar (updateUser) e deletar (deleteUser) usuários no banco de dados. A senha do usuário é sempre hashada antes de ser armazenada no banco de dados, garantindo que as senhas sejam seguras.

PostController.ts:
Gerencia os posts. Tem funções para listar (listPosts), criar (createPost), editar (editPost)
e excluir (deletePost) posts. Para criar ou editar um post, o título e o conteúdo são verificados antes de serem armazenados ou atualizados no banco de dados.

CommentController.ts:
Gerencia os comentários. Ele tem funções para listar (listComments), criar (postComment),
editar (editComment) e excluir (deleteComment) comentários. Antes de criar ou editar um comentário, o conteúdo é validado. Caso falte conteúdo, a requisição é rejeitada com um erro.
~~~~

## Em resumo:
- Autenticação de Usuário:
Quando o usuário tenta fazer login com as credenciais corretas (email e senha), o sistema verifica as credenciais, gera um token JWT e retorna esse token para o usuário.
O token gerado será usado em requisições subsequentes para autenticar o usuário (autorizando-o a acessar recursos protegidos).

- Criação e Gestão de Usuários:
Usuários podem ser criados, listados, atualizados e deletados. Quando um usuário é criado, sua senha é hashada antes de ser armazenada no banco de dados.

- Gerenciamento de Posts e Comentários:
Os usuários podem criar, listar, editar e excluir posts e comentários. Cada post precisa de um título e conteúdo, enquanto cada comentário precisa de conteúdo. Os posts e comentários são manipulados através de funções de CRUD implementadas nos controllers.

- Middleware de Autenticação:
Para proteger certas rotas, como as que lidam com posts e comentários, pode-se usar o middleware de autenticação (UserMiddleware) para verificar se o usuário está autenticado por meio de um token JWT.
