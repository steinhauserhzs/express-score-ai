import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, CreditCard, MapPin, Calendar, IdCard } from "lucide-react";
import { formatCPF, formatPhone } from "@/utils/formatters";
import { formatCEP } from "@/utils/cep";

interface UserDetailModalProps {
  user: {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    cpf: string | null;
    rg: string | null;
    cep: string | null;
    street: string | null;
    city: string | null;
    state: string | null;
    created_at: string;
    last_login_at: string | null;
    roles: string[];
  } | null;
  open: boolean;
  onClose: () => void;
}

export default function UserDetailModal({ user, open, onClose }: UserDetailModalProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detalhes do Usuário
          </DialogTitle>
          <DialogDescription>
            Informações completas do cadastro
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Pessoais */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
              INFORMAÇÕES PESSOAIS
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 mt-1 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Nome Completo</p>
                  <p className="font-medium">{user.full_name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              {user.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Telefone</p>
                    <p className="font-medium">{formatPhone(user.phone)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Documentos */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
              DOCUMENTOS
            </h3>
            <div className="space-y-3">
              {user.cpf && (
                <div className="flex items-start gap-3">
                  <CreditCard className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">CPF</p>
                    <p className="font-medium font-mono">{formatCPF(user.cpf)}</p>
                  </div>
                </div>
              )}

              {user.rg && (
                <div className="flex items-start gap-3">
                  <IdCard className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">RG</p>
                    <p className="font-medium font-mono">{user.rg}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {user.cep && (
            <>
              <Separator />
              {/* Endereço */}
              <div>
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                  ENDEREÇO
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">CEP</p>
                      <p className="font-medium font-mono">{formatCEP(user.cep)}</p>
                    </div>
                  </div>

                  {user.street && (
                    <div className="flex items-start gap-3">
                      <div className="h-4 w-4" /> {/* Spacer */}
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Logradouro</p>
                        <p className="font-medium">{user.street}</p>
                      </div>
                    </div>
                  )}

                  {(user.city || user.state) && (
                    <div className="flex items-start gap-3">
                      <div className="h-4 w-4" /> {/* Spacer */}
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Cidade/Estado</p>
                        <p className="font-medium">
                          {user.city}{user.state && ` - ${user.state}`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Informações do Sistema */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
              INFORMAÇÕES DO SISTEMA
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Data de Cadastro</p>
                  <p className="font-medium">
                    {new Date(user.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>

              {user.last_login_at && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Último Acesso</p>
                    <p className="font-medium">
                      {new Date(user.last_login_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="h-4 w-4" /> {/* Spacer */}
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Roles/Permissões</p>
                  <div className="flex gap-2 mt-1">
                    {user.roles.map((role) => (
                      <Badge key={role} variant={role === 'admin' ? 'default' : 'secondary'}>
                        {role === 'admin' ? 'Administrador' : 'Cliente'}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
