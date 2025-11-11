# Pleno Score — Diagnóstico Financeiro em Laravel

Aplicação web compacta construída com Laravel, Blade e PHP 8.2 para conduzir diagnósticos financeiros com apoio de IA e calcular o score final do usuário.

## Visão Geral

O fluxo principal segue quatro etapas simples:

1. **Autenticação** com email e senha.
2. **Diagnóstico guiado** por formulário com validações essenciais.
3. **Revisão e confirmação** dos dados informados.
4. **Resultado** com score de 0 a 150, perfil financeiro e histórico completo.

O cálculo do score utiliza seis dimensões ponderadas:

| Dimensão             | Peso |
|---------------------|------|
| Dívidas              | 25   |
| Comportamento        | 20   |
| Gastos vs Renda      | 15   |
| Metas                | 15   |
| Reserva              | 15   |
| Renda                | 10   |

Classificação final:

- **Crítico**: 0–50
- **Em Evolução**: 51–100
- **Saudável**: 101–125
- **Avançado**: 126–150

## Requisitos

- PHP 8.2+
- Composer
- SQLite (padrão) ou outro banco compatível com Laravel

## Configuração

```bash
cp .env.example .env
composer install
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan serve
```

A aplicação ficará disponível em `http://localhost:8000`.

## Estrutura de Pastas

- `app/Http/Controllers` — Controladores para autenticação, diagnóstico, resultados e histórico.
- `app/Services` — Serviços de validação e cálculo do score.
- `resources/views` — Layouts Blade e páginas da aplicação.
- `database/migrations` — Estrutura das tabelas `users` e `diagnostics`.
- `database/seeders` — Usuário demo e diagnósticos de exemplo.

## Fluxo do Usuário

1. Acessa `/auth/login` ou cria conta em `/auth/register`.
2. Preenche o formulário de diagnóstico em `/diagnostic` (salvamento automático simplificado).
3. Revisa as respostas em `/review` com validação de limites (ex.: dívidas > 36× renda).
4. Recebe o score em `/results/{id}` e consulta os históricos em `/history`.

## Próximos Passos (sugestões)

- Integrar um provedor de IA (ex.: Gemini) para gerar feedback textual.
- Adicionar testes de feature para os fluxos principais.
- Incluir gráficos ou dashboards mais ricos para os resultados.
