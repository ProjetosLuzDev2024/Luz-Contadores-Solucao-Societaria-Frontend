"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetFooter } from "@/components/ui/sheet";
import { Clock, CalendarIcon, Copy, FileText, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSocietarioActions } from "@/hooks/useSocietario";
import { toast } from "sonner";

interface Tarefa {
  id: string;
  tarefa: {
    descricao: string;
  };
  concluida: boolean;
  sequencia: number;
  etapa: {
    id: string;
    nome: string;
  };
}

interface Etapa {
  id: string;
  nome: string;
  ordem: number;
}

interface Processo {
  id: string;
  nome: string;
  tipo_processo: {
    descricao: string;
  };
  contabilidade: {
    nome: string;
    cnpj: string;
  };
  etapa?: {
    id: string;
    nome: string;
  };
  tarefas: Tarefa[];
  expire_at: string;
  created_at: string;
}

interface EditSheetProps {
  processo: Processo;
  etapas: Etapa[];
  tarefas: Tarefa[];
  onSave: (updatedProcesso: Processo) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const calcularDiasPassados = (startDate: string): number => {
  const dataInicio = new Date(startDate);
  const dataAtual = new Date();
  const diferencaEmMs = dataAtual.getTime() - dataInicio.getTime();
  return Math.floor(diferencaEmMs / (1000 * 3600 * 24));
};

export default function EditSheet({
  processo,
  etapas,
  tarefas,
  onSave,
  onCancel,
  isLoading,
}: EditSheetProps) {
  const [tarefasAtualizadas, setTarefasAtualizadas] = useState<Tarefa[]>(
    tarefas.sort((a, b) => a.sequencia - b.sequencia)
  );
  const [isSaving, setIsSaving] = useState(false);
  const formLink = "forms.com.br/formulario/939887/bxg93ky4tgj8";

  const { updateProcesso } = useSocietarioActions();

  const handleTaskToggle = (id: string, concluida: boolean) => {
    const taskToToggle = tarefasAtualizadas.find((tarefa) => tarefa.id === id);
  
    if (!taskToToggle) return;
  
    if (!concluida) {
      const completedTasks = tarefasAtualizadas.filter(
        (tarefa) => tarefa.concluida
      );
  
      if (completedTasks.length === 0) {
        setTarefasAtualizadas((prevTarefas) =>
          prevTarefas.map((tarefa) =>
            tarefa.id === id ? { ...tarefa, concluida: false } : tarefa
          )
        );
        return;
      }
  
      const lastCompletedTask = completedTasks[completedTasks.length - 1];
  
      if (lastCompletedTask.id !== id) {
        toast("Você só pode desmarcar a última tarefa concluída.");
        return;
      }
    }
  
    setTarefasAtualizadas((prevTarefas) =>
      prevTarefas.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, concluida: concluida } : tarefa
      )
    );
  };
  
  const handleSave = async () => {
    setIsSaving(true);
  
    const tarefasAlteradas = tarefasAtualizadas
      .filter(
        (tarefa) =>
          tarefa.concluida !==
          tarefas.find((t) => t.id === tarefa.id)?.concluida
      )
      .map((tarefa) => ({
        tarefa_id: tarefa.id,
        status: tarefa.concluida.toString(),
      }));
  
    if (tarefasAlteradas.length === 0) {
      toast("Não houve alterações nas tarefas.");
      setIsSaving(false);
      return;
    }
  
    const dataToSend = {
      processo_id: processo.id,
      tarefas: tarefasAlteradas,
    };
  
    try {
      await updateProcesso(dataToSend);
      onSave({ ...processo, tarefas: tarefasAtualizadas });
      toast("As alterações foram salvas com sucesso.");
    } catch (error) {
      console.error("Erro ao salvar as alterações", error);
      toast("Ocorreu um erro ao salvar as alterações.");
    } finally {
      setIsSaving(false);
    }
  };
  

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formLink);
  };

  useEffect(() => {
    console.log("Tarefas:", tarefas);
    console.log("Etapas:", etapas);
  }, [tarefas, etapas]);

  return (
    <Sheet open onOpenChange={() => onCancel?.()}>
      <SheetContent
        side="right"
        className="flex flex-col h-full overflow-y-auto"
      >
        <div className="flex-grow">
          <div className="flex justify-start items-center mb-6">
            <div className="flex flex-col items-start justify-center gap-2">
              <div>
                <h1 className="text-2xl font-bold">{processo.nome}</h1>
                <p className="italic text-muted-foreground text-sm">
                  {processo.contabilidade.nome}
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Dias corridos
                </Label>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">
                    {calcularDiasPassados(processo.created_at)}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Tipo de processo
                </Label>
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="">{processo.tipo_processo.descricao}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Data de início
                </Label>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">
                    {new Date(processo.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Data de conclusão
                </Label>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">
                    {new Date(processo.expire_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <Separator className="my-3" />

            <div className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                {etapas.map((etapa) => (
                  <AccordionItem key={etapa.id} value={etapa.id}>
                    <AccordionTrigger>{etapa.nome}</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pl-4">
                        {tarefasAtualizadas
                          .filter((tarefa) => tarefa.etapa.id === etapa.id)
                          .map((tarefa) => (
                            <div
                              key={tarefa.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={tarefa.id}
                                checked={tarefa.concluida}
                                onCheckedChange={(checked) =>
                                  handleTaskToggle(tarefa.id, Boolean(checked))
                                }
                              />
                              <label
                                htmlFor={tarefa.id}
                                className={`text-sm leading-none ${
                                  tarefa.concluida
                                    ? "line-through text-muted-foreground"
                                    : ""
                                }`}
                              >
                                {tarefa.tarefa.descricao}
                              </label>
                            </div>
                          ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          <div className="space-y-2 my-6">
            <Label className="text-sm text-muted-foreground">
              Link para formulário
            </Label>
            <div className="flex space-x-2">
              <Input readOnly value={formLink} className="flex-1" />
              <Button variant="outline" size="icon" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <SheetFooter className="mt-6 flex justify-end sm:justify-end">
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            variant="default"
            type="submit"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar alterações"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
