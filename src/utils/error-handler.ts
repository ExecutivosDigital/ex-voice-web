/**
 * Utilitário para tratamento padronizado de erros da API
 */

export interface ApiResponse {
  status: number;
  body: any;
}

/**
 * Extrai a mensagem de erro de uma resposta da API de forma consistente
 * Suporta diferentes formatos de erro do NestJS
 */
export function extractErrorMessage(response: ApiResponse): string {
  if (!response || !response.body) {
    return "Erro desconhecido";
  }

  const body = response.body;

  // Se body é uma string, retorna diretamente
  if (typeof body === "string") {
    return body;
  }

  // Formato NestJS padrão: { statusCode: number, message: string | string[] }
  if (body.message) {
    // Se message é um array (validação do class-validator), junta as mensagens
    if (Array.isArray(body.message)) {
      return body.message.join(", ");
    }
    return body.message;
  }

  // Formato alternativo: { error: string }
  if (body.error) {
    return typeof body.error === "string" ? body.error : String(body.error);
  }

  // Se body é um objeto mas não tem message ou error, tenta converter para string
  if (typeof body === "object") {
    // Tenta encontrar qualquer propriedade que pareça uma mensagem
    const possibleMessageFields = ["msg", "errorMessage", "description", "detail"];
    for (const field of possibleMessageFields) {
      if (body[field]) {
        return String(body[field]);
      }
    }
  }

  return "Erro desconhecido";
}

/**
 * Retorna uma mensagem amigável baseada no status code HTTP
 */
export function getErrorMessageByStatus(status: number): string {
  switch (status) {
    case 400:
      return "Requisição inválida. Verifique os dados enviados.";
    case 401:
      return "Não autorizado. Faça login novamente.";
    case 403:
      return "Acesso negado. Você não tem permissão para esta ação.";
    case 404:
      return "Recurso não encontrado.";
    case 409:
      return "Conflito. O recurso já existe ou está em uso.";
    case 422:
      return "Dados inválidos. Verifique os campos do formulário.";
    case 429:
      return "Muitas requisições. Tente novamente em alguns instantes.";
    case 500:
      return "Erro interno do servidor. Tente novamente mais tarde.";
    case 502:
      return "Servidor temporariamente indisponível. Tente novamente em alguns instantes.";
    case 503:
      return "Serviço temporariamente indisponível. Tente novamente mais tarde.";
    default:
      if (status >= 400 && status < 500) {
        return "Erro na requisição. Verifique os dados e tente novamente.";
      }
      if (status >= 500) {
        return "Erro no servidor. Tente novamente mais tarde.";
      }
      return "Ocorreu um erro. Tente novamente.";
  }
}

/**
 * Função completa para tratamento de erros de API
 * Extrai a mensagem de erro da resposta ou usa uma mensagem padrão baseada no status
 */
export function handleApiError(
  response: ApiResponse,
  defaultMessage?: string,
): string {
  // Tenta extrair mensagem específica da API
  const apiMessage = extractErrorMessage(response);

  // Se a mensagem extraída não é genérica, usa ela
  if (apiMessage && apiMessage !== "Erro desconhecido") {
    return apiMessage;
  }

  // Se tem mensagem padrão fornecida, usa ela
  if (defaultMessage) {
    return defaultMessage;
  }

  // Caso contrário, usa mensagem baseada no status code
  return getErrorMessageByStatus(response.status);
}

/**
 * Verifica se a resposta da API indica sucesso
 */
export function isSuccessResponse(response: ApiResponse): boolean {
  return response.status >= 200 && response.status < 300;
}

/**
 * Verifica se a resposta da API indica erro
 */
export function isErrorResponse(response: ApiResponse): boolean {
  return response.status >= 400;
}
