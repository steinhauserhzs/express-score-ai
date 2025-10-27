export const validateCPF = (cpf: string): boolean => {
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  
  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais (CPF inválido)
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleanCPF.charAt(9))) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
};

export const validatePhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[^\d]/g, '');
  // Aceita telefones com 10 (fixo) ou 11 dígitos (celular)
  return cleanPhone.length === 10 || cleanPhone.length === 11;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { 
  isValid: boolean; 
  strength: 'weak' | 'medium' | 'strong' 
} => {
  const length = password.length;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const isValid = length >= 6;
  
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  const conditions = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
  
  if (length >= 8 && conditions >= 3) {
    strength = 'strong';
  } else if (length >= 6 && conditions >= 2) {
    strength = 'medium';
  }
  
  return { isValid, strength };
};

export const validateFullName = (name: string): boolean => {
  const trimmed = name.trim();
  // Deve ter pelo menos 3 caracteres e conter espaço (nome e sobrenome)
  return trimmed.length >= 3 && trimmed.includes(' ');
};

export const validateRG = (rg: string): boolean => {
  const cleanRG = rg.replace(/[^\dX]/gi, '');
  // RG tem entre 7 e 9 dígitos (varia por estado)
  return cleanRG.length >= 7 && cleanRG.length <= 9;
};
