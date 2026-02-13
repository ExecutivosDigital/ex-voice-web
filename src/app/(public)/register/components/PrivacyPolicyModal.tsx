"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/blocks/dialog";
import Image from "next/image";

const PRIVACY_CONTENT = (
  <>
    <p className="mb-4 leading-relaxed text-gray-700">
      Esta Política de Privacidade descreve como a Executivo&apos;s Digital
      (&quot;Nós&quot;, &quot;Nosso&quot;, &quot;Nossa&quot;), desenvolvedora do
      aplicativo &quot;EX Voice&quot; (&quot;Aplicativo&quot;), coleta,
      utiliza, armazena, protege e, em raras ocasiões, compartilha suas
      informações pessoais, bem como a forma como você, Usuário
      (&quot;Você&quot;, &quot;Seu&quot;, &quot;Sua&quot;), pode exercer seus
      direitos como titular de dados sob a Lei Geral de Proteção de Dados
      Pessoais (Lei nº 13.709/2018 – LGPD) e outras legislações aplicáveis.
    </p>
    <p className="mb-4 leading-relaxed text-gray-700">
      A presente Política deve ser lida em conjunto com os Termos de Uso do
      EX Voice. Ao utilizar o Aplicativo, você concorda com as práticas
      descritas nesta Política de Privacidade.
    </p>

    <h3 className="mt-6 mb-2 font-semibold text-gray-900">
      1. NOSSO COMPROMISSO COM SUA PRIVACIDADE E A LGPD
    </h3>
    <p className="mb-4 leading-relaxed text-gray-700">
      A Executivo&apos;s Digital está profundamente comprometida com a proteção
      da sua privacidade e de seus dados pessoais. Desenvolvemos o EX Voice
      com a privacidade em mente (Privacy by Design), implementando medidas
      técnicas e organizacionais rigorosas para garantir a segurança e a
      conformidade com a LGPD e o Código de Ética Médica.
    </p>

    <h3 className="mt-6 mb-2 font-semibold text-gray-900">
      2. QUAIS DADOS COLETAMOS E PARA QUAIS FINALIDADES?
    </h3>
    <p className="mb-2 leading-relaxed text-gray-700">
      A coleta de dados pelo EX Voice se divide em duas categorias
      principais: Dados de Cadastro e Uso da Plataforma (tratados por nós como
      Controlador) e Conteúdo Gerado pelo Usuário (no qual atuamos como Operador
      para o Usuário, que é o Controlador).
    </p>

    <h4 className="mt-4 mb-2 font-medium text-gray-900">
      2.1. Dados de Cadastro e Uso da Plataforma (Dados Pessoais Comuns)
    </h4>
    <p className="mb-2 leading-relaxed text-gray-700">
      Estes são os dados que você nos fornece diretamente para criar e gerenciar
      sua conta, bem como informações sobre como você interage com o Aplicativo.
    </p>
    <p className="mb-2 leading-relaxed text-gray-700">
      <strong>Identificação e Contato:</strong>
    </p>
    <ul className="mb-2 list-disc space-y-1 pl-6 text-gray-700">
      <li>
        <strong>Dados:</strong> Nome completo, e-mail, telefone (opcional).
      </li>
      <li>
        <strong>Finalidade:</strong> Para criar e gerenciar sua conta de
        usuário, autenticar seu acesso, enviar comunicações importantes
        relacionadas ao serviço, suporte técnico, cobrança de planos e
        cumprimento de obrigações legais e regulatórias.
      </li>
      <li>
        <strong>Base Legal LGPD:</strong> Execução de contrato ou de
        procedimentos preliminares relacionados a contrato (Art. 7º, V) e
        Cumprimento de obrigação legal ou regulatória (Art. 7º, II).
      </li>
    </ul>
    <p className="mb-2 leading-relaxed text-gray-700">
      <strong>Dados de Pagamento:</strong>
    </p>
    <ul className="mb-2 list-disc space-y-1 pl-6 text-gray-700">
      <li>
        <strong>Dados:</strong> Informações necessárias para processamento de
        pagamentos (ex: dados de cartão de crédito, informações de conta
        bancária, a depender do método escolhido). Importante: Estes dados são
        geralmente processados por gateways de pagamento terceirizados e não são
        armazenados integralmente por nós.
      </li>
      <li>
        <strong>Finalidade:</strong> Para processar a assinatura dos planos de
        serviço e gerenciar as transações financeiras.
      </li>
      <li>
        <strong>Base Legal LGPD:</strong> Execução de contrato (Art. 7º, V).
      </li>
    </ul>
    <p className="mb-2 leading-relaxed text-gray-700">
      <strong>Dados de Uso e Interação:</strong>
    </p>
    <ul className="mb-2 list-disc space-y-1 pl-6 text-gray-700">
      <li>
        <strong>Dados:</strong> Informações sobre como você utiliza o aplicativo
        (ex: recursos acessados, tempo de uso, informações de dispositivos,
        sistema operacional, versão do app).
      </li>
      <li>
        <strong>Finalidade:</strong> Para melhorar a funcionalidade do
        Aplicativo, identificar e corrigir erros, entender padrões de uso para
        aprimorar a experiência do Usuário, e garantir a segurança e o
        desempenho do serviço.
      </li>
      <li>
        <strong>Base Legal LGPD:</strong> Legítimo interesse (Art. 7º, IX) e
        Execução de contrato (Art. 7º, V).
      </li>
    </ul>

    <h4 className="mt-4 mb-2 font-medium text-gray-900">
      2.2. Conteúdo Gerado pelo Usuário (Dados Pessoais Sensíveis – Saúde)
    </h4>
    <p className="mb-2 leading-relaxed text-gray-700">
      Esta categoria refere-se aos áudios de reuniões, transcrições e anotações
      gravadas e geradas por você dentro do Aplicativo.
    </p>
    <p className="mb-2 leading-relaxed text-gray-700">
      <strong>Dados:</strong>
    </p>
    <ul className="mb-2 list-disc space-y-1 pl-6 text-gray-700">
      <li>
        Áudios de reuniões: Gravações de voz de interações profissionais
        (médico-paciente, reuniões etc.).
      </li>
      <li>
        Transcrições de Áudio: Texto gerado a partir do processamento dos
        áudios.
      </li>
      <li>
        Anotações e Lembretes: Textos inseridos pelo Usuário para fins de
        organização, estudo ou lembretes.
      </li>
      <li>
        Identificação de Interlocutores: Nomes ou perfis associados às vozes
        identificadas pela IA (limitado a 2 pessoas para a IA proprietária,
        conforme o plano contratado).
      </li>
    </ul>
    <p className="mb-2 leading-relaxed text-gray-700">
      <strong>Finalidade:</strong> A única finalidade para a qual o EX Voice
      processa este tipo de dado é para prover a funcionalidade de gravação,
      transcrição e organização conforme as instruções e comandos do Usuário.
    </p>
    <p className="mb-2 leading-relaxed text-gray-700">
      <strong>Base Legal LGPD:</strong>
    </p>
    <p className="mb-2 leading-relaxed text-gray-700">
      Para o Usuário (Controlador): O Usuário, na qualidade de profissional de
      saúde ou responsável pela interação, é o Controlador dos dados contidos
      nos áudios, transcrições e anotações. Ele é EXCLUSIVAMENTE responsável por
      obter o CONSENTIMENTO explícito e informado dos titulares dos dados
      (pacientes e/ou demais interlocutores) para a gravação, armazenamento e
      tratamento desses dados de saúde, conforme o Art. 11, I da LGPD. Além
      disso, outras bases legais para tratamento de dados sensíveis, como o Art.
      11, II, alínea &quot;f&quot; (proteção da vida ou incolumidade física do
      titular ou de terceiro), ou &quot;g&quot; (garantia da prevenção à fraude
      e à segurança do titular), sob as condições ali estabelecidas, podem ser
      aplicáveis à sua prática profissional.
    </p>
    <p className="mb-2 leading-relaxed text-gray-700">
      Para a Executivo&apos;s Digital (Operador): Atuamos estritamente como
      Operador destes dados. Nosso tratamento se baseia na EXECUÇÃO DO CONTRATO
      DE PRESTAÇÃO DE SERVIÇOS com o Usuário. Agimos sob as instruções do
      Usuário, que delegou a operacionalização do tratamento de dados de saúde à
      nossa plataforma. A Executivo&apos;s Digital não toma decisões sobre o
      tratamento desses dados sensíveis nem os utiliza para finalidades
      distintas das estabelecidas por seus Usuários.
    </p>
    <p className="mb-4 leading-relaxed text-gray-700">
      <strong>Importante:</strong> A Executivo&apos;s Digital NÃO ARMAZENA DE
      FORMA PERMANENTE os áudios e suas transcrições em seus servidores. O
      processamento para gerar a transcrição ocorre de forma segura, efêmera e
      criptografada, diretamente vinculada à sessão do usuário e às
      funcionalidades solicitadas, sem retenção permanente pela Executivo&apos;s
      Digital.
    </p>

    <h4 className="mt-4 mb-2 font-medium text-gray-900">
      2.3. Dados de Localização:
    </h4>
    <p className="mb-4 leading-relaxed text-gray-700">
      <strong>Dados:</strong> Nosso aplicativo NÃO SOLICITA nem coleta dados de
      localização do seu dispositivo.
    </p>

    <h3 className="mt-6 mb-2 font-semibold text-gray-900">
      3. COMO SEUS DADOS SÃO ARMAZENADOS E PROTEGIDOS?
    </h3>
    <p className="mb-2 leading-relaxed text-gray-700">
      3.1. Dados de Cadastro e Uso da Plataforma: São armazenados em servidores
      seguros, com medidas de segurança compatíveis com o estado da arte e com
      as melhores práticas de mercado, incluindo criptografia de dados em
      trânsito e em repouso, firewalls, controle de acesso restrito e
      monitoramento contínuo.
    </p>
    <p className="mb-2 leading-relaxed text-gray-700">
      3.2. Conteúdo Gerado pelo Usuário (Áudios, Transcrições, Anotações):
    </p>
    <ul className="mb-2 list-disc space-y-1 pl-6 text-gray-700">
      <li>
        <strong>Armazenamento Local (Dispositivo do Usuário):</strong>{" "}
        Preferencialmente, o conteúdo é armazenado no dispositivo do Usuário. O
        Usuário é responsável por garantir a segurança física e lógica de seu
        próprio dispositivo.
      </li>
      <li>
        <strong>Sincronização em Nuvem (Serviços de Terceiros):</strong> Se o
        Usuário optar por funcionalidades de sincronização ou backup em nuvem
        (ex: Google Drive, iCloud, OneDrive), o armazenamento ocorrerá nos
        serviços desses terceiros, sob a responsabilidade do Usuário quanto à
        configuração e segurança de sua conta junto a esses serviços. A
        Executivo&apos;s Digital não acessa ou gerencia diretamente essas contas
        de terceiros.
      </li>
      <li>
        <strong>Processamento Efêmero:</strong> Durante o processo de
        transcrição, os áudios podem ser temporariamente processados em
        servidores seguros, com criptografia ponta a ponta e sem retenção após a
        conclusão do serviço de transcrição, garantindo que não ocorra
        armazenamento permanente desses dados pela Executivo&apos;s Digital.
      </li>
    </ul>
    <p className="mb-4 leading-relaxed text-gray-700">
      3.3. Segurança Geral: Adotamos padrões rigorosos de segurança e
      criptografia para proteger seus dados contra acesso não autorizado,
      alteração, divulgação ou destruição. Nosso ambiente de desenvolvimento e
      produção segue as melhores práticas de segurança da informação.
    </p>

    <h3 className="mt-6 mb-2 font-semibold text-gray-900">
      4. COMPARTILHAMENTO DE DADOS COM TERCEIROS
    </h3>
    <p className="mb-2 leading-relaxed text-gray-700">
      4.1. Provedores de Serviços: Podemos compartilhar seus Dados de Cadastro e
      Uso da Plataforma com parceiros e prestadores de serviços que nos auxiliam
      na operação do Aplicativo, tais como processadores de pagamento,
      provedores de análise de dados, serviços de nuvem e ferramentas de
      comunicação. Esses terceiros estão contratualmente obrigados a proteger
      seus dados e utilizá-los apenas para os fins específicos para os quais
      foram contratados.
    </p>
    <p className="mb-2 leading-relaxed text-gray-700">
      4.2. Conteúdo Gerado pelo Usuário: O Conteúdo Gerado pelo Usuário (áudios,
      transcrições, anotações) NÃO É COMPARTILHADO com terceiros pela
      Executivo&apos;s Digital para qualquer finalidade que não seja a prestação
      do serviço diretamente solicitado pelo Usuário (ex: processamento de
      transcrição), e mesmo assim, de forma temporária e sem retenção.
    </p>
    <p className="mb-4 leading-relaxed text-gray-700">
      4.3. Requisitos Legais: Podemos divulgar suas informações pessoais se
      exigido por lei, ordem judicial, processo legal ou solicitação de
      autoridades governamentais.
    </p>

    <h3 className="mt-6 mb-2 font-semibold text-gray-900">
      5. TRANSFERÊNCIA INTERNACIONAL DE DADOS
    </h3>
    <p className="mb-4 leading-relaxed text-gray-700">
      Caso haja necessidade de transferência de dados para fora do Brasil, como
      no caso de utilização de serviços de nuvem de provedores globais, nos
      certificaremos de que tal transferência observe as condições estabelecidas
      na LGPD, garantindo que o país ou a organização internacional em questão
      proporcionem um grau de proteção de dados pessoais adequado ou mediante a
      adoção de cláusulas contratuais específicas, normas corporativas globais
      ou selos, certificados e códigos de conduta.
    </p>

    <h3 className="mt-6 mb-2 font-semibold text-gray-900">
      6. SEUS DIREITOS COMO TITULAR DE DADOS (LGPD)
    </h3>
    <p className="mb-2 leading-relaxed text-gray-700">
      A LGPD garante a você vários direitos referentes aos seus dados pessoais.
      Você pode exercer esses direitos a qualquer momento, mediante requisição:
    </p>
    <ul className="mb-2 list-disc space-y-1 pl-6 text-gray-700">
      <li>
        <strong>Confirmação:</strong> Confirmar a existência de tratamento de
        seus dados.
      </li>
      <li>
        <strong>Acesso:</strong> Acessar seus dados pessoais tratados por nós.
      </li>
      <li>
        <strong>Retificação:</strong> Corrigir dados incompletos, inexatos ou
        desatualizados.
      </li>
      <li>
        <strong>Anonimização, Bloqueio ou Eliminação:</strong> Solicitar a
        anonimização, bloqueio ou eliminação de dados desnecessários, excessivos
        ou tratados em desconformidade com a LGPD.
      </li>
      <li>
        <strong>Portabilidade:</strong> Solicitar a portabilidade dos seus dados
        para outro fornecedor de serviço ou produto.
      </li>
      <li>
        <strong>Eliminação:</strong> Solicitar a eliminação dos dados pessoais
        tratados com o seu consentimento (exceto nos casos previstos na LGPD).
      </li>
      <li>
        <strong>Informação:</strong> Obter informações sobre as entidades
        públicas e privadas com as quais compartilhamos seus dados.
      </li>
      <li>
        <strong>Informação sobre o não consentimento:</strong> Ser informado
        sobre a possibilidade de não fornecer consentimento e sobre as
        consequências da negativa.
      </li>
      <li>
        <strong>Revogação do consentimento:</strong> Revogar seu consentimento a
        qualquer momento, sem que isso afete a legalidade do tratamento
        realizado antes da revogação.
      </li>
      <li>
        <strong>Oposição:</strong> Opor-se a um tratamento de dados que viole a
        LGPD.
      </li>
    </ul>
    <p className="mb-4 leading-relaxed text-gray-700">
      Para exercer qualquer um desses direitos, entre em contato conosco através
      do canal indicado no item 9 desta Política. Responderemos à sua
      solicitação em um prazo razoável e de acordo com a legislação aplicável.
      Poderemos solicitar informações adicionais para confirmar sua identidade.
    </p>

    <h3 className="mt-6 mb-2 font-semibold text-gray-900">
      7. RETENÇÃO DE DADOS
    </h3>
    <p className="mb-2 leading-relaxed text-gray-700">
      Retemos seus Dados de Cadastro e Uso da Plataforma pelo tempo necessário
      para cumprir as finalidades para as quais foram coletados, para prestação
      dos serviços contratados, para cumprir obrigações legais, resolver
      disputas e fazer cumprir nossos acordos.
    </p>
    <p className="mb-4 leading-relaxed text-gray-700">
      Como mencionado, o Conteúdo Gerado pelo Usuário (áudios e transcrições)
      NÃO É RETIDO de forma permanente pela Executivo&apos;s Digital em seus
      servidores.
    </p>

    <h3 className="mt-6 mb-2 font-semibold text-gray-900">
      8. ALTERAÇÕES A ESTA POLÍTICA DE PRIVACIDADE
    </h3>
    <p className="mb-4 leading-relaxed text-gray-700">
      A Executivo&apos;s Digital reserva-se o direito de modificar esta Política
      de Privacidade a qualquer momento, para adaptá-la a novas funcionalidades
      do Aplicativo, mudanças na legislação ou melhores práticas de mercado. As
      alterações serão publicadas no Aplicativo e/ou em nosso site, com
      indicação da data da última atualização. O uso contínuo do Aplicativo após
      a publicação das alterações constitui sua aceitação dos termos revisados.
    </p>

    <h3 className="mt-6 mb-2 font-semibold text-gray-900">
      9. CONTATO DO ENCARREGADO DE DADOS (DPO)
    </h3>
    <p className="mb-2 leading-relaxed text-gray-700">
      Se você tiver dúvidas, comentários ou preocupações sobre esta Política de
      Privacidade ou sobre o tratamento dos seus dados pessoais, ou se desejar
      exercer seus direitos como titular de dados, por favor, entre em contato
      com nosso Encarregado de Dados (DPO):
    </p>
    <p className="mb-2 leading-relaxed text-gray-700">
      <strong>Encarregado de Dados (DPO):</strong> Gabriel Antônio de Moura
      Fernanfes
      <br />
      <strong>E-mail:</strong> diretoria@executivosdigital.com.br
    </p>
    <p className="mb-4 text-sm leading-relaxed text-gray-700">
      <strong>Data da Última Atualização:</strong> 19/10/2025
    </p>
  </>
);

interface PrivacyPolicyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrivacyPolicyModal({
  open,
  onOpenChange,
}: PrivacyPolicyModalProps) {
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
              Política de Privacidade – EX Voice
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 py-5 text-sm">
          {PRIVACY_CONTENT}
        </div>
      </DialogContent>
    </Dialog>
  );
}
