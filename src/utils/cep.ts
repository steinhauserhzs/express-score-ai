export interface AddressData {
  cep: string;
  street: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  error?: boolean;
}

export const fetchAddressByCEP = async (cep: string): Promise<AddressData | null> => {
  const cleanCEP = cep.replace(/\D/g, '');
  
  if (cleanCEP.length !== 8) {
    return null;
  }
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      return null;
    }
    
    return {
      cep: data.cep,
      street: data.logradouro,
      complement: data.complemento,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
    };
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    return null;
  }
};

export const validateCEP = (cep: string): boolean => {
  const cleanCEP = cep.replace(/\D/g, '');
  return cleanCEP.length === 8;
};

export const formatCEP = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1');
};

export const cleanCEP = (cep: string): string => {
  return cep.replace(/\D/g, '');
};
