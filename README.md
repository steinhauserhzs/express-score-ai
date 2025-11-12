# Express Score AI (Laravel Edition)

Este repositório contém a reescrita completa do Express Score AI utilizando **PHP 8**, **Laravel 11** e **Blade**. A aplicação cobre os fluxos principais do projeto original desenvolvido em React/Supabase, agora oferecendo uma base consolidada para times backoffice e squads de consultoria.

## Principais módulos

- **Onboarding e autenticação** com login, cadastro e suporte a Laravel Sanctum.
- **Dashboard consultivo** com cards de score, evolução, recomendações e desafios.
- **Gestão de diagnósticos** (modo completo e quick update), incluindo recomendações, recursos e análise de dimensões.
- **Metas e jornada** para acompanhamento de objetivos, badges gamificados e passos de customer success.
- **Learning Hub** com trilhas personalizadas e integração simples para conteúdos externos.
- **Painel administrativo** com métricas, leads, consultas e segmentos estratégicos.

## Como executar localmente

1. Instale dependências PHP (requer PHP 8.2+) e Node opcionais para assets:
   ```bash
   composer install
   npm install
   npm run build # ou npm run dev para HMR
   ```
2. Copie o arquivo de ambiente:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
3. Execute migrações e seeds com dados de demonstração:
   ```bash
   php artisan migrate --seed
   ```
4. Suba o servidor de desenvolvimento:
   ```bash
   php artisan serve
   ```

## Estrutura de dados

As migrações contemplam tabelas para usuários, diagnósticos, respostas, recomendações, metas, alertas, consultas, leads, recursos de aprendizagem, segmentos, jornadas e badges. Os seeds fornecem um ambiente demo pronto para validar fluxos end-to-end.

## Testes

Execute a suíte de testes feature/unit com:

```bash
phpunit
```

## Próximos passos sugeridos

- Conectar integrações reais (Supabase, OpenAI, CRMs) através do arquivo `config/services.php`.
- Implementar filas/Jobs para automações de relatórios e alertas.
- Ajustar design system migrando gradualmente para componentes Blade reutilizáveis ou Livewire.
