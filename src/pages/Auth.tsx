import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, User, Mail, Lock, Phone, CreditCard, CheckCircle2, XCircle } from "lucide-react";
import InputMask from "react-input-mask";
import { validateCPF, validatePhone, validateEmail, validatePassword, validateFullName } from "@/utils/validators";
import { cleanCPF, cleanPhone } from "@/utils/formatters";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already logged in and redirect
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check if user is admin
        const { data: isAdmin } = await supabase.rpc('has_role', {
          _user_id: session.user.id,
          _role: 'admin'
        });
        
        navigate(isAdmin ? '/admin-choice' : '/dashboard');
      }
    };
    
    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        // Check if user is admin
        const { data: isAdmin } = await supabase.rpc('has_role', {
          _user_id: session.user.id,
          _role: 'admin'
        });
        
        navigate(isAdmin ? '/admin-choice' : '/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Validation states
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [cpfValid, setCpfValid] = useState<boolean | null>(null);
  const [phoneValid, setPhoneValid] = useState<boolean | null>(null);
  const [fullNameValid, setFullNameValid] = useState<boolean | null>(null);
  const passwordValidation = validatePassword(password);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações antes de submeter
    if (!validateFullName(fullName)) {
      toast({
        title: "Nome inválido",
        description: "Digite seu nome completo (nome e sobrenome).",
        variant: "destructive",
      });
      return;
    }

    if (!validateCPF(cpf)) {
      toast({
        title: "CPF inválido",
        description: "Digite um CPF válido.",
        variant: "destructive",
      });
      return;
    }

    if (!validatePhone(phone)) {
      toast({
        title: "Telefone inválido",
        description: "Digite um telefone válido com DDD.",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Email inválido",
        description: "Digite um email válido.",
        variant: "destructive",
      });
      return;
    }

    if (!passwordValidation.isValid) {
      toast({
        title: "Senha inválida",
        description: "A senha deve ter no mínimo 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    if (!termsAccepted) {
      toast({
        title: "Termos de uso",
        description: "Você precisa aceitar os termos de uso para continuar.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: cleanPhone(phone),
            cpf: cleanCPF(cpf),
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;

      toast({
        title: "Conta criada!",
        description: "Você já pode fazer login e começar seu diagnóstico.",
      });
      
      // Auto login após cadastro
      const { error: signInError, data: signInData } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      
      // Check if user is admin
      const { data: isAdmin } = await supabase.rpc('has_role', {
        _user_id: signInData.user.id,
        _role: 'admin'
      });
      
      navigate(isAdmin ? '/admin-choice' : '/dashboard');
    } catch (error: any) {
      let errorMessage = error.message;
      
      // Mensagens de erro mais amigáveis
      if (error.message.includes("duplicate key value violates unique constraint")) {
        if (error.message.includes("cpf_unique")) {
          errorMessage = "Este CPF já está cadastrado no sistema.";
        } else {
          errorMessage = "Este email já está cadastrado no sistema.";
        }
      }
      
      toast({
        title: "Erro ao criar conta",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Se o usuário não marcou "lembrar de mim", configurar para sessão temporária
      if (!rememberMe && data.session) {
        // Copiar token para sessionStorage
        sessionStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
        // Limpar do localStorage
        localStorage.removeItem('sb-rpjkccdfulotegejzowk-auth-token');
      }

      // Check if user is admin
      const { data: isAdmin } = await supabase.rpc('has_role', {
        _user_id: data.user.id,
        _role: 'admin'
      });

      toast({
        title: "Bem-vindo de volta!",
        description: "Login realizado com sucesso.",
      });
      
      navigate(isAdmin ? '/admin-choice' : '/dashboard');
    } catch (error: any) {
      let errorMessage = error.message;
      
      // Mensagens de erro mais amigáveis
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Email ou senha incorretos.";
      }
      
      toast({
        title: "Erro ao fazer login",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/5 to-purple-500/5">
      <div className="w-full max-w-md space-y-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Pleno</h1>
          <p className="text-muted-foreground">Sua jornada financeira começa aqui</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Acesse sua conta</CardTitle>
            <CardDescription>
              Entre ou crie uma conta para começar seu diagnóstico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Criar Conta</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Lembrar de mim por 60 dias
                    </label>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Entrar
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullname">Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="fullname"
                        type="text"
                        placeholder="João Silva Santos"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          setFullNameValid(validateFullName(e.target.value));
                        }}
                        className="pl-10 pr-10"
                        required
                      />
                      {fullNameValid !== null && (
                        <div className="absolute right-3 top-3">
                          {fullNameValid ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {fullNameValid === false && (
                      <p className="text-xs text-red-500">Digite nome e sobrenome</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <InputMask
                        mask="999.999.999-99"
                        value={cpf}
                        onChange={(e) => {
                          setCpf(e.target.value);
                          setCpfValid(validateCPF(e.target.value));
                        }}
                      >
                        {(inputProps: any) => (
                          <Input
                            {...inputProps}
                            id="cpf"
                            type="text"
                            placeholder="000.000.000-00"
                            className="pl-10 pr-10"
                            required
                          />
                        )}
                      </InputMask>
                      {cpfValid !== null && (
                        <div className="absolute right-3 top-3">
                          {cpfValid ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {cpfValid === false && (
                      <p className="text-xs text-red-500">CPF inválido</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <InputMask
                        mask="(99) 99999-9999"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          setPhoneValid(validatePhone(e.target.value));
                        }}
                      >
                        {(inputProps: any) => (
                          <Input
                            {...inputProps}
                            id="phone"
                            type="tel"
                            placeholder="(00) 00000-0000"
                            className="pl-10 pr-10"
                            required
                          />
                        )}
                      </InputMask>
                      {phoneValid !== null && (
                        <div className="absolute right-3 top-3">
                          {phoneValid ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {phoneValid === false && (
                      <p className="text-xs text-red-500">Telefone inválido</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailValid(validateEmail(e.target.value));
                        }}
                        className="pl-10 pr-10"
                        required
                      />
                      {emailValid !== null && (
                        <div className="absolute right-3 top-3">
                          {emailValid ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {emailValid === false && (
                      <p className="text-xs text-red-500">Email inválido</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                        minLength={6}
                      />
                    </div>
                    {password && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${
                                passwordValidation.strength === 'strong'
                                  ? 'w-full bg-green-500'
                                  : passwordValidation.strength === 'medium'
                                  ? 'w-2/3 bg-yellow-500'
                                  : 'w-1/3 bg-red-500'
                              }`}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground capitalize">
                            {passwordValidation.strength === 'strong' ? 'Forte' : 
                             passwordValidation.strength === 'medium' ? 'Média' : 'Fraca'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start space-x-2 pt-2">
                    <Checkbox
                      id="terms"
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Li e aceito os{" "}
                      <a href="#" className="text-primary hover:underline">
                        termos de uso
                      </a>{" "}
                      e{" "}
                      <a href="#" className="text-primary hover:underline">
                        política de privacidade
                      </a>
                    </label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading || !termsAccepted}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Criar Minha Conta
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
