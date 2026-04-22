"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  Gavel,
  Globe,
  Mail,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const sections = [
  {
    number: "1",
    title: "Aceitação dos Termos",
    paragraphs: [
      "Estes Termos de Uso constituem um acordo legal entre você, o usuário final, e Executivos Digital Software House, doravante denominado \"Nós\" ou \"Desenvolvedor\". Ao utilizar a extensão \"Voice\", você declara ter lido, compreendido e aceitado integralmente estes Termos, bem como nossa Política de Privacidade.",
    ],
  },
  {
    number: "2",
    title: "Descrição do Serviço",
    paragraphs: [
      "A extensão \"Voice\" oferece funcionalidades para gravação de áudio e/ou vídeo (tela) diretamente no seu navegador, armazenando as informações localmente em seu próprio dispositivo. O principal objetivo é permitir que você capture suas próprias interações online para revisão pessoal, anotações, e outras finalidades de uso individual e não comercial. A extensão foi desenvolvida com foco na privacidade e segurança dos seus dados, conforme detalhado em nossa Política de Privacidade.",
    ],
  },
  {
    number: "3",
    title: "Licença de Uso",
    paragraphs: [
      "Concedemos a você uma licença limitada, não exclusiva, não transferível e revogável para instalar e usar a extensão \"Voice\" em seu navegador Google Chrome, estritamente para seu uso pessoal e não comercial, de acordo com estes Termos de Uso. Esta licença não concede a você nenhum direito de propriedade intelectual sobre a extensão ou qualquer de seus componentes.",
    ],
  },
  {
    number: "4",
    title: "Restrições de Uso",
    paragraphs: ["Ao utilizar a extensão \"Voice\", você concorda em não:"],
    list: [
      "Usar a extensão para qualquer finalidade ilegal ou não autorizada.",
      "Violar leis, regulamentos ou direitos de terceiros, incluindo, mas não se limitando a, direitos autorais, direitos de imagem e privacidade.",
      "Gravar ou capturar informações de terceiros sem o consentimento explícito e adequado destes. Você é o único responsável pela obtenção de quaisquer permissões necessárias para gravar dados de terceiros, se aplicável, e por garantir que seu uso da extensão esteja em conformidade com todas as leis e regulamentos aplicáveis.",
      "Modificar, adaptar, traduzir, fazer engenharia reversa, descompilar, desmontar ou tentar descobrir o código-fonte da extensão.",
      "Remover, ocultar ou alterar quaisquer avisos de direitos autorais, marcas registradas ou outros avisos de propriedade contidos na extensão.",
      "Distribuir, vender, sublicenciar ou de outra forma transferir a extensão ou seus direitos de uso a terceiros.",
      "Utilizar a extensão de forma que possa danificar, desabilitar, sobrecarregar ou prejudicar qualquer servidor ou rede associada aos serviços do Desenvolvedor.",
    ],
  },
  {
    number: "5",
    title: "Propriedade Intelectual",
    paragraphs: [
      "Todos os direitos autorais, marcas registradas e outros direitos de propriedade intelectual da extensão \"Voice\" (incluindo seu código-fonte, design, interface de usuário e funcionalidades) são de propriedade exclusiva da Executivos Digital Software House ou de seus licenciadores. Estes Termos de Uso não lhe concedem nenhum direito ou interesse sobre a propriedade intelectual da extensão, exceto a licença de uso limitada explicitamente concedida no item 3.",
    ],
  },
  {
    number: "6",
    title: "Isenção de Garantias",
    paragraphs: [
      "A extensão \"Voice\" é fornecida \"como está\" e \"conforme disponível\", sem garantias de qualquer tipo, expressas ou implícitas. O Desenvolvedor não garante que a extensão será ininterrupta, livre de erros, segura ou que qualquer defeito será corrigido. Embora nos esforcemos para garantir a segurança e a funcionalidade, o uso da extensão é por sua conta e risco.",
    ],
  },
  {
    number: "7",
    title: "Limitação de Responsabilidade",
    paragraphs: [
      "Na extensão máxima permitida pela lei aplicável, o Desenvolvedor não será responsável por quaisquer danos diretos, indiretos, incidentais, especiais, consequenciais ou exemplares, incluindo, mas não se limitando a, danos por perda de lucros, dados ou outras perdas intangíveis, resultantes do uso ou da incapacidade de usar a extensão \"Voice\".",
    ],
  },
  {
    number: "8",
    title: "Indenização",
    paragraphs: [
      "Você concorda em indenizar e isentar o Desenvolvedor, seus diretores, funcionários e agentes de qualquer e toda reivindicação, responsabilidade, dano, perda e despesa (incluindo honorários advocatícios) decorrentes de ou relacionados ao seu uso da extensão \"Voice\" em violação a estes Termos de Uso ou em violação a quaisquer leis ou regulamentos aplicáveis.",
    ],
  },
  {
    number: "9",
    title: "Modificações dos Termos",
    paragraphs: [
      "O Desenvolvedor reserva-se o direito de modificar estes Termos de Uso a qualquer momento, a seu exclusivo critério. Quaisquer alterações entrarão em vigor imediatamente após a sua publicação na página da extensão na Chrome Web Store. Seu uso continuado da extensão após a publicação das alterações constitui sua aceitação dos Termos modificados.",
    ],
  },
  {
    number: "10",
    title: "Rescisão",
    paragraphs: [
      "Estes Termos de Uso permanecerão em pleno vigor e efeito enquanto você utilizar a extensão \"Voice\". O Desenvolvedor pode rescindir estes Termos de Uso e sua licença a qualquer momento, sem aviso prévio, se você violar qualquer disposição destes Termos. Você pode rescindir sua aceitação a estes Termos a qualquer momento, desinstalando a extensão.",
    ],
  },
  {
    number: "11",
    title: "Disposições Gerais",
    groups: [
      {
        title: "Lei Aplicável e Foro",
        text: "Estes Termos de Uso serão regidos e interpretados de acordo com as leis da República Federativa do Brasil. Fica eleito o foro da comarca de Sinop - MT para dirimir quaisquer dúvidas ou litígios decorrentes destes Termos, renunciando a qualquer outro, por mais privilegiado que seja.",
      },
      {
        title: "Integralidade do Acordo",
        text: "Estes Termos de Uso, juntamente com a Política de Privacidade da extensão \"Voice\", constituem o acordo integral entre você e o Desenvolvedor em relação ao uso da extensão.",
      },
      {
        title: "Divisibilidade",
        text: "Se qualquer disposição destes Termos for considerada inválida ou inexequível por um tribunal de jurisdição competente, as demais disposições destes Termos permanecerão em pleno vigor e efeito.",
      },
    ],
  },
];

