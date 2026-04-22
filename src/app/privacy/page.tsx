"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  Lock,
  Mail,
  ShieldCheck,
  Globe,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const sections = [
  {
    number: "1",
    title: "Sobre a Extensão \"Voice\"",
    paragraphs: [
      "A extensão \"Voice\" é uma ferramenta desenvolvida para permitir que você grave e, posteriormente, acesse as suas próprias interações e atividades dentro do seu navegador Chrome. O objetivo é fornecer um recurso de anotações e revisão pessoal, sem qualquer intenção de monitoramento externo ou compartilhamento de dados com terceiros.",
    ],
  },
  {
    number: "2",
    title: "Coleta de Informações",
    paragraphs: [
      "A extensão \"Voice\" opera com um princípio fundamental de privacidade do usuário.",
    ],
    groups: [
      {
        title: "Informações de Uso Pessoal e Local",
        text: "A principal funcionalidade da extensão envolve a gravação de áudio e/ou tela do seu próprio ambiente de navegação. Esta coleta é realizada somente com o seu consentimento explícito e ativo a cada sessão de gravação. Todas as informações capturadas (áudio, vídeo, texto ou metadados de sessão) são processadas e armazenadas localmente no seu dispositivo por meio da API chrome.storage.local ou chrome.storage.sync (conforme a arquitetura que permite acesso apenas ao usuário).",
      },
      {
        title: "Dados de Uso Anônimos e Agregados (Opcional)",
        text: "Para fins de aprimoramento da extensão e detecção de bugs, podemos coletar dados de uso anônimos e agregados que não identificam você pessoalmente. Estes dados podem incluir informações sobre o desempenho da extensão, funcionalidades mais utilizadas e erros técnicos (ex: número de vezes que a extensão é aberta, duração média de uso, cliques em determinados botões). Esta coleta é realizada de forma a impossibilitar a sua identificação e tem como único propósito a melhoria contínua do serviço.",
      },
      {
        title: "Permissões da Extensão",
        text: "A extensão \"Voice\" solicitará as permissões mínimas necessárias para operar suas funcionalidades, tais como:",
        list: [
          "Acesso a dispositivos de áudio e/ou vídeo (microfone, câmera) para gravação.",
          "Acesso ao conteúdo da tela ou abas ativas para gravação de vídeo.",
          "Acesso ao chrome.storage para armazenar suas gravações e configurações. Estas permissões são solicitadas no momento da instalação e usadas estritamente para os propósitos descritos.",
        ],
      },
    ],
  },
  {
    number: "3",
    title: "Finalidade do Uso das Informações",
    paragraphs: [
      "As informações coletadas pela extensão \"Voice\" são utilizadas exclusivamente para os seguintes propósitos:",
    ],
    groups: [
      {
        title: "Gravação e Armazenamento para Acesso Pessoal",
        text: "Permitir que você grave suas interações e as armazene de forma segura para acesso e revisão futura.",
      },
      {
        title: "Aprimoramento da Experiência do Usuário",
        text: "Utilizar dados anônimos e agregados para compreender como a extensão é utilizada e como podemos torná-la mais eficiente, intuitiva e livre de erros.",
      },
      {
        title: "Manutenção e Suporte Técnico",
        text: "Ajudar a diagnosticar e resolver problemas técnicos.",
      },
    ],
  },
  {
    number: "4",
    title: "Compartilhamento e Acesso de Dados",
    paragraphs: [
      "Nós não vendemos, alugamos, trocamos ou compartilhamos suas gravações ou quaisquer dados de identificação pessoal com terceiros.",
    ],
    groups: [
      {
        title: "Dados Criptografados e Acesso Exclusivo",
        text: "Todas as gravações e as informações geradas pela extensão \"Voice\" são criptografadas e armazenadas de forma que apenas você – o usuário – tenha acesso a elas em seu próprio dispositivo. Não há servidores externos ou bancos de dados sob nosso controle que armazenem suas gravações pessoais. A criptografia é implementada para garantir que, mesmo em caso de acesso físico ao seu dispositivo, as informações não sejam facilmente decifráveis sem a sua autorização.",
      },
      {
        title: "Situações Excepcionais (Não Aplicável a Gravações Pessoais)",
        text: "O único cenário em que informações não-pessoais e não-identificáveis (como dados de uso anônimos e agregados) poderiam ser divulgadas seria:",
        list: [
          "Se exigido por lei ou ordem judicial válida (sempre buscando proteger a privacidade do usuário ao máximo e informá-lo, se legalmente permitido).",
          "Para proteção de nossos direitos legais e segurança da extensão, quando não envolver dados pessoais do usuário.",
          "Em caso de fusão, aquisição ou venda de ativos, as informações anônimas e agregadas poderiam ser transferidas, mantendo-se o compromisso de não-identificação pessoal.",
        ],
      },
    ],
  },
  {
    number: "5",
    title: "Segurança e Armazenamento",
    paragraphs: ["A segurança dos seus dados é primordial."],
    groups: [
      {
        title: "Armazenamento Local e Criptografia",
        text: "As suas gravações são armazenadas no seu navegador Chrome através do chrome.storage.local ou chrome.storage.sync, utilizando as proteções de segurança inerentes ao ambiente do navegador. Adicionalmente, implementamos criptografia robusta nos dados de gravação antes de serem armazenados, garantindo que seu conteúdo seja protegido mesmo que o arquivo local seja acessado indevidamente.",
      },
      {
        title: "Nenhum Servidor Externo para suas Gravações",
        text: "É fundamental reforçar que a extensão \"Voice\" não envia suas gravações ou qualquer dado pessoal de uso para servidores externos controlados por nós ou por terceiros. Todo o processamento e armazenamento das suas gravações ocorre diretamente no seu dispositivo.",
      },
    ],
  },
  {
    number: "6",
    title: "Seus Direitos e Controle",
    paragraphs: [
      "Você possui total controle sobre suas informações e a extensão \"Voice\".",
    ],
    groups: [
      {
        title: "Acesso e Gerenciamento",
        text: "Você pode acessar, reproduzir e gerenciar suas gravações diretamente na interface da extensão \"Voice\".",
      },
      {
        title: "Exclusão de Dados",
        text: "Você pode excluir suas gravações a qualquer momento através das funcionalidades da extensão. A desinstalação da extensão removerá automaticamente todas as gravações e dados associados armazenados localmente.",
      },
      {
        title: "Retirada de Consentimento e Desinstalação",
        text: "Você pode revogar as permissões concedidas à extensão a qualquer momento através das configurações do Chrome. A desinstalação da extensão interromperá imediatamente qualquer coleta de dados e removerá os dados locais associados a ela.",
      },
    ],
  },
  {
    number: "7",
    title: "Alterações a Esta Política de Privacidade",
    paragraphs: [
      "Podemos atualizar esta Política de Privacidade periodicamente para refletir mudanças em nossas práticas ou regulamentações legais. Notificaremos sobre quaisquer alterações significativas publicando a nova política na página da extensão na Chrome Web Store e atualizando a data da \"Última atualização\". Recomendamos que você revise esta política regularmente.",
    ],
  },
];

