import { motion } from "framer-motion";
import { Activity, CheckCircle2, FileText, Mic } from "lucide-react";

const AudioWave = () => {
  return (
    <div className="flex h-12 w-full items-center justify-center gap-[2px]">
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-white"
          animate={{
            height: [10, Math.random() * 40 + 10, 10],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: i * 0.05,
          }}
        />
      ))}
    </div>
  );
};

const SuccessNotification = () => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay: 1, duration: 0.5 }}
    className="absolute top-10 -right-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-3 shadow-xl backdrop-blur-md"
  >
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
      <CheckCircle2 className="h-5 w-5 text-green-400" />
    </div>
    <div>
      <p className="text-sm font-semibold text-white">Transcrição Concluída</p>
      <p className="text-xs text-blue-200">Resumo gerado em 3s</p>
    </div>
  </motion.div>
);

const FeatureCard = () => {
  return (
    <div className="relative w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-lg">
      {/* Header com ícones simulando app de reunião */}
      <div className="mb-6 flex items-center justify-between border-b border-white/20 pb-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]" />
          <span className="text-xs font-medium text-white/90">
            Gravando Reunião...
          </span>
        </div>
        <div className="flex gap-2">
          <Mic size={16} className="text-white/80" />
          <Activity size={16} className="text-white/80" />
        </div>
      </div>

      {/* Onda de áudio animada */}
      <div className="mb-6 h-12">
        <AudioWave />
      </div>

      {/* Simulação de Transformação de Texto */}
      <div className="space-y-3">
        <motion.div
          initial={{ width: "30%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-2 rounded bg-white/20"
        />
        <motion.div
          initial={{ width: "50%" }}
          animate={{ width: "80%" }}
          transition={{ duration: 2, delay: 0.2, repeat: Infinity }}
          className="h-2 rounded bg-white/20"
        />
        <motion.div
          initial={{ width: "40%" }}
          animate={{ width: "90%" }}
          transition={{ duration: 2, delay: 0.4, repeat: Infinity }}
          className="h-2 rounded bg-white/20"
        />
      </div>

      {/* Botão de "Gerar" */}
      <motion.div
        className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-white/20 py-2 text-sm font-medium text-white"
        animate={{
          backgroundColor: [
            "rgba(255, 255, 255, 0.1)",
            "rgba(255, 255, 255, 0.25)",
            "rgba(255, 255, 255, 0.1)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <FileText size={16} />
        Gerando Resumo Inteligente
      </motion.div>

      {/* Notificação Flutuante */}
      <SuccessNotification />
    </div>
  );
};

export default FeatureCard;
