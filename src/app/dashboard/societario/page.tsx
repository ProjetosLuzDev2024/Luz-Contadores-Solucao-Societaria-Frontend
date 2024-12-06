"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { SlidersHorizontal } from "lucide-react";
import {
  getProcessosByEtapas,
  getProcessosById,
  useListEtapas,
} from "@/hooks/useSocietario";
import KanbanColumns from "./quadro";
import EditSheet from "./editCard";
import Title from "../page-title";
import FilterDropdown from "./filter";
import { Requisicao } from "./requisicao";

export default function Societario() {
  const { processos: processosCard } = getProcessosByEtapas();
  const { etapas } = useListEtapas();
  const [selectedProcesso, setSelectedProcesso] = useState<any | null>(null);

  const processoId = selectedProcesso?.id ?? null;
  const {
    processo: detailedProcesso,
    tarefas,
    isLoading,
    isError,
  } = getProcessosById(processoId);

  const handleCardEdit = (processo: any) => setSelectedProcesso(processo);

  const handleSaveEdit = (updatedProcesso: any) => {
    console.log("Saving updated processo:", updatedProcesso);
    setSelectedProcesso(null);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-none">
        <Title titulo="Societário">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="w-full sm:w-auto">
              <FilterDropdown>
                <span className="flex items-center justify-center">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filtrar
                </span>
              </FilterDropdown>
            </Button>
            <Requisicao />
          </div>
        </Title>
      </div>

      <ScrollArea className="flex-1 w-full h-[calc(100vh-100px)] sm:h-[calc(100vh-120px)]">
        <div className="min-h-[500px] flex-1 relative py-5 px-2 sm:px-5">
          <KanbanColumns
            processosCard={processosCard}
            handleCardEdit={handleCardEdit}
            selectedProcessoId={selectedProcesso?.id}
          />
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
      {detailedProcesso && (
        <EditSheet
          tarefas={tarefas || []}
          processo={detailedProcesso}
          etapas={etapas}
          onSave={handleSaveEdit}
          onCancel={() => setSelectedProcesso(null)}
        />
      )}
    </div>
  );
}