export default function Privacy() {
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
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              Política de Privacidade
            </h1>
            <p className="max-w-2xl text-sm text-gray-200 sm:text-base">
              Como a extensão &quot;Voice&quot; coleta, utiliza, protege e
              gerencia as informações do usuário, com o compromisso de garantir
              que todos os dados permaneçam sob seu exclusivo controle e acesso.
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
              Nós, &quot;Executivos Digital Software House&quot;, levamos a sua
              privacidade muito a sério. Esta Política de Privacidade descreve
              como a extensão &quot;Voice&quot; coleta, utiliza, protege e
              gerencia as informações do usuário, com o compromisso de garantir
              que todos os dados permaneçam sob seu exclusivo controle e
              acesso.
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
                          {group.list && (
                            <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-sm text-neutral-700">
                              {group.list.map((item, idx) => (
                                <li key={idx} className="leading-relaxed">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* 8. Contato */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="from-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br to-black text-sm font-bold text-white">
                    8
                  </div>
                  <h2 className="text-lg font-bold text-neutral-900 sm:text-xl">
                    Contato
                  </h2>
                </div>
                <p className="text-sm leading-relaxed text-neutral-700 sm:text-base">
                  Se você tiver dúvidas sobre esta Política de Privacidade ou
                  sobre as práticas da extensão &quot;Voice&quot;, entre em
                  contato conosco pelos seguintes canais:
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
                <Lock className="h-3.5 w-3.5" />
                Seus dados, seu controle.
              </div>
              <Link
                href="/terms"
                className="text-primary hover:text-primary/80 inline-flex items-center gap-2 text-sm font-semibold transition"
              >
                <FileText className="h-4 w-4" />
                Ver Termos de Uso
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
