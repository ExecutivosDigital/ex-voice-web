"use client";

import { ChevronRight, Plus, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { EmptyState } from "../_components/empty-state";
import { ListPage } from "../_components/list-page";
import { RecorderModal } from "../_components/recorder-modal";
import { Shell } from "../_components/shell";
import { allClients } from "../_mocks";

export default function ClientsPage() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Shell breadcrumbs={[{ label: "Contatos" }]} onRecordClick={() => setOpen(true)}>
        <ListPage
          title="Seus contatos"
          subtitle={`${allClients.length} contatos cadastrados`}
          searchPlaceholder="Buscar por nome..."
          action={
            <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-neutral-500 to-neutral-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-neutral-900/15 transition hover:shadow-lg active:scale-[0.98]">
              <Plus className="h-4 w-4" />
              Novo contato
            </button>
          }
        >
          {allClients.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Nenhum contato cadastrado"
              description="Cadastre um novo contato para começar."
            />
          ) : (
            <ul className="divide-y divide-neutral-100">
              {allClients.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/v2/clients/${c.id}`}
                    className="group -mx-4 flex items-center gap-4 rounded-lg px-4 py-4 transition hover:bg-neutral-50"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 text-sm font-semibold text-neutral-700">
                      {c.initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-neutral-900">
                        {c.name}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-neutral-500">
                        <span>
                          <strong className="font-semibold text-neutral-700">
                            {c.sessions}
                          </strong>{" "}
                          gravações
                        </span>
                        <span className="text-neutral-300">·</span>
                        <span>Última sessão {c.lastSession}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-neutral-600" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </ListPage>
      </Shell>

      <RecorderModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
