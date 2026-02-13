"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/blocks/dialog";
import Image from "next/image";

const TERMS_CONTENT = (
  <>
    <p className="mb-4 leading-relaxed text-gray-700">
      Estes Termos de Uso (&quot;Termos&quot;) regem o acesso e a utilização do
      aplicativo &quot;EX Voice&quot; (&quot;Aplicativo&quot;), desenvolvido
      pela Executivo&apos;s Digital, disponível para dispositivos móveis. Ao
      acessar, instalar, utilizar ou se cadastrar no Aplicativo, o usuário
      (&quot;Usuário&quot;) DECLARA TER LIDO, ENTENDIDO E CONCORDADO COM ESTES
      TERMOS DE USO. Caso não concorde com qualquer disposição destes Termos, o
      Usuário não deverá utilizar o Aplicativo.
    </p>

    <h3 className="mt-6 mb-2 font-semibold text-gray-900">
      1. SOBRE O EX VOICE
    </h3>
    <p className="mb-2 leading-relaxed text-gray-700">
      1.1. O EX Voice é um aplicativo desenvolvido para auxiliar empresários e
      outros profissionais na gravação, transcrição e gestão de
      informações provenientes de reuniões e interações
      profissionais. Sua principal funcionalidade é a gravação de áudios com
      identificação dos interlocutores (limitado a 2 pessoas para a IA
      proprietária, conforme o plano contratado), transcrição automática do
      conteúdo falado e organização dessas informações.
    </p>
    <p className="mb-2 leading-relaxed text-gray-700">
      1.2. Além das funcionalidades de gravação e transcrição, o Aplicativo
      permite ao Usuário:
    </p>
    <ul className="mb-2 list-disc space-y-1 pl-6 text-gray-700">
      <li>
        Registrar lembretes e anotações diversas (incluindo anotações de
        estudo);
      </li>
      <li>
        Receber notificações de lembretes em horários previamente definidos.
      </li>
    </ul>
    <p className="mb-4 leading-relaxed text-gray-700">
      1.3. O EX Voice é uma ferramenta de apoio administrativo, visando
      otimizar a organização e a gestão da informação, não substituindo, em
      hipótese alguma qualquer outro registro oficial,
      nem o discernimento profissional do Usuário.
    </p>

    <h3 className="mt-6 mb-2 font-semibold text-gray-900">
      2. CADASTRO E ACESSO AO APLICATIVO
    </h3>
    <p className="mb-2 leading-relaxed text-gray-700">
      2.1. Para utilizar o Aplicativo e suas funcionalidades, o Usuário deverá
      realizar um cadastro, fornecendo informações verdadeiras, precisas,
      completas e atualizadas, conforme solicitado.
    </p>
    <p className="mb-2 leading-relaxed text-gray-700">
      2.2. O Usuário é o único responsável pela guarda e sigilo de seu login e
      senha, e deverá notificar imediatamente a Executivo&apos;s Digital em caso
      de qualquer uso não autorizado de sua conta ou quebra de segurança.
    </p>
    <p className="mb-4 leading-relaxed text-gray-700">
      2.3. A Executivo&apos;s Digital não se responsabiliza por perdas e danos
      decorrentes do não cumprimento do disposto nesta seção.
    </p>

    <h3 className="mt-6 mb-2 font-semibold text-gray-900">
      3. PLANOS DE SERVIÇO E COBRANÇA
    </h3>
    <p className="mb-2 leading-relaxed text-gray-700">
      3.1. O EX Voice oferece diferentes planos de serviço, que podem
      incluir funcionalidades e limites de uso distintos. Os planos atualmente
      disponíveis são:
    </p>
    <p className="mb-2 leading-relaxed text-gray-700">
      3.2. As condições específicas de cada plano, incluindo preços, período de
      cobrança, métodos de pagamento e políticas de renovação, serão detalhadas
      no momento da contratação ou por meio de comunicações específicas
      realizadas pela Executivo&apos;s Digital.
    </p>
    <p className="mb-2 leading-relaxed text-gray-700">
      3.3. O cancelamento de qualquer plano deverá seguir o procedimento
      informado no próprio Aplicativo ou em nosso canal de suporte. O
      cancelamento poderá acarretar na perda de acesso às funcionalidades pagas
      e/ou redução dos limites de uso, ao final do período de cobrança pago.
    </p>
    <p className="mb-4 leading-relaxed text-gray-700">
      3.4. A Executivo&apos;s Digital reserva-se o direito de alterar os preços
      dos planos ou introduzir novas cobranças, mediante comunicação prévia aos
      Usuários, com antecedência mínima de 30 (trinta) dias. O uso contínuo do
      serviço após essa comunicação implicará na aceitação dos novos valores.
    </p>

    <h3 className="mt-6 mb-2 font-semibold text-gray-900">
      4. USO ADEQUADO DO APLICATIVO E RESPONSABILIDADES DO USUÁRIO
    </h3>
    <p className="mb-2 leading-relaxed text-gray-700">
      4.1. O Usuário compromete-se a utilizar o EX Voice de forma ética e em
      conformidade com a legislação brasileira, especialmente a Lei Geral de
      Proteção de Dados Pessoais (LGPD), o Código de Ética Médica e quaisquer
      outras normas aplicáveis à sua profissão.
    </p>
    <p className="mb-2 leading-relaxed text-gray-700">
      4.2. Responsabilidade pela Obtenção de Consentimento: O Usuário é o ÚNICO
      E EXCLUSIVO RESPONSÁVEL pela obtenção do consentimento de todos os
      interlocutores para a gravação, armazenamento e transcrição de áudios por
      meio do Aplicativo. A Executivo&apos;s Digital NÃO SE RESPONSABILIZA por
      qualquer uso indevido do Aplicativo ou pela falha do Usuário em coletar os
      consentimentos necessários, sendo o Usuário o único responsável por
      eventuais sanções legais ou éticas decorrentes de tal conduta.
    </p>
    <p className="mb-2 leading-relaxed text-gray-700">
      4.3. O Usuário se compromete a não:
    </p>
    <ul className="mb-2 list-disc space-y-1 pl-6 text-gray-700">
      <li>
        Utilizar o Aplicativo para fins ilegais, fraudulentos ou não
        autorizados;
      </li>
      <li>
        Compartilhar, distribuir, replicar ou comercializar o conteúdo gerado
        pelo Aplicativo sem a devida autorização e/ou consentimento das partes
        envolvidas;
      </li>
      <li>
        Violar ou tentar violar a segurança do Aplicativo, incluindo, mas não se
        limitando a, acesso não autorizado a sistemas, dados ou contas;
      </li>
      <li>
        Modificar, adaptar, traduzir, fazer engenharia reversa, descompilar,
        desmontar ou tentar extrair o código-fonte do Aplicativo;
      </li>
      <li>
        Inserir vírus, cavalos de Troia, worms ou qualquer outro código
        malicioso que possa danificar, interferir, interceptar ou expropriar
        qualquer sistema, dado ou informação.
      </li>
    </ul>
    <p className="mb-4 leading-relaxed text-gray-700">
      4.4. O Usuário reconhece que o EX Voice é uma ferramenta de suporte e
      que a verificação da precisão das transcrições, a categorização e a
      interpretação das informações geradas são de sua exclusiva
      responsabilidade profissional. A Executivo&apos;s Digital não garante a
      exatidão, completude ou infalibilidade das transcrições automáticas ou da
      identificação de interlocutores, as quais devem ser sempre revisadas e
      validadas pelo Usuário.
    </p>

    <h3 className="mt-6 mb-2 font-semibold text-gray-900">
      5. PROPRIEDADE INTELECTUAL
    </h3>
    <p className="mb-2 leading-relaxed text-gray-700">
      5.1. Todos os direitos de propriedade intelectual relativos ao Aplicativo
      EX Voice, incluindo, mas não se limitando a, software, código-fonte,
      design, logotipos, marcas, imagens e textos, são de propriedade exclusiva
      da Executivo&apos;s Digital.
    </p>
    <p className="mb-2 leading-relaxed text-gray-700">
      5.2. Estes Termos concedem ao Usuário uma licença limitada, não exclusiva,
      intransferível e revogável para acessar e utilizar o Aplicativo para fins
      profissionais e pessoais, nos termos aqui estabelecidos. Nenhuma outra
      licença ou direito é concedido implicitamente.
    </p>
    <p className="mb-4 leading-relaxed text-gray-700">
      5.3. O conteúdo gerado pelo Usuário (áudios, transcrições, anotações) é de
      sua propriedade, sendo de sua exclusiva responsabilidade o armazenamento,
      uso e gestão desses dados.
    </p>

    <h3 className="mt-6 mb-2 font-semibold text-gray-900">
      6. PROTEÇÃO DE DADOS PESSOAIS E PRIVACIDADE (LGPD)
    </h3>
    <p className="mb-2 leading-relaxed text-gray-700">
      6.1. A Executivo&apos;s Digital está comprometida com a proteção da
      privacidade e dos dados pessoais de seus Usuários, em conformidade com a
      Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 – LGPD).
    </p>
    <p className="mb-2 leading-relaxed text-gray-700">
      6.2. NÃO HÁ ARMAZENAMENTO OU USO PARA TREINAMENTO: A Executivo&apos;s
      Digital ESCLARECE E GARANTE que os dados de áudio e as transcrições
      geradas pelo Usuário DENTRO DO APLICATIVO EX VOICE NÃO SÃO SALVOS em
      seus servidores para fins de treinamento da IA, comercialização ou
      qualquer outra finalidade que não seja o uso exclusivo do próprio Usuário,
      dentro do ambiente do aplicativo. O processamento dos dados para
      transcrição ocorre de forma segura e efetiva, sem retenção permanente pela
      Executivo&apos;s Digital.
    </p>
    <p className="mb-2 leading-relaxed text-gray-700">
      6.3. As informações pessoais coletadas no cadastro do Usuário (nome,
      e-mail, etc.) são utilizadas exclusivamente para a gestão da conta,
      comunicação sobre o serviço, suporte técnico e cumprimento de obrigações
      legais, conforme detalhado em nossa Política de Privacidade.
    </p>
    <p className="mb-2 leading-relaxed text-gray-700">
      6.4. Os dados sensíveis (informações de saúde) contidos nos áudios e
      transcrições são processados exclusivamente no ambiente do Usuário e sob a
      sua gestão, sendo o Usuário o Controlador de Dados responsável por sua
      coleta, tratamento e guarda, nos termos da LGPD. A Executivo&apos;s
      Digital atua como Operador, fornecendo a ferramenta de processamento, mas
      sem acesso ou armazenamento permanente desses dados.
    </p>
    <p className="mb-4 leading-relaxed text-gray-700">
      6.5. A Executivo&apos;s Digital implementa medidas de segurança técnicas e
      administrativas para proteger os dados pessoais contra acesso, alteração,
      divulgação ou destruição não autorizados.
    </p>

    <h3 className="mt-6 mb-2 font-semibold text-gray-900">
      7. LIMITAÇÃO DE RESPONSABILIDADE
    </h3>
    <p className="mb-2 leading-relaxed text-gray-700">
      7.1. O EX Voice é fornecido &quot;no estado em que se encontra&quot; e
      &quot;conforme disponível&quot;. A Executivo&apos;s Digital não oferece
      garantias de qualquer tipo, expressas ou implícitas, sobre a adequação,
      confiabilidade, disponibilidade, atualidade, precisão ou ausência de erros
      do Aplicativo ou de seus conteúdos.
    </p>
    <p className="mb-2 leading-relaxed text-gray-700">
      7.2. A Executivo&apos;s Digital não será responsável por quaisquer perdas
      ou danos diretos, indiretos, incidentais, especiais, punitivos ou
      consequenciais, incluindo, mas não se limitando a, lucros cessantes, perda
      de dados ou interrupção de negócios, decorrentes do uso ou da incapacidade
      de usar o Aplicativo, mesmo que tenha sido avisada da possibilidade de
      tais danos.
    </p>
    <p className="mb-2 leading-relaxed text-gray-700">
      7.3. Em nenhum caso a responsabilidade total da Executivo&apos;s Digital,
      por todos os danos, perdas e causas de ação, excederá o valor total pago
      pelo Usuário pelo uso do Aplicativo nos últimos 12 (doze) meses anteriores
      à data do evento danoso.
    </p>
    <p className="mb-4 leading-relaxed text-gray-700">
      7.4. O Usuário assume total responsabilidade por quaisquer resultados
      obtidos a partir do uso do Aplicativo, incluindo decisões profissionais
      tomadas com base nas informações geradas, sendo sua a obrigação de
      verificação e validação de todo e qualquer dado.
    </p>

    <h3 className="mt-6 mb-2 font-semibold text-gray-900">8. RESCISÃO</h3>
    <p className="mb-2 leading-relaxed text-gray-700">
      8.1. A Executivo&apos;s Digital poderá, a seu exclusivo critério,
      suspender ou encerrar o acesso do Usuário ao Aplicativo, total ou
      parcialmente, a qualquer momento e por qualquer motivo, com ou sem aviso
      prévio, caso identifique violação destes Termos de Uso ou suspeita de
      atividades fraudulentas ou ilegais.
    </p>
    <p className="mb-2 leading-relaxed text-gray-700">
      8.2. O Usuário poderá rescindir sua conta a qualquer momento, seguindo as
      instruções fornecidas no Aplicativo.
    </p>
    <p className="mb-4 leading-relaxed text-gray-700">
      8.3. Em caso de rescisão, as disposições destes Termos que, por sua
      natureza, deverão sobreviver, permanecerão em pleno vigor e efeito.
    </p>

    <h3 className="mt-6 mb-2 font-semibold text-gray-900">
      9. DISPOSIÇÕES GERAIS
    </h3>
    <p className="mb-2 leading-relaxed text-gray-700">
      9.1. Modificações: A Executivo&apos;s Digital reserva-se o direito de
      modificar estes Termos a qualquer momento. As modificações entrarão em
      vigor imediatamente após sua publicação no Aplicativo ou no site oficial.
      O uso contínuo do Aplicativo após a publicação das alterações constituirá
      aceitação dos Termos revisados.
    </p>
    <p className="mb-2 leading-relaxed text-gray-700">
      9.2. Cessão: O Usuário não poderá ceder ou transferir estes Termos, no
      todo ou em parte, sem o consentimento prévio por escrito da
      Executivo&apos;s Digital.
    </p>
    <p className="mb-2 leading-relaxed text-gray-700">
      9.3. Comunicação: Todas as comunicações relacionadas a estes Termos ou ao
      Aplicativo deverão ser realizadas através dos canais de suporte indicados
      no Aplicativo ou no site da Executivo&apos;s Digital.
    </p>
    <p className="mb-4 leading-relaxed text-gray-700">
      9.4. Legislação Aplicável e Foro: Estes Termos serão regidos e
      interpretados de acordo com a legislação brasileira. As partes elegem o
      foro da Comarca Sinop - MT para dirimir quaisquer controvérsias
      decorrentes destes Termos, renunciando a qualquer outro, por mais
      privilegiado que seja.
    </p>

    <h3 className="mt-6 mb-2 font-semibold text-gray-900">10. CONTATO</h3>
    <p className="mb-4 leading-relaxed text-gray-700">
      Em caso de dúvidas sobre estes Termos de Uso, entre em contato com a
      Executivo&apos;s Digital através do e-mail [INSERIR E-MAIL DE SUPORTE] ou
      pelo canal de suporte disponível no Aplicativo.
    </p>
  </>
);

interface TermsOfUseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TermsOfUseModal({ open, onOpenChange }: TermsOfUseModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-full max-w-2xl flex-col gap-0 overflow-hidden border-0 bg-white p-0 shadow-xl sm:rounded-2xl">
        <DialogHeader className="shrink-0 border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white px-6 py-5">
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/logos/logo-dark.png"
              alt="EX Voice"
              width={180}
              height={54}
              className="h-11 w-auto object-contain"
            />
            <DialogTitle className="text-center text-lg font-semibold text-gray-900">
              Termos de Uso – EX Voice
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 py-5 text-sm">
          {TERMS_CONTENT}
        </div>
      </DialogContent>
    </Dialog>
  );
}
