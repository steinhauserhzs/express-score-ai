import Layout from "@/components/Layout";
import { FileText } from "lucide-react";

const Terms = () => {
  return (
    <Layout showWhatsApp={false}>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold">Termos de Uso</h1>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground mb-8">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Aceitação dos Termos</h2>
            <p className="text-muted-foreground">
              Ao acessar e utilizar a plataforma Firece ("Plataforma"), você concorda em estar vinculado a estes Termos de Uso. Se você não concorda com estes termos, não deve utilizar nossos serviços.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Definições</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Plataforma:</strong> site, aplicativo e todos os serviços digitais oferecidos pela Firece</li>
              <li><strong>Usuário:</strong> qualquer pessoa que acessa ou utiliza a Plataforma</li>
              <li><strong>Cliente:</strong> usuário que contrata serviços pagos da Firece</li>
              <li><strong>Serviços:</strong> diagnóstico financeiro, consultoria, educação financeira e demais produtos oferecidos</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Descrição dos Serviços</h2>
            <p className="text-muted-foreground mb-4">A Firece oferece:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Diagnóstico Financeiro com IA:</strong> análise gratuita e automatizada da saúde financeira</li>
              <li><strong>Consultoria Individual:</strong> sessões personalizadas com consultores certificados</li>
              <li><strong>Educação Financeira:</strong> cursos, workshops e materiais educativos</li>
              <li><strong>Gestão de Investimentos:</strong> acompanhamento e assessoria de carteiras (Code Capital)</li>
              <li><strong>Programas Corporativos:</strong> soluções para empresas (Key Account)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Cadastro e Conta do Usuário</h2>
            <p className="text-muted-foreground mb-4">Para utilizar determinados serviços, você deve:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Fornecer informações verdadeiras, precisas e completas</li>
              <li>Manter suas credenciais de acesso em sigilo</li>
              <li>Notificar imediatamente sobre uso não autorizado de sua conta</li>
              <li>Ser maior de 18 anos ou ter autorização de responsável legal</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Uso Aceitável</h2>
            <p className="text-muted-foreground mb-4">Você concorda em NÃO:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Usar a Plataforma para fins ilegais ou não autorizados</li>
              <li>Tentar obter acesso não autorizado a sistemas ou dados</li>
              <li>Interferir no funcionamento da Plataforma</li>
              <li>Reproduzir, duplicar ou copiar conteúdo sem autorização</li>
              <li>Transmitir vírus, malware ou código malicioso</li>
              <li>Usar a Plataforma para spam ou comunicações indesejadas</li>
              <li>Fazer-se passar por outra pessoa ou entidade</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Serviços Pagos</h2>
            <p className="text-muted-foreground mb-4"><strong>6.1 Contratação e Pagamento</strong></p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
              <li>Os preços dos serviços estão disponíveis na Plataforma e podem ser alterados a qualquer momento</li>
              <li>O pagamento pode ser realizado através dos meios disponibilizados (cartão, PIX, boleto)</li>
              <li>A confirmação do pagamento pode levar até 2 dias úteis (boleto)</li>
            </ul>
            
            <p className="text-muted-foreground mb-4"><strong>6.2 Cancelamento e Reembolso</strong></p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Direito de arrependimento: 7 dias corridos a partir da contratação (Código de Defesa do Consumidor)</li>
              <li>Após início da prestação do serviço, reembolsos serão proporcionais ao tempo não utilizado</li>
              <li>Solicitações de cancelamento devem ser feitas através de contato@firece.com.br</li>
              <li>Reembolsos serão processados em até 10 dias úteis</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Propriedade Intelectual</h2>
            <p className="text-muted-foreground mb-4">
              Todo o conteúdo da Plataforma (textos, imagens, logos, vídeos, software) é de propriedade exclusiva da Firece ou de seus licenciadores e está protegido por leis de direitos autorais, marcas registradas e propriedade intelectual.
            </p>
            <p className="text-muted-foreground">
              É proibida a reprodução, distribuição ou uso comercial sem autorização prévia por escrito.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Limitação de Responsabilidade</h2>
            <p className="text-muted-foreground mb-4">
              <strong>8.1 Natureza dos Serviços</strong>
            </p>
            <p className="text-muted-foreground mb-4">
              Os serviços da Firece têm caráter educacional e consultivo. As decisões financeiras são de responsabilidade exclusiva do cliente. Não garantimos resultados financeiros específicos.
            </p>
            
            <p className="text-muted-foreground mb-4">
              <strong>8.2 Disponibilidade</strong>
            </p>
            <p className="text-muted-foreground mb-4">
              Embora nos esforcemos para manter a Plataforma disponível 24/7, não garantimos operação ininterrupta. Podemos realizar manutenções programadas mediante aviso prévio.
            </p>
            
            <p className="text-muted-foreground mb-4">
              <strong>8.3 Exclusão de Garantias</strong>
            </p>
            <p className="text-muted-foreground">
              A Plataforma é fornecida "como está". Não garantimos que seja livre de erros, vírus ou outros componentes prejudiciais.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Indenização</h2>
            <p className="text-muted-foreground">
              Você concorda em indenizar e isentar a Firece, seus diretores, funcionários e parceiros de quaisquer reclamações, perdas, responsabilidades ou despesas (incluindo honorários advocatícios) decorrentes do seu uso inadequado da Plataforma ou violação destes Termos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">10. Links para Sites de Terceiros</h2>
            <p className="text-muted-foreground">
              A Plataforma pode conter links para sites de terceiros. Não somos responsáveis pelo conteúdo, políticas ou práticas desses sites. O acesso é por sua conta e risco.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">11. Modificações dos Termos</h2>
            <p className="text-muted-foreground">
              Reservamo-nos o direito de modificar estes Termos a qualquer momento. Alterações significativas serão comunicadas através de e-mail ou aviso na Plataforma. O uso continuado após modificações constitui aceitação dos novos termos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">12. Rescisão</h2>
            <p className="text-muted-foreground mb-4">Podemos suspender ou encerrar sua conta se:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Você violar estes Termos</li>
              <li>Houver atividade fraudulenta ou ilegal</li>
              <li>Mediante solicitação de autoridades competentes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">13. Lei Aplicável e Foro</h2>
            <p className="text-muted-foreground">
              Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da Comarca de São Paulo - SP para dirimir quaisquer controvérsias decorrentes destes Termos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">14. Contato</h2>
            <p className="text-muted-foreground mb-4">
              Para dúvidas ou questões sobre estes Termos:
            </p>
            <div className="bg-secondary/10 p-6 rounded-lg">
              <p className="text-muted-foreground"><strong>Firece Consultoria Financeira</strong></p>
              <p className="text-muted-foreground">📧 E-mail: contato@firece.com.br</p>
              <p className="text-muted-foreground">📞 Telefone: (11) 98720-1303</p>
              <p className="text-muted-foreground">📍 Endereço: Dr. Cardoso de Mello, 1666, Cj. 92 - Vila Olímpia, São Paulo - SP</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">15. Disposições Gerais</h2>
            <p className="text-muted-foreground mb-4">
              <strong>15.1 Integralidade:</strong> Estes Termos constituem o acordo completo entre você e a Firece.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>15.2 Divisibilidade:</strong> Se qualquer disposição for considerada inválida, as demais continuarão em vigor.
            </p>
            <p className="text-muted-foreground">
              <strong>15.3 Cessão:</strong> Você não pode transferir seus direitos sob estes Termos sem nossa autorização.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
