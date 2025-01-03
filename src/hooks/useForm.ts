import { useState } from "react";
import axios from "axios";
import { Socios, FormularioDados } from "@/@types/Formulario";
import { useFormContext } from "@/contexts/form-context";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useFormActions() {
  const { setFormId } = useFormContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const criarAbertura = async (data: FormularioDados) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/societario/create-form-abertura/`,
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const id = response.data.formulario.id;
      setFormId(id); // Atualiza o contexto com o ID
      return id;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message;
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const criarSocios = async (data: Socios) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/societario/create-socios/`,
        data, // Removido o { data } e enviando os dados diretamente
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;
    } catch (error: any) {
      // Melhorando o tratamento de erro
      const errorMessage = error.response?.data?.detail || error.message;
      setError(errorMessage);
      throw error; // Importante re-throw do erro para o componente tratar
    } finally {
      setIsLoading(false);
    }
  };

  return {
    criarSocios,
    criarAbertura,
    isLoading,
    error,
  };
}
