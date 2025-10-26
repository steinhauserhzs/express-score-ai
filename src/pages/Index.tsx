import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Stats from "@/components/sections/Stats";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/sections/Testimonials";
import AdditionalServices from "@/components/sections/AdditionalServices";
import CorporateBenefits from "@/components/sections/CorporateBenefits";
import FAQ from "@/components/sections/FAQ";
import TrustBadges from "@/components/sections/TrustBadges";
import FinalCTA from "@/components/sections/FinalCTA";
import AboutFirece from "@/components/sections/AboutFirece";
import ContactSection from "@/components/sections/ContactSection";
import OurConsultants from "@/components/sections/OurConsultants";
import FreeResources from "@/components/sections/FreeResources";
import Layout from "@/components/Layout";
import Logo from "@/components/Logo";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, Instagram, Linkedin, Facebook } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <Hero />
      <Features />
      <Stats />
      <AboutFirece />
      <OurConsultants />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <AdditionalServices />
      <FreeResources />
      <CorporateBenefits />
      <ContactSection />
      <FAQ />
      <TrustBadges />
      <FinalCTA />
      
      <footer className="py-12 md:py-16 border-t bg-secondary text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 md:gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-5 mb-10">
            {/* Coluna 1 - Sobre a Firece */}
            <div className="space-y-4 lg:col-span-2">
              <Logo size="sm" variant="white" />
              <p className="text-sm text-white/70 max-w-sm">
                Transformando vidas através da educação financeira há 9 anos. Mais de 1000 clientes atendidos e R$ 70M sob administração.
              </p>
              <div className="space-y-2 text-sm">
                <a href="mailto:contato@firece.com.br" className="flex items-center gap-2 text-white/80 hover:text-primary transition-colors">
                  <Mail className="h-4 w-4" />
                  contato@firece.com.br
                </a>
                <a href="tel:+5511987201303" className="flex items-center gap-2 text-white/80 hover:text-primary transition-colors">
                  <Phone className="h-4 w-4" />
                  (11) 98720-1303
                </a>
                <p className="text-xs text-white/70 mt-2">
                  📍 Dr. Cardoso de Mello, 1666, Cj. 92<br />
                  Vila Olímpia, São Paulo - SP
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <a href="https://instagram.com/fiercefinancas" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="https://linkedin.com/company/firece-consultoria" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="https://facebook.com/fiercefinancas" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            {/* Coluna 2 - Serviços */}
            <div>
              <h3 className="text-base font-bold mb-4 firece-text-highlight">Serviços</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li><button onClick={() => navigate('/diagnostic')} className="hover:text-primary transition-colors">Diagnóstico IA</button></li>
                <li><button onClick={() => navigate('/consultations')} className="hover:text-primary transition-colors">Consultoria Individual</button></li>
                <li><button onClick={() => navigate('/servicos')} className="hover:text-primary transition-colors">Educa Fire</button></li>
                <li><button onClick={() => navigate('/key-account')} className="hover:text-primary transition-colors">Clube Empresarial</button></li>
                <li><button onClick={() => navigate('/servicos')} className="hover:text-primary transition-colors">Palestras</button></li>
                <li><button onClick={() => navigate('/refer')} className="hover:text-primary transition-colors">Programa de Indicação</button></li>
              </ul>
            </div>
            
            {/* Coluna 3 - Empresa */}
            <div>
              <h3 className="text-base font-bold mb-4 firece-text-highlight">Empresa</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li><button onClick={() => navigate('/sobre')} className="hover:text-primary transition-colors">Sobre Nós</button></li>
                <li><button onClick={() => navigate('/sobre')} className="hover:text-primary transition-colors">Nossa Equipe</button></li>
                <li><button onClick={() => navigate('/contato')} className="hover:text-primary transition-colors">Contato</button></li>
                <li><button onClick={() => navigate('/blog')} className="hover:text-primary transition-colors">Blog</button></li>
                <li><button onClick={() => navigate('/trabalhe-conosco')} className="hover:text-primary transition-colors">Trabalhe Conosco</button></li>
                <li><button onClick={() => navigate('/parcerias')} className="hover:text-primary transition-colors">Parcerias</button></li>
              </ul>
            </div>
            
            {/* Coluna 4 - Legal & Recursos */}
            <div>
              <h3 className="text-base font-bold mb-4 firece-text-highlight">Legal</h3>
              <ul className="space-y-2 text-sm text-white/80 mb-6">
                <li><button onClick={() => navigate('/privacidade')} className="hover:text-primary transition-colors">Política de Privacidade</button></li>
                <li><button onClick={() => navigate('/termos')} className="hover:text-primary transition-colors">Termos de Uso</button></li>
                <li><button onClick={() => navigate('/privacidade')} className="hover:text-primary transition-colors">LGPD</button></li>
              </ul>
              <h3 className="text-base font-bold mb-4 firece-text-highlight">Recursos</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li><button onClick={() => navigate('/contato')} className="hover:text-primary transition-colors">Central de Ajuda</button></li>
                <li><button onClick={() => navigate('/calculators')} className="hover:text-primary transition-colors">Calculadoras</button></li>
                <li><button onClick={() => navigate('/dashboard')} className="hover:text-primary transition-colors">Área do Cliente</button></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs md:text-sm text-white/60">
              <p>© {new Date().getFullYear()} Firece Consultoria Financeira LTDA. Todos os direitos reservados.</p>
              <p>CNPJ: XX.XXX.XXX/0001-XX</p>
            </div>
          </div>
        </div>
      </footer>
    </Layout>
  );
};

export default Index;
