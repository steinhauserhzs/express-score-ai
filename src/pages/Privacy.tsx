import Layout from "@/components/Layout";
import { Shield } from "lucide-react";

const Privacy = () => {
  return (
    <Layout showWhatsApp={false}>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold">Política de Privacidade</h1>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground mb-8">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Introdução</h2>
            <p className="text-muted-foreground">
              A Firece Consultoria Financeira ("Firece", "nós" ou "nosso") está comprometida em proteger a privacidade e os dados pessoais de nossos clientes e usuários. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Informações que Coletamos</h2>
            <p className="text-muted-foreground mb-4">Coletamos os seguintes tipos de informações:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Dados de Identificação:</strong> nome completo, CPF, RG, data de nascimento</li>
              <li><strong>Dados de Contato:</strong> endereço, telefone, e-mail</li>
              <li><strong>Dados Financeiros:</strong> informações sobre renda, patrimônio, investimentos, dívidas (fornecidas voluntariamente no diagnóstico)</li>
              <li><strong>Dados de Navegação:</strong> endereço IP, tipo de navegador, páginas visitadas, tempo de permanência</li>
              <li><strong>Dados Profissionais:</strong> ocupação, empresa, cargo (quando aplicável)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Como Usamos suas Informações</h2>
            <p className="text-muted-foreground mb-4">Utilizamos seus dados pessoais para:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Prestar serviços de consultoria e educação financeira</li>
              <li>Realizar diagnósticos financeiros personalizados</li>
              <li>Comunicar-nos com você sobre nossos serviços</li>
              <li>Enviar materiais educativos e newsletters (mediante consentimento)</li>
              <li>Melhorar nossos produtos e serviços</li>
              <li>Cumprir obrigações legais e regulatórias</li>
              <li>Prevenir fraudes e garantir a segurança da plataforma</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Base Legal para Tratamento de Dados</h2>
            <p className="text-muted-foreground mb-4">Tratamos seus dados pessoais com base em:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Consentimento:</strong> quando você autoriza expressamente o uso de seus dados</li>
              <li><strong>Execução de Contrato:</strong> para prestar os serviços contratados</li>
              <li><strong>Legítimo Interesse:</strong> para melhorar nossos serviços e proteger contra fraudes</li>
              <li><strong>Obrigação Legal:</strong> para cumprir exigências regulatórias</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Compartilhamento de Dados</h2>
            <p className="text-muted-foreground mb-4">
              Não vendemos, alugamos ou comercializamos seus dados pessoais. Podemos compartilhar suas informações apenas com:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Prestadores de Serviços:</strong> empresas que nos auxiliam (hospedagem, processamento de pagamentos, envio de e-mails)</li>
              <li><strong>Parceiros Comerciais:</strong> mediante seu consentimento explícito</li>
              <li><strong>Autoridades Legais:</strong> quando exigido por lei ou para proteger direitos</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Segurança dos Dados</h2>
            <p className="text-muted-foreground">
              Implementamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado, alteração, divulgação ou destruição, incluindo: criptografia de dados sensíveis, controles de acesso rigorosos, monitoramento contínuo de segurança, e backups regulares.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Seus Direitos (LGPD)</h2>
            <p className="text-muted-foreground mb-4">Você tem direito a:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Confirmar a existência de tratamento de dados</li>
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
              <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários</li>
              <li>Solicitar a portabilidade dos dados</li>
              <li>Revogar o consentimento</li>
              <li>Solicitar informações sobre o compartilhamento de dados</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Retenção de Dados</h2>
            <p className="text-muted-foreground">
              Mantemos seus dados pessoais pelo tempo necessário para cumprir as finalidades descritas nesta política, salvo quando a retenção mais longa for exigida por lei ou regulamentação.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Cookies e Tecnologias Similares</h2>
            <p className="text-muted-foreground">
              Utilizamos cookies para melhorar sua experiência de navegação. Você pode gerenciar suas preferências de cookies nas configurações do seu navegador.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">10. Alterações nesta Política</h2>
            <p className="text-muted-foreground">
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre alterações significativas através de e-mail ou aviso em nosso site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">11. Contato</h2>
            <p className="text-muted-foreground mb-4">
              Para exercer seus direitos ou esclarecer dúvidas sobre privacidade, entre em contato:
            </p>
            <div className="bg-secondary/10 p-6 rounded-lg">
              <p className="text-muted-foreground"><strong>Encarregado de Dados (DPO):</strong></p>
              <p className="text-muted-foreground">📧 E-mail: privacidade@firece.com.br</p>
              <p className="text-muted-foreground">📞 Telefone: (11) 98720-1303</p>
              <p className="text-muted-foreground">📍 Endereço: Dr. Cardoso de Mello, 1666, Cj. 92 - Vila Olímpia, São Paulo - SP</p>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
