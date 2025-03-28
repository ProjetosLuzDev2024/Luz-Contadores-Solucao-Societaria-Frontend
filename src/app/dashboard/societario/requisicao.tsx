"use client";
import { Loader2 } from "lucide-react";

import { useMemo, useState, useEffect } from "react";
import { Copy, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useListEtapas,
  useListTipoProcessos,
  useProcessosByEtapas,
  useSocietarioActions,
} from "@/hooks/useSocietario";
import { SelectContabilidade, useContabilidade } from "./select-contabilidade";

export function Requisicao() {
  const { novoRegistro, isLoading, processId, errorRegistro, errorUpdate } =
    useSocietarioActions();
  const { mutate } = useProcessosByEtapas();
  const { selectedCompany } = useContabilidade();
  const { tipoProcessos } = useListTipoProcessos();

  const [showFormLink, setShowFormLink] = useState(false);
  const [selectedTipoProcesso, setSelectedTipoProcesso] = useState("");
  const [nomeCard, setNomeCard] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [currentFormLink, setCurrentFormLink] = useState<string>("");

  const resetForm = () => {
    setShowFormLink(false);
    setSelectedTipoProcesso("");
    setNomeCard("");
    setCurrentFormLink("");
  };

  useEffect(() => {
    if (processId) {
      setCurrentFormLink(
        `http://localhost:3000/formulario/abertura?id=${processId}`,
      );
    }
  }, [processId]);

  const copyToClipboard = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigator.clipboard.writeText(currentFormLink).then(() => {
      toast.success("Link copiado para a área de transferência!", {
        description: "Este link ficará salvo no card, não se preocupe.",
      });
    });
  };

  const handleRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await novoRegistro(
        nomeCard,
        selectedCompany,
        selectedTipoProcesso,
        "6688867c-667f-43e7-833b-e027a9e0eb69",
      );
      setShowFormLink(true);
      toast.success("Processo criado com sucesso!", {
        description: "Espere alguns segundos para carregar seu novo card...",
      });
      setTimeout(() => {
        mutate();
      }, 2000);
    } catch (errorRegistro) {
      toast.error("Erro ao criar processo", {
        description: "Houve algum erro ao criar seu novo processo.",
      });
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="flowtec" onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-5 w-5" /> Abrir requisição
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[485px]">
        <DialogHeader>
          <DialogTitle>Abrir requisição</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para iniciar o processo de requisição e
            criar um card
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleRequest}>
          <Tabs
            defaultValue="Abertura de empresa"
            onValueChange={setSelectedTipoProcesso}
            className="w-full"
          >
            <TabsList className="w-full">
              {tipoProcessos.map((processo) => {
                const getDescricaoSimplificada = (descricao: string) => {
                  if (descricao === "Abertura de empresa") return "Abertura";
                  if (descricao === "Alteração contratual com regin")
                    return "Alteração";
                  if (descricao === "Alteração contratual sem regin/baixa")
                    return "Baixa";
                  return descricao;
                };

                return (
                  <TabsTrigger
                    key={processo.id}
                    value={processo.id}
                    className="w-full"
                  >
                    {getDescricaoSimplificada(processo.descricao)}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {tipoProcessos.map((processo) => (
              <TabsContent key={processo.id} value={processo.id}>
                <div className="flex justify-center items-start gap-2">
                  {processo.descricao === "Alteração contratual com regin" && (
                    <div className="items-start flex flex-col gap-2 w-full">
                      <Label htmlFor="Contabilidade" className="text-right">
                        Com ou sem regin?
                      </Label>
                      <Select
                        onValueChange={setSelectedTipoProcesso}
                        value={selectedTipoProcesso}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione a opção" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="3d9a0a72-e041-44f2-be47-1c8a692b51e3">
                              Com Regin
                            </SelectItem>
                            <SelectItem value="4bdd1186-ccb5-489f-8548-80eb2db1720e">
                              Sem Regin
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="grid gap-4 py-2">
            <div className="w-full md:w-auto flex gap-4">
              {selectedTipoProcesso === "Abertura de empresa" ? (
                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <Label htmlFor="Contabilidade" className="text-right">
                    Contabilidade associada
                  </Label>
                  <SelectContabilidade />
                </div>
              ) : (
                <div className="w-full">
                  <Label htmlFor="Contabilidade" className="text-right">
                    Contabilidade associada
                  </Label>
                  <SelectContabilidade />
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center items-start gap-2">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                placeholder="Empresa de Pedro"
                value={nomeCard}
                onChange={(e) => setNomeCard(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Form Link Section */}
            <div
              className={`
                transition-all duration-500 ease-in-out
                ${
                  showFormLink
                    ? "mb-4 opacity-100 h-[50px]"
                    : "h-0 opacity-0 overflow-hidden pointer-events-none"
                }
              `}
            >
              <div className="flex flex-col gap-2">
                <Label className="text-left">Link para formulário</Label>
                <div className="flex gap-2">
                  <Input readOnly value={currentFormLink} className="flex-1" />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button onClick={resetForm} variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" variant="flowtec" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Abrindo...
                </>
              ) : (
                "Abrir requisição"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
