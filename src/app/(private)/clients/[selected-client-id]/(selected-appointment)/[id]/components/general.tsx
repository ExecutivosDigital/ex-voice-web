"use client";

import { RequestTranscription } from "@/components/ui/request-transcription";
import { useGeneralContext } from "@/context/GeneralContext";
import { FileText, Sparkles, Wand2, Loader2, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function General() {
  const { selectedRecording } = useGeneralContext();
  const isPending = selectedRecording?.transcriptionStatus === "PENDING";

  return (
    <div className="prose prose-sm prose-h1:text-center prose-h1:text-primary prose-h2:text-primary min-h-[500px] w-full max-w-none flex flex-col">
      {selectedRecording?.summary ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {selectedRecording?.summary}
        </ReactMarkdown>
      ) : isPending ? (
        <div className="flex flex-1 flex-col items-center justify-center py-16 mt-10 w-full animate-in fade-in duration-700">
          <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto relative">
            {/* Ambient glow */}
            <div className="absolute top-[20%] left-1/2 -z-10 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-400/20 blur-3xl" />
            
            <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-50 to-slate-200/50 shadow-xl shadow-slate-300/40 ring-1 ring-slate-200/50 mb-8">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/60 to-transparent" />
              <Loader2 className="h-12 w-12 animate-spin text-slate-500 relative z-10" />
              
              <div className="absolute -right-3 -top-3 flex items-center justify-center rounded-full bg-white p-2 shadow-lg ring-1 ring-slate-100">
                <Clock className="h-5 w-5 text-slate-500" />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100/80 px-4 py-1.5 text-xs font-semibold text-slate-600 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-slate-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-slate-500" />
              </span>
              Gerando Resumo e Transcrição
            </div>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-3 text-center !mt-0">
              A mágica está acontecendo...
            </h2>
            <p className="max-w-xs text-center text-sm leading-relaxed text-slate-500">
              O seu áudio está sendo processado pela nossa Inteligência Artificial para gerar um resumo completo. Por favor, aguarde.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center py-12 mt-4 w-full animate-in zoom-in-95 duration-500">
          <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
            {/* 3D-like Icon Display */}
            <div className="relative mb-10 w-full flex justify-center mt-8">
              {/* Background radial glow */}
              <div className="absolute left-1/2 top-1/2 -z-10 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-3xl" />
              
              {/* Main Card */}
              <div className="relative flex flex-col items-center justify-center h-32 w-32 rounded-[2rem] bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-2xl shadow-blue-500/20 ring-1 ring-slate-700/50 transform hover:scale-105 transition-transform duration-500">
                {/* Glossy overlay */}
                <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/10 to-transparent" />
                
                <FileText className="h-12 w-12 text-slate-300 relative z-10" strokeWidth={1.5} />
                
                {/* Floating Magical Wand */}
                <div className="absolute -right-4 -bottom-4 animate-bounce hover:animate-none flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-blue-500 shadow-xl shadow-blue-500/40 border-4 border-white">
                  <Wand2 className="h-6 w-6 text-white" />
                </div>
                
                {/* Top left sparkle */}
                <div className="absolute -top-3 -left-3 animate-pulse bg-white rounded-full p-2 shadow-lg ring-1 ring-slate-100">
                  <Sparkles className="h-4 w-4 text-blue-400" />
                </div>
              </div>
            </div>

            {/* Typography content */}
            <div className="mb-8 flex flex-col items-center gap-3 text-center px-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 ring-1 ring-blue-500/20">
                Ação Necessária
              </span>
              <h2 className="text-2xl font-bold text-slate-800 !mt-0 mb-1">
                Resumo Não Solicitado
              </h2>
              <p className="max-w-sm text-[15px] leading-relaxed text-slate-500">
                Para visualizar os insights e o resumo textual desta reunião, é necessário primeiro solicitar a transcrição do áudio.
              </p>
            </div>

            {/* Action Area */}
            <div className="flex w-full justify-center">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-500 via-blue-500 to-blue-500 opacity-20 blur transition duration-1000 group-hover:opacity-40 group-hover:duration-200" />
                <RequestTranscription />
              </div>
            </div>
            
            {/* Micro hint */}
            <p className="mt-6 flex items-center gap-2 text-xs font-medium text-slate-400">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              Nossa IA fará o trabalho pesado para você
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
