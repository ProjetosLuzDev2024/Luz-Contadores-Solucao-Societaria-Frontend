export interface FormularioDados {
  processo_id: string | null;
  opcoes_nome_empresa: string[];
  nome_fantasia: string;
  endereco: {
    rua: string;
    numero: number;
    bairro: string;
    cep: string;
    municipio: string;
    uf: string;
  };
  inscricao_imob: string;
  telefone: string;
  email: string;
  val_capital_social: number;
  capital_integralizado: boolean; // "True" ou "False"
  data_integralizacao: string; // formato ISO: "YYYY-MM-DD"
  empresa_anexa_resid: boolean; // "True" ou "False"
  endereco_apenas_contato: boolean; // "True" ou "False"
  area_empresa: number;
  info_adicionais: InfoAdicionais;
}

interface InfoAdicionaisTrue {
  resp_tecnica: true;
  nome_responsavel: string;
  nmr_carteira_profissional: string;
  uf: string;
  area_resp: string;
}

interface InfoAdicionaisFalse {
  resp_tecnica: false;
}

type InfoAdicionais = InfoAdicionaisTrue | InfoAdicionaisFalse;

export interface Socios {
  empresa_id: string | null;
  socios: Array<{
    nome: string;
    nacionalidade: string;
    data_nascimento: string;
    estado_civil: string;
    regime_casamento?: string;
    profissao: string;
    cpf: string;
    rg: string;
    orgao_expedidor: string;
    uf: string;
    administrador: boolean;
    tipo_administrador?: string;
    qtd_cotas: number;
    endereco: {
      rua: string;
      numero: number;
      bairro: string;
      cep: string;
      municipio: string;
      complemento: string;
      uf: string;
    };
  }>;
}
