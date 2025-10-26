import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const location = useLocation();
  const { theme } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  const services = [
    { name: "Diagnóstico IA Firece", path: "/diagnostic" },
    { name: "Consultoria Individual", path: "/consultations" },
    { name: "Planejamento Financeiro", path: "/servicos#planejamento" },
    { name: "Gestão de Investimentos", path: "/servicos#investimentos" },
    { name: "Educação Financeira", path: "/servicos#educacao" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 shadow-lg transition-colors ${
      theme === "light" 
        ? "bg-white text-foreground" 
        : "bg-[#1a1a1a] text-white"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo variant={theme === "light" ? "dark" : "white"} className="h-10" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium hover:text-primary transition-colors ${
                isActive("/") ? "text-primary" : ""
              }`}
            >
              Home
            </Link>

            {/* Dropdown Nossos Serviços */}
            <div
              className="relative group"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors">
                Nossos Serviços
                <ChevronDown className="w-4 h-4" />
              </button>
              {servicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-popover text-popover-foreground rounded-lg shadow-xl py-2 animate-fade-in border border-border z-50">
                  {services.map((service) => (
                    <Link
                      key={service.path}
                      to={service.path}
                      className="block px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
                      onClick={() => setServicesOpen(false)}
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/code-capital"
              className={`text-sm font-medium hover:text-primary transition-colors ${
                isActive("/code-capital") ? "text-primary" : ""
              }`}
            >
              Code Capital
            </Link>

            <Link
              to="/key-account"
              className={`text-sm font-medium hover:text-primary transition-colors ${
                isActive("/key-account") ? "text-primary" : ""
              }`}
            >
              Key Account
            </Link>

            <Link
              to="/parcerias"
              className={`text-sm font-medium hover:text-primary transition-colors ${
                isActive("/parcerias") ? "text-primary" : ""
              }`}
            >
              Parcerias
            </Link>

            <Link
              to="/blog"
              className={`text-sm font-medium hover:text-primary transition-colors ${
                isActive("/blog") ? "text-primary" : ""
              }`}
            >
              Blog
            </Link>

            <Link
              to="/trabalhe-conosco"
              className={`text-sm font-medium hover:text-primary transition-colors ${
                isActive("/trabalhe-conosco") ? "text-primary" : ""
              }`}
            >
              Trabalhe Conosco
            </Link>

            <ThemeToggle />

            <Link to="/auth">
              <Button size="sm" className="ml-4">
                Começar Agora
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={theme === "light" ? "lg:hidden text-foreground" : "lg:hidden text-white"}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden pb-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>

              {/* Mobile Services Dropdown */}
              <div>
                <button
                  className="flex items-center justify-between w-full text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setServicesOpen(!servicesOpen)}
                >
                  Nossos Serviços
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      servicesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {servicesOpen && (
                  <div className="ml-4 mt-2 flex flex-col gap-2">
                    {services.map((service) => (
                      <Link
                        key={service.path}
                        to={service.path}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        onClick={() => {
                          setIsOpen(false);
                          setServicesOpen(false);
                        }}
                      >
                        {service.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/code-capital"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Code Capital
              </Link>

              <Link
                to="/key-account"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Key Account
              </Link>

              <Link
                to="/parcerias"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Parcerias
              </Link>

              <Link
                to="/blog"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Blog
              </Link>

              <Link
                to="/trabalhe-conosco"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Trabalhe Conosco
              </Link>

              <div className="flex items-center gap-4">
                <ThemeToggle />
                <Link to="/auth" onClick={() => setIsOpen(false)} className="flex-1">
                  <Button size="sm" className="w-full">
                    Começar Agora
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