export default function Terms() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-neutral-50 via-white to-neutral-100">
      {/* Hero */}
      <section className="from-primary relative overflow-hidden bg-gradient-to-br to-black">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-20%] -left-[10%] h-[30rem] w-[30rem] rounded-full bg-white/10 blur-[120px]" />
          <div className="absolute -right-[10%] bottom-[-30%] h-[30rem] w-[30rem] rounded-full bg-black/40 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-8 px-6 pt-8 pb-16 sm:px-8 md:pb-24">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>
            <Image
              src="/logos/logo-dark.png"
              alt="EX Voice"
              width={600}
              height={200}
              className="h-10 w-auto object-contain sm:h-12"
              priority
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm">
              <Gavel className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              Termos de Uso
            </h1>
            <p className="max-w-2xl text-sm text-gray-200 sm:text-base">
              Bem-vindo(a) à extensão &quot;Voice&quot;. Ao instalar, acessar
              ou utilizar a extensão, você concorda em cumprir e estar
              vinculado(a) aos Termos de Uso aqui apresentados.
            </p>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs text-gray-100 backdrop-blur-sm">
              <span className="font-semibold">Última atualização:</span>
              <span>20 de abril de 2026</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="relative z-10 -mt-10 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl shadow-black/5 sm:p-10 md:p-14"
          >
            <p className="text-base leading-relaxed text-neutral-700 italic">
              Bem-vindo(a) à extensão &quot;Voice&quot;, uma ferramenta
              projetada para auxiliar na sua produtividade e organização
              pessoal no navegador Google Chrome. Ao instalar, acessar ou
              utilizar a extensão &quot;Voice&quot;, você concorda em cumprir
              e estar vinculado(a) aos Termos de Uso aqui apresentados. Caso
              não concorde com estes Termos, por favor, não instale ou utilize
              a extensão.
            </p>

            <div className="mt-10 flex flex-col gap-10">
              {sections.map((section) => (
                <div key={section.number} className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="from-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br to-black text-sm font-bold text-white">
                      {section.number}
                    </div>
                    <h2 className="text-lg font-bold text-neutral-900 sm:text-xl">
                      {section.title}
                    </h2>
                  </div>

                  {section.paragraphs?.map((p, i) => (
                    <p
                      key={i}
                      className="text-sm leading-relaxed text-neutral-700 sm:text-base"
                    >
                      {p}
                    </p>
                  ))}

                  {section.list && (
                    <ul className="flex list-disc flex-col gap-2 pl-6 text-sm text-neutral-700 sm:text-base">
                      {section.list.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.groups && (
                    <div className="flex flex-col gap-3 pl-2 sm:pl-4">
                      {section.groups.map((group) => (
                        <div
                          key={group.title}
                          className="border-primary/40 rounded-xl border-l-2 bg-neutral-50/80 px-4 py-3"
                        >
                          <h3 className="text-sm font-semibold text-neutral-900 sm:text-base">
                            {group.title}
                          </h3>
                          <p className="mt-1 text-sm leading-relaxed text-neutral-700">
                            {group.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* 12. Contato */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="from-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br to-black text-sm font-bold text-white">
                    12
                  </div>
                  <h2 className="text-lg font-bold text-neutral-900 sm:text-xl">
                    Contato
                  </h2>
                </div>
                <p className="text-sm leading-relaxed text-neutral-700 sm:text-base">
                  Para quaisquer dúvidas ou preocupações relacionadas a estes
                  Termos de Uso, entre em contato conosco através dos
                  seguintes canais:
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <a
                    href="mailto:suporte@executivosdigital.com.br"
                    className="hover:border-primary/40 flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 transition"
                  >
                    <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-neutral-500">E-mail</span>
                      <span className="text-sm font-semibold text-neutral-900">
                        suporte.executivosdigital.com.br
                      </span>
                    </div>
                  </a>
                  <a
                    href="https://www.executivosdigital.com.br"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:border-primary/40 flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 transition"
                  >
                    <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-neutral-500">Website</span>
                      <span className="text-sm font-semibold text-neutral-900">
                        executivosdigital.com.br
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Rodapé de navegação */}
            <div className="mt-12 flex flex-col items-center gap-4 border-t border-neutral-200 pt-8 sm:flex-row sm:justify-between">
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <ShieldCheck className="h-3.5 w-3.5" />
                Acordo entre você e o Desenvolvedor.
              </div>
              <Link
                href="/privacy"
                className="text-primary hover:text-primary/80 inline-flex items-center gap-2 text-sm font-semibold transition"
              >
                <FileText className="h-4 w-4" />
                Ver Política de Privacidade
              </Link>
            </div>
          </motion.div>

          <p className="mt-8 text-center text-xs text-neutral-500">
            © {new Date().getFullYear()} Executivos Digital Software House.
            Todos os direitos reservados.
          </p>
        </div>
      </section>
    </div>
  );
}
