# Express Score AI — Laravel 11 Edition

Este repositório agora contém uma aplicação completa em **Laravel 11** com **Blade** pronta para ser utilizada pela sua equipe de desenvolvimento. O objetivo desta migração é oferecer uma base backend sólida, configurável e moderna, substituindo o antigo projeto em JavaScript.

## Requisitos

- PHP >= 8.2
- Composer >= 2.6
- Node.js >= 18
- SQLite (recomendado para desenvolvimento) ou outro banco de dados suportado

## Primeiros passos

1. Instale as dependências do PHP:

   ```bash
   composer install
   ```

2. Copie o arquivo de variáveis de ambiente:

   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. Crie o banco de dados SQLite (caso opte por ele):

   ```bash
   touch database/database.sqlite
   ```

4. Execute as migrações e (opcionalmente) as seeders:

   ```bash
   php artisan migrate --seed
   ```

5. Instale as dependências front-end e execute o ambiente de desenvolvimento com Vite:

   ```bash
   npm install
   npm run dev
   ```

6. Inicie o servidor de desenvolvimento do Laravel:

   ```bash
   php artisan serve
   ```

O site estará disponível em `http://localhost:8000` e carregará automaticamente os assets gerados pelo Vite.

## Estrutura principal

- `app/` — código PHP da aplicação (controladores, modelos, middlewares, providers).
- `config/` — arquivos de configuração do Laravel.
- `database/` — migrações, factories e seeders.
- `resources/views/` — templates Blade.
- `resources/js/` e `resources/css/` — assets compilados pelo Vite.
- `routes/` — definição das rotas web, API, console e health-check.

## Deploy na Netlify

A Netlify pode ser utilizada apenas para servir o front-end. Para projetos Laravel completos recomenda-se utilizar serviços com suporte a PHP (Forge, Vapor, Railway, Render, etc.). Caso deseje manter a Netlify, configure uma build que execute `npm run build` para gerar os assets e utilize um serviço separado para hospedar o backend PHP.

## Próximos passos sugeridos

- Configurar pipelines CI/CD que executem `composer test` e `npm run build`.
- Criar componentes Blade para as principais funcionalidades do produto.
- Definir a estratégia de autenticação (Laravel Breeze, Jetstream ou customizada).

Boa codificação! 🚀
