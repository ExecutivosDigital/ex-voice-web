import type { PreviewSegment } from "./conversa-real";

/**
 * Segunda conversa real do preview — 16/07 17:56, "Teste 3" (10m43s).
 *
 * Victor apresentando os layouts A-D para o Gabriel e o Joao. Conversa calma e
 * estruturada, ao contrario da primeira (crosstalk proposital) — as duas juntas
 * cobrem os dois extremos: a reuniao normal e o caos.
 *
 * ⚠ Este dado NAO e o que foi para o banco. Na hora da gravacao a API estava
 * apontando para o Modal de PRODUCAO (o $env: se perdeu no restart do
 * terminal), que roda o motor antigo — entao o que o Victor apresentou saiu do
 * caminho MONO: 3 locutores, 57 segmentos e ZERO sobreposicao, num audio que
 * tem 37.6s de fala simultanea medida no sinal. Reprocessado pelo motor de 2
 * canais.
 *
 * ⚠ OS NOMES SAO OS QUE O MOTOR ENTREGOU. Na primeira conversa eu troquei por
 * Victor/Bruno/Madu na mao sem marcar isso, e na apresentacao concluiu-se que o
 * sistema nomeava sozinho ("o nome ta pegando automatico? Automatico, aham").
 * Nao existe nomeacao automatica; e o proximo item da fila. E meu chute estava
 * errado: chamei de "Bruno" quem era o Gabriel.
 *
 * ⚠ Sao 5 locutores onde ha 3 pessoas: o canal remoto tem Gabriel + Joao e o
 * NeMo os fragmentou em 4. Separar multiplos remotos ENTRE SI continua sendo
 * trabalho acustico — a separacao de canais so resolve local x remoto. Foi
 * exatamente o que o Gabriel apontou na reuniao ("esse mais C, quem falou?").
 */

export const conversaTeste3: PreviewSegment[] = [
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 1.9,
    "end": 4.38,
    "text": "Eu quero ver... Oi?"
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 2.22,
    "end": 2.9,
    "text": "Não sendo problema, irmão."
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 6.02,
    "end": 6.74,
    "text": "Não sendo problema."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 7.58,
    "end": 7.88,
    "text": "Não, não."
  },
  {
    "speaker": "Locutor 2",
    "channel": "remote",
    "start": 10.5,
    "end": 12.3,
    "text": "E se for problema que não seja meu, tá ligado?"
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 13.16,
    "end": 14.12,
    "text": "Ah, seria incrível."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 15.86,
    "end": 17.56,
    "text": "Quero ver a opinião de vocês, o que vocês acham."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 18.46,
    "end": 21.46,
    "text": "Então, agora mais cedo, eu fiz uma gravação de dois minutos aqui, um minuto e meio,"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 22.8,
    "end": 24.68,
    "text": "com o Gabriel Camadu, que a gente gastou, tipo,"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 25.6,
    "end": 28.6,
    "text": "acho que 20, 30 segundos falando junto, os três ao mesmo tempo,"
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 30.1,
    "end": 30.34,
    "text": "Mas tá"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 30.3,
    "end": 32.4,
    "text": "pra ver como que o sistema ia se comportar e tal."
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 31.26,
    "end": 31.66,
    "text": "pegando. O"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 34.04,
    "end": 37.04,
    "text": "E aí, funcionou, transcreveu bem, ficou bacana."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 38.1,
    "end": 39.9,
    "text": "Ele pegou o Bruno aqui, então ok,"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 40.72,
    "end": 41.86,
    "text": "era pra ser o Gabriel, mas beleza."
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 41.94,
    "end": 42.48,
    "text": "nome tá pegando"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 43.54,
    "end": 48.06,
    "text": "Mas ele fez a separação bacana. Só que eu não gostei dessa visualização que a gente tem aqui,"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 49.66,
    "end": 51.06,
    "text": "porque antes não tinha,"
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 50.64,
    "end": 51.0,
    "text": "automático?"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 53.54,
    "end": 56.82,
    "text": "por bem ou por mal, a parte de sobreposição, mas agora tem."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 58.44,
    "end": 58.58,
    "text": "Então"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 59.46,
    "end": 62.74,
    "text": "por mais que aqui ele aparece que o Locutor 2, que é a Amadou,"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 63.82,
    "end": 66.88,
    "text": "começou a falar aos 36 segundos, ela começou a falar antes."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 67.76,
    "end": 68.82,
    "text": "Só que ele só entrou aqui."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 70.04,
    "end": 74.56,
    "text": "Então essa visualização aqui é muito linear para conversas que tem sobreposição."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 76.38,
    "end": 77.08,
    "text": "O que eu pensei?"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 79.06,
    "end": 80.84,
    "text": "Não gostei disso, falei para o Claudio, olha,"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 81.74,
    "end": 82.08,
    "text": "preciso de"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 83.04,
    "end": 86.22,
    "text": "alguma outra maneira de visualizar isso, porque senão vai ficar muito esquisito,"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 87.64,
    "end": 89.64,
    "text": "quando eu tiver sobreposição não vai ficar claro ali."
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 88.48,
    "end": 88.76,
    "text": "Acho que"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 91.38,
    "end": 93.62,
    "text": "Então ele me trouxe isso aqui. São três"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 94.46,
    "end": 97.28,
    "text": "sugestões dele e daí uma outra que eu trouxe também."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 98.52,
    "end": 102.3,
    "text": "A primeira a gente tem essa visualização vertical aqui, um mapa da conversa."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 103.5,
    "end": 108.9,
    "text": "E aí tem, tipo, eu falei dos 2 aos 28 segundos junto com o Bruno, o Gabriel, na verdade."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 110.1,
    "end": 112.34,
    "text": "E aí o Gabriel entrou aos 19 segundos, então dá pra... Ah,"
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 112.06,
    "end": 113.9,
    "text": "foi"
  },
  {
    "speaker": "Locutor 2",
    "channel": "remote",
    "start": 114.42,
    "end": 116.4,
    "text": "um bro, né? Acho que a pessoa me"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 114.86,
    "end": 124.54,
    "text": "automático, aham. Hã? Ah, é provável, é. Não, tá certo, aham. Provavelmente é o Bruno mesmo."
  },
  {
    "speaker": "Locutor 2",
    "channel": "remote",
    "start": 118.96,
    "end": 121.24,
    "text": "chamou e falou, bro? Fala aí, rapidão."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 125.4,
    "end": 130.2,
    "text": "Mas tá pegando automático. Isso aqui eu não coloquei, Victor, Bruno e Madu, ele pegou automático já."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 131.58,
    "end": 132.82,
    "text": "Mas daí é essa visualização aqui."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 133.76,
    "end": 139.8,
    "text": "Então eu consigo ver que a Madhu entrou aqui aos 33 segundos, por exemplo. E ela falou só um pedacinho e depois ela foi... enfim."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 142.06,
    "end": 143.58,
    "text": "Gostei, mas não achei"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 144.88,
    "end": 145.34,
    "text": "muito..."
  },
  {
    "speaker": "Locutor 2",
    "channel": "remote",
    "start": 146.82,
    "end": 147.22,
    "text": "Incrível."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 147.92,
    "end": 149.12,
    "text": "não é... como é que fala?"
  },
  {
    "speaker": "Locutor 2",
    "channel": "remote",
    "start": 150.2,
    "end": 151.14,
    "text": "Continua não sendo IPT."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 151.52,
    "end": 152.7,
    "text": "É, não é intuitivo de ler."
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 153.56,
    "end": 154.32,
    "text": "Perfeito."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 154.94,
    "end": 158.14,
    "text": "Aí tem essa outra aqui, que é o mais simples possível."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 158.94,
    "end": 167.86,
    "text": "Ele só me traz aqui que eu comecei a falar junto com o Bruno ali aos 9 segundos. E o Bruno começou a falar comigo por 9 segundos. E aí tem essas interjeições um pouco menores que ele me traz assim."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 169.18,
    "end": 170.44,
    "text": "Eu falei assim, só pode ser também."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 172.86,
    "end": 175.78,
    "text": "Ok, mas eu não acho ainda que está muito bom."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 178.52,
    "end": 179.54,
    "text": "Não acho que ficou 100 %"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 180.54,
    "end": 180.76,
    "text": "assim."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 182.76,
    "end": 184.1,
    "text": "Só isso aqui eu acho que não resolveria."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 186.9,
    "end": 189.8,
    "text": "Aí ele me trouxe essas colunas paralelas. Isso aqui eu achei um pouquinho melhor,"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 191.74,
    "end": 193.14,
    "text": "mas ainda também não acho que resolve."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 194.2,
    "end": 203.54,
    "text": "Que é tipo, eu comecei a falar isso aqui, só que eu não tenho, tipo, claro quando que o Gabriel começou a falar no meio dessa minha fala aqui. Se foi tipo, eu terminei e ele começou a falar ou não."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 204.72,
    "end": 207.32,
    "text": "Obviamente que não, porque ele começou a falar aos 19 segundos."
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 205.88,
    "end": 210.3,
    "text": "Caraca, que problema complicado de resolver. Vai tomando."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 211.14,
    "end": 213.14,
    "text": "Que aí foi o que eu trouxe. Cara,"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 214.16,
    "end": 216.38,
    "text": "esse problema já tá resolvido no Audacity."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 217.84,
    "end": 224.54,
    "text": "Ele tem a faixa de áudio E eu tenho as quebras certinhas De onde foi falado tal coisa Então eu tirei um print e falei"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 225.46,
    "end": 227.84,
    "text": "Tem isso aqui que já funciona Implementa aí pra mim"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 229.04,
    "end": 229.84,
    "text": "Ele me trouxe isso aqui E"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 232.4,
    "end": 235.12,
    "text": "é isso aqui, cara Isso aqui eu gostei pra caralho"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 236.64,
    "end": 238.84,
    "text": "Tem ajustes que precisam ser feitos ainda, mas beleza"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 239.68,
    "end": 242.22,
    "text": "Então ele me trouxe duas faixas de áudio"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 243.32,
    "end": 244.1,
    "text": "Esse aqui é um outro ponto."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 245.34,
    "end": 251.4,
    "text": "Para gravações online. São duas faixas agora. O microfone e a tela que eu estou gravando."
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 252.36,
    "end": 252.8,
    "text": "Perfeito."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 254.02,
    "end": 254.8,
    "text": "E ele me traz aqui."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 255.86,
    "end": 257.86,
    "text": "Esses períodos aqui em vermelho. Foi falado junto."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 258.76,
    "end": 262.28,
    "text": "Só que eu já consegui clicar. E ir para onde foi a fala. E o que foi falado."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 263.48,
    "end": 265.62,
    "text": "Isso aqui eu achei que ficou bem mais da hora."
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 267.56,
    "end": 268.28,
    "text": "É o ideal, na verdade."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 268.5,
    "end": 275.18,
    "text": "Eu consigo dar um zoom aqui também. E acompanhar. Se eu conseguisse clicar no áudio. E ouvir. Aí eu acho que seria absurdo."
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 270.02,
    "end": 270.72,
    "text": "Ele vai passando."
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 276.44,
    "end": 277.9,
    "text": "Acho que dei um depois."
  },
  {
    "speaker": "Locutor 2",
    "channel": "remote",
    "start": 279.54,
    "end": 284.3,
    "text": "Se for fácil de fazer, eu acho que é incrível."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 283.66,
    "end": 284.16,
    "text": "Mas daí tipo..."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 286.18,
    "end": 288.04,
    "text": "Não, houve ainda também, como player de áudio."
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 290.36,
    "end": 290.44,
    "text": "Ou"
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 291.44,
    "end": 292.52,
    "text": "ver alguma coisa também."
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 294.3,
    "end": 294.7,
    "text": "Tá ligado?"
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 296.74,
    "end": 298.84,
    "text": "Hã? Ou... Não, eu falei. Ou ver. Versão"
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 299.66,
    "end": 299.8,
    "text": "alguma"
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 300.8,
    "end": 301.14,
    "text": "coisa"
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 302.22,
    "end": 307.14,
    "text": "também."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 305.4,
    "end": 305.7,
    "text": "Mas enfim."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 307.16,
    "end": 308.5,
    "text": "Ah, tá, tá, tá. Entendi, entendi."
  },
  {
    "speaker": "Locutor 1",
    "channel": "remote",
    "start": 307.7,
    "end": 324.1,
    "text": "Tipo..."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 309.44,
    "end": 313.56,
    "text": "Mas enfim, o ponto que eu queria trazer aqui é... Eu acho que isso aqui, das quatro, é a melhor."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 314.64,
    "end": 323.28,
    "text": "Mas eu mantenho só essa aqui? Ou eu deixo uma opção para o usuário escolher alguma outra também? Porque eu acho que isso aqui, dependendo do usuário, vai parecer muito complicado de entender."
  },
  {
    "speaker": "Locutor 2",
    "channel": "remote",
    "start": 324.16,
    "end": 326.58,
    "text": "É, tem uma outra visão que eu acho que faz sentido também,"
  },
  {
    "speaker": "Locutor 2",
    "channel": "remote",
    "start": 328.2,
    "end": 331.04,
    "text": "além dessas, e talvez ela seja uma boa alternativa para"
  },
  {
    "speaker": "Locutor 2",
    "channel": "remote",
    "start": 332.18,
    "end": 334.62,
    "text": "uma extra, que seria uma visão tipo agenda, pô."
  },
  {
    "speaker": "Locutor 2",
    "channel": "remote",
    "start": 337.52,
    "end": 351.7,
    "text": "tem a fala 1. Se a fala 1 só tem ela, ela ocupa o espaço inteiro. Se duas pessoas falaram, tipo, essa aqui vem até o momento que a outra começou, e aí a fala da outra começa e as duas descem juntos, tá ligado? É que daí o espaço no id talvez fique ruim."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 345.48,
    "end": 345.48,
    "text": "O"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 348.3,
    "end": 348.98,
    "text": "que daí seria..."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 352.32,
    "end": 352.54,
    "text": "Seria"
  },
  {
    "speaker": "Locutor 2",
    "channel": "remote",
    "start": 352.54,
    "end": 353.56,
    "text": "Seria algo igual isso daí,"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 353.38,
    "end": 354.84,
    "text": "isso aqui, só que separado"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 355.7,
    "end": 356.44,
    "text": "por timeline."
  },
  {
    "speaker": "Locutor 2",
    "channel": "remote",
    "start": 356.78,
    "end": 357.74,
    "text": "timeline também."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 358.84,
    "end": 359.1,
    "text": "Boto fé."
  },
  {
    "speaker": "Locutor 2",
    "channel": "remote",
    "start": 363.36,
    "end": 371.14,
    "text": "Pode ser problemático se muitas pessoas falarem ao mesmo tempo. Ah, cinco pessoas, vai começar a apertar demais as falas, tá ligado? Mas..."
  },
  {
    "speaker": "Locutor 2",
    "channel": "remote",
    "start": 372.18,
    "end": 376.14,
    "text": "É uma visualização meio que... Acho que a galera já vai estar mais acostumada por questão de agenda."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 379.4,
    "end": 379.9,
    "text": "Faz sentido."
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 380.36,
    "end": 380.94,
    "text": "Eu vou te falar que"
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 381.82,
    "end": 382.58,
    "text": "eu também enxergo que,"
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 383.66,
    "end": 383.98,
    "text": "assim,"
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 385.02,
    "end": 386.2,
    "text": "ir da versão inicial normal,"
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 388.16,
    "end": 389.64,
    "text": "e aí o que eu acho que tem que ter"
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 390.46,
    "end": 392.64,
    "text": "seria o começo e o fim, né? Tipo,"
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 393.78,
    "end": 394.72,
    "text": "embaixo do locutor ali,"
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 396.04,
    "end": 397.76,
    "text": "tem lá só 0 .02."
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 398.62,
    "end": 401.8,
    "text": "Que imagino eu que seja o momento que ele terminou de falar aquilo. Opa!"
  },
  {
    "speaker": "Locutor 4",
    "channel": "remote",
    "start": 402.88,
    "end": 407.86,
    "text": "Você tá ocupado?"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 403.3,
    "end": 403.9,
    "text": "É o começo."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 405.04,
    "end": 405.94,
    "text": "Você sabia disso aqui?"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 408.3,
    "end": 408.68,
    "text": "Se eu clico,"
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 408.82,
    "end": 411.46,
    "text": "Opa! Você"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 409.84,
    "end": 411.3,
    "text": "ele coloca o"
  },
  {
    "speaker": "Locutor 4",
    "channel": "remote",
    "start": 411.72,
    "end": 412.9,
    "text": "tá ocupado?"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 412.58,
    "end": 414.1,
    "text": "áudio. Minha transmissão está com áudio?"
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 412.96,
    "end": 422.18,
    "text": "Ah tá, eu até coloquei o meu fone. Eu achei que... Eu tava no lugar aqui de conferência, tá ligado? Mas embaixo eu tava aqui. A"
  },
  {
    "speaker": "Locutor 4",
    "channel": "remote",
    "start": 423.44,
    "end": 425.96,
    "text": "gente garantia que ele vai conseguir detectar que tem tipo... É,"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 424.46,
    "end": 425.46,
    "text": "Não sabia. Boto fé."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 427.04,
    "end": 430.14,
    "text": "Talvez foi feito recentemente e eu não tinha percebido. Você"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 432.08,
    "end": 435.48,
    "text": "acha ter isso aqui, mas com definição de início e fim?"
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 438.44,
    "end": 439.12,
    "text": "eu acho que é o baita."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 440.66,
    "end": 441.82,
    "text": "Tá, é, eu vou..."
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 441.98,
    "end": 444.38,
    "text": "Isso aí. Isso junto, né? Tipo,"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 442.68,
    "end": 443.34,
    "text": "E isso aqui também."
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 445.46,
    "end": 446.08,
    "text": "ter uma visualização..."
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 446.9,
    "end": 447.58,
    "text": "Volta lá no anterior."
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 450.22,
    "end": 450.74,
    "text": "Essa é a posição"
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 451.94,
    "end": 456.38,
    "text": "padrão, e aí tem um botão ver pro, que vai pra outra lá, e aí lá já tem a..."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 456.8,
    "end": 456.98,
    "text": "Entendi."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 459.54,
    "end": 459.86,
    "text": "Beleza."
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 460.24,
    "end": 462.56,
    "text": "Porque assim, entra naquela situação, tipo, por exemplo,"
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 463.4,
    "end": 464.14,
    "text": "meu locutor 2 lá,"
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 466.6,
    "end": 467.44,
    "text": "aí no final, mais C,"
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 468.32,
    "end": 468.82,
    "text": "mais C,"
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 470.18,
    "end": 470.92,
    "text": "aí vai pra baixo,"
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 474.64,
    "end": 475.78,
    "text": "então esse mais C, quem falou?"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 476.36,
    "end": 477.38,
    "text": "Ótima pergunta, brother."
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 478.68,
    "end": 479.94,
    "text": "Vai lá no pro agora então, né, velho?"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 481.66,
    "end": 482.18,
    "text": "Foi..."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 484.06,
    "end": 486.48,
    "text": "Tá aqui com o Gabriel, mas imagino que foi a Madu que falou."
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 484.6,
    "end": 484.78,
    "text": "O bro."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 487.82,
    "end": 490.58,
    "text": "Que ela deve ter falado. Mas se eu falar em cima de vocês, será que vocês conseguem?"
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 492.54,
    "end": 492.74,
    "text": "Entendi."
  },
  {
    "speaker": "Locutor 2",
    "channel": "remote",
    "start": 494.86,
    "end": 504.1,
    "text": "É que o áudio da Madu também estava bem ruimzinho, porque a gente estava falando ao mesmo tempo. É, porque o Mac tentava cancelar o nosso ruído enquanto falava o microfone. Entendi."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 496.34,
    "end": 497.52,
    "text": "Tava cortando bastante."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 504.38,
    "end": 507.08,
    "text": "Então pra resolver isso já também, eu tô gravando isso aqui"
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 505.7,
    "end": 506.88,
    "text": "É, mas eu acho que o mais perfeito..."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 508.36,
    "end": 509.98,
    "text": "pra gente jogar lá no teste também."
  },
  {
    "speaker": "Locutor 2",
    "channel": "remote",
    "start": 508.66,
    "end": 512.1,
    "text": "Tá bom! O moleque"
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 512.14,
    "end": 516.36,
    "text": "é bravo. Mas eu acho que você tinha que ter parado mais cedo de falar, de gravar, né, cara? Tá bom."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 514.78,
    "end": 518.86,
    "text": "Não, mano. Não, não, não. Tá ótimo isso aqui, cara. Uns 10 minutinhos ali."
  },
  {
    "speaker": "Locutor 2",
    "channel": "remote",
    "start": 518.06,
    "end": 521.32,
    "text": "Não, mas é que ele não vai revisar na mão, né, de novo. É verdade."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 520.66,
    "end": 521.5,
    "text": "Não, exatamente."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 523.46,
    "end": 526.34,
    "text": "Mas fechou. Eu vou trabalhar em cima disso aqui, então."
  },
  {
    "speaker": "Locutor 2",
    "channel": "remote",
    "start": 525.44,
    "end": 528.64,
    "text": "Fechou? É, deixar essa timeline um pouquinho mais bonitinha"
  },
  {
    "speaker": "Locutor 2",
    "channel": "remote",
    "start": 529.64,
    "end": 531.0,
    "text": "e conseguir colocar o interativo no"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 531.86,
    "end": 532.5,
    "text": "No player ali."
  },
  {
    "speaker": "Locutor 2",
    "channel": "remote",
    "start": 531.9,
    "end": 534.14,
    "text": "áudio. Talvez não precise nem mostrar as duas trilhas, tá ligado?"
  },
  {
    "speaker": "Locutor 2",
    "channel": "remote",
    "start": 535.3,
    "end": 540.18,
    "text": "Ou juntar as duas, não sei. Eu acho que ficou... Sim,"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 536.62,
    "end": 541.02,
    "text": "Eu também acho que juntar ficaria melhor. Separar para transcrição é ótimo,"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 541.86,
    "end": 544.28,
    "text": "mas para visualização do usuário eu não acho que faz sentido."
  },
  {
    "speaker": "Locutor 2",
    "channel": "remote",
    "start": 545.84,
    "end": 546.36,
    "text": "com certeza."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 547.14,
    "end": 547.56,
    "text": "E aí, só"
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 547.74,
    "end": 548.74,
    "text": "Cara, tá incrível já."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 549.16,
    "end": 553.24,
    "text": "deixando claro aqui, gravação presencial ou no aplicativo ali."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 554.56,
    "end": 560.94,
    "text": "Continua sendo uma faixa só. Então volta para o padrão que a gente já tinha. Que não era ruim. Mas não vai ser"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 561.8,
    "end": 563.58,
    "text": "tão bom quanto o online agora."
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 565.2,
    "end": 581.36,
    "text": "E aí não tem nenhuma configuração de dialização, óbvio, isso aí a gente pode fazer. Entendi, mas funciona melhor por conta de uma metodologia diferente, não por conta de uma configuração de dialização da IA."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 568.6,
    "end": 570.1,
    "text": "Já está fazendo. A"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 571.06,
    "end": 574.12,
    "text": "digitalização já funciona. É que isso aqui agora funciona melhor."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 579.62,
    "end": 579.8,
    "text": "Isso."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 581.54,
    "end": 583.08,
    "text": "Exatamente. Porque agora..."
  },
  {
    "speaker": "Locutor 3",
    "channel": "remote",
    "start": 582.62,
    "end": 583.92,
    "text": "Seja o Pianote, seja o..."
  },
  {
    "speaker": "Locutor 1",
    "channel": "remote",
    "start": 584.08,
    "end": 597.96,
    "text": "Mas"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 584.42,
    "end": 595.84,
    "text": "Não, a gente nem mexeu nisso aí, pra você ter uma noção. O ponto aqui que a gente mexeu foi, em gravação online, eu já tinha duas faixas de áudio separadas. Só que a gente tava juntando elas. Então, tipo, tava perdendo"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 596.82,
    "end": 597.38,
    "text": "essa clareza."
  },
  {
    "speaker": "Locutor 2",
    "channel": "remote",
    "start": 598.06,
    "end": 598.06,
    "text": "o..."
  },
  {
    "speaker": "Locutor 2",
    "channel": "remote",
    "start": 601.08,
    "end": 608.98,
    "text": "Por exemplo, teve vários momentos que eu e a Madhu falamos juntos e ele pegou. Então você melhorou essa questão de a não pegar fala sobrepostas também, na transcrição."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 609.5,
    "end": 611.46,
    "text": "Mas foi justamente porque tem duas faixas agora."
  },
  {
    "speaker": "Locutor 2",
    "channel": "remote",
    "start": 613.02,
    "end": 615.26,
    "text": "Mas uma faixa é sua, e a outra é eu e a Madhu."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 614.5,
    "end": 614.7,
    "text": "Sim."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 615.62,
    "end": 623.84,
    "text": "Aham. Ah, não, sim. Mas então, exato. Porque antes, o sistema não conseguia lidar com sobreposição."
  },
  {
    "speaker": "Locutor 2",
    "channel": "remote",
    "start": 617.86,
    "end": 619.56,
    "text": "E eu e a Madhu falamos sobrepostas na mesma"
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 625.32,
    "end": 636.62,
    "text": "Tipo, não tinha. Se fosse falar sobre o posto, ele não ia lidar com isso, ele ia só ignorar, tá ligado? Então foi uma consequência de ter feito isso e já resolver o suporte também. Isso."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 640.3,
    "end": 641.32,
    "text": "Mas é, beleza."
  },
  {
    "speaker": "Locutor 0",
    "channel": "local",
    "start": 642.18,
    "end": 642.94,
    "text": "Vou..."
  },
  {
    "speaker": "Locutor 2",
    "channel": "remote",
    "start": 642.86,
    "end": 642.94,
    "text": "faixa."
  }
];

/** Forma de onda por canal (900 picos). */
export const waveformTeste3: { local: number[]; remote: number[] } = {"local":[0.003,0.005,0.508,0.39,0.005,0.173,0.786,0.008,0.003,0.002,1.0,0.677,0.226,0.035,0.407,0.178,0.002,0.115,0.138,0.034,0.005,0.009,0.416,0.271,0.25,0.268,0.652,0.506,0.367,0.164,0.036,0.027,0.46,0.601,0.497,0.446,0.647,0.7,0.493,0.48,0.004,0.001,0.531,0.326,0.381,0.227,0.009,0.257,0.336,0.533,0.32,0.525,0.015,0.435,0.363,0.178,0.173,0.245,0.143,0.002,0.061,0.585,0.515,0.319,0.699,0.539,0.291,0.283,0.002,0.509,0.501,0.401,0.002,0.001,0.098,0.818,0.362,0.587,0.713,0.587,0.003,0.304,0.263,0.382,0.452,0.278,0.251,0.209,0.006,0.273,0.493,0.414,0.279,0.512,0.306,0.454,0.488,0.002,0.539,0.463,0.402,0.293,0.668,0.453,0.284,0.01,0.338,0.639,0.012,0.003,0.356,0.399,0.483,0.389,0.437,0.532,0.335,0.354,0.346,0.344,0.278,0.129,0.532,0.747,0.369,0.513,0.004,0.001,0.431,0.384,0.479,0.099,0.249,0.337,0.401,0.29,0.253,0.389,0.635,0.353,0.489,0.406,0.457,0.026,0.495,0.48,0.739,0.398,0.602,0.357,0.275,0.34,0.174,0.015,0.502,0.519,0.208,0.194,0.001,0.003,0.495,0.491,0.005,0.004,0.977,0.007,0.006,0.002,0.003,0.979,0.686,0.29,0.419,0.417,0.171,0.405,0.593,0.277,0.378,0.305,0.295,0.367,0.114,0.007,0.966,0.351,0.049,0.313,0.681,0.403,0.341,0.463,0.196,0.34,0.413,0.341,0.011,0.013,0.843,0.371,0.434,0.233,0.32,0.282,0.001,0.003,0.107,0.578,0.206,0.004,0.004,0.006,0.985,0.365,0.002,0.003,0.099,0.48,0.153,0.338,0.532,0.266,0.396,0.578,0.526,0.225,0.25,0.092,0.211,0.181,0.299,0.582,0.626,0.802,0.464,0.042,0.82,0.446,0.332,0.002,0.06,0.42,0.758,0.831,0.228,0.671,0.092,0.003,0.177,0.264,0.232,0.297,0.206,0.036,0.002,0.653,0.876,0.415,0.001,0.003,0.01,0.423,0.512,0.76,0.371,0.27,0.003,0.004,0.41,0.283,0.224,0.41,0.262,0.663,0.383,0.196,0.578,0.607,0.574,0.503,0.328,0.268,0.391,0.612,0.445,0.01,0.225,0.348,0.324,0.28,0.024,0.714,0.35,0.388,0.046,0.748,0.981,0.092,0.97,0.445,0.764,0.915,0.653,0.003,0.151,0.546,0.608,0.328,0.516,0.351,0.468,0.389,0.326,0.543,0.616,0.615,0.902,0.193,0.654,0.027,0.234,0.448,0.001,0.009,0.001,0.423,0.328,0.381,0.424,0.062,0.0,0.571,0.403,0.301,0.294,0.311,0.199,0.365,0.58,0.093,0.528,0.383,0.098,0.577,0.364,0.551,0.274,0.547,0.795,0.686,0.657,0.269,0.001,0.003,0.001,0.352,0.596,0.303,0.46,0.296,0.399,0.01,0.321,0.691,0.5,0.466,0.364,0.058,0.147,0.367,0.567,0.359,0.003,0.016,0.003,0.047,0.195,0.241,0.19,0.396,0.883,0.521,0.427,0.462,0.531,0.266,0.0,0.0,0.0,0.241,0.002,0.011,0.016,0.006,0.007,0.006,0.019,0.719,0.017,0.003,0.818,0.461,0.401,0.099,0.001,0.001,0.001,0.001,0.004,0.004,0.001,0.002,0.001,0.001,0.001,0.005,0.003,0.002,0.0,0.0,0.001,0.0,0.001,0.173,0.49,0.203,0.143,0.612,0.161,0.657,0.666,0.175,0.011,0.351,0.373,0.279,0.573,0.291,0.44,0.034,0.47,0.416,0.188,0.386,0.345,0.304,0.098,0.426,0.337,0.424,0.308,0.274,0.117,0.0,0.001,0.001,0.001,0.0,0.002,0.003,0.017,0.017,0.001,0.002,0.0,0.001,0.001,0.001,0.001,0.002,0.012,0.003,0.005,0.001,0.001,0.001,0.003,0.001,0.001,0.004,0.001,0.013,0.022,0.06,0.084,0.002,0.03,0.39,0.399,0.011,0.007,0.015,0.001,0.292,0.447,0.929,0.868,0.281,0.728,0.036,0.002,0.011,0.34,0.001,0.002,0.001,0.001,0.001,0.006,0.009,0.004,0.008,0.004,0.003,0.013,0.001,0.003,0.326,0.002,0.001,0.001,0.001,0.002,0.003,0.002,0.003,0.001,0.004,0.004,0.001,0.001,0.338,0.003,0.001,0.004,0.002,0.002,0.001,0.001,0.008,0.004,0.002,0.001,0.001,0.005,0.004,0.001,0.001,0.001,0.001,0.002,0.001,0.008,0.001,0.018,0.026,0.002,0.001,0.007,0.003,0.002,0.002,0.001,0.001,0.321,0.18,0.007,0.402,0.243,0.006,0.001,0.427,0.307,0.197,0.624,0.566,0.001,0.702,0.56,0.582,0.006,0.013,0.169,0.0,0.005,0.009,0.009,0.01,0.002,0.006,0.001,0.001,0.007,0.003,0.524,0.244,0.002,0.663,0.956,0.517,0.378,0.243,0.07,0.008,0.762,0.467,0.612,0.552,0.447,0.217,0.001,0.001,0.001,0.001,0.001,0.001,0.419,0.39,0.26,0.118,0.191,0.001,0.003,0.001,0.001,0.001,0.002,0.001,0.002,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.004,0.006,0.003,0.169,0.003,0.002,0.001,0.645,0.012,0.007,0.001,0.005,0.001,0.001,0.001,0.004,0.003,0.005,0.004,0.002,0.005,0.003,0.002,0.003,0.001,0.007,0.001,0.002,0.004,0.005,0.363,0.299,0.356,0.501,0.001,0.014,0.001,0.002,0.216,0.141,0.005,0.46,0.571,0.688,0.425,0.037,0.116,0.517,0.587,0.328,0.291,0.002,0.002,0.001,0.046,0.001,0.002,0.003,0.366,0.424,0.08,0.078,0.221,0.002,0.018,0.001,0.002,0.004,0.004,0.009,0.364,0.765,0.892,0.25,0.024,0.467,1.0,1.0,0.937,0.887,0.013,0.014,0.098,0.02,0.629,0.448,0.142,0.351,0.169,0.356,0.093,0.002,0.561,0.228,0.022,0.021,0.54,0.503,0.321,0.367,0.208,0.002,0.004,0.001,0.002,0.001,0.001,0.002,0.222,0.172,0.008,0.004,0.001,0.001,0.007,0.669,0.339,0.54,0.927,0.61,0.628,0.062,0.216,0.349,0.167,0.304,0.001,0.001,0.001,0.823,0.728,0.384,0.411,0.447,0.62,0.802,0.669,0.407,0.187,0.003,0.632,0.457,0.604,0.551,0.278,0.465,0.778,0.61,0.122,0.117,0.297,0.289,0.365,0.001,0.003,0.003,0.0,0.001,0.001,0.455,0.756,0.534,0.298,0.529,0.557,0.552,0.738,0.684,0.041,0.0,0.002,0.002,0.0,0.001,0.0,0.337,0.001,0.029,0.292,0.582,0.42,0.008,0.496,0.595,0.092,0.029,0.429,0.555,0.409,0.526,0.627,0.274,0.43,0.218,0.474,0.561,0.108,0.416,0.205,0.207,0.102,0.001,0.002,0.001,0.0,0.0,0.001,0.004,0.001,0.001,0.002,0.012,0.008,0.004,0.0,0.0,0.001,0.744,0.307,0.343,0.001,0.001,0.002,0.001,0.108,0.284,0.076,0.003,0.004,0.001,1.0,0.495,0.521,0.699,0.564,0.405,0.445,0.254,0.006,0.579,0.486,0.691,0.432,0.615,0.546,0.355,0.323,0.124,0.026,0.004,0.305,0.38,0.506,0.502,0.208,0.035,0.002,0.008,0.0,0.0,0.481,0.149,0.052,0.154],"remote":[0.0,0.0,0.0,0.346,0.118,0.0,0.0,0.0,1.0,0.686,0.002,0.0,0.0,0.0,0.225,0.417,0.298,0.911,0.108,0.224,0.145,0.41,0.0,0.074,0.0,0.0,0.0,0.0,0.0,0.343,0.006,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.14,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.108,0.291,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.083,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.08,0.132,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.059,0.065,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.645,0.434,0.277,0.559,0.301,0.19,0.194,0.016,0.0,0.0,0.229,0.371,0.223,0.273,0.241,0.333,0.587,0.287,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.08,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.052,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.594,0.0,0.182,0.05,0.0,0.0,0.0,0.237,0.219,0.002,0.0,0.003,0.172,0.188,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.032,0.0,0.0,0.0,0.0,0.0,0.092,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.089,0.105,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.182,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.21,0.152,0.0,0.0,0.0,0.0,0.0,0.0,0.584,0.902,1.0,0.96,0.365,0.053,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.046,0.128,0.007,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.01,0.0,0.0,0.0,0.0,0.0,0.133,0.032,0.0,0.0,0.0,0.0,0.0,0.062,0.0,0.003,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.151,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.129,0.105,0.127,0.0,0.115,0.186,0.005,0.0,0.0,0.0,0.0,0.0,0.0,0.073,0.317,0.529,0.158,0.045,0.687,0.416,0.373,0.922,0.825,0.049,0.269,0.167,0.049,0.152,0.281,0.006,0.261,0.032,0.375,0.492,0.406,0.315,0.149,0.0,0.035,0.122,0.0,0.356,0.255,0.266,0.268,0.209,0.187,0.122,0.074,0.008,0.244,0.049,0.0,0.0,0.0,0.636,0.544,0.328,0.001,0.004,0.0,0.0,0.001,0.0,0.001,0.001,0.0,0.0,0.031,0.01,0.096,0.0,0.0,0.002,0.0,0.0,0.002,0.001,0.0,0.0,0.272,0.383,0.278,0.244,0.236,0.115,0.295,0.347,0.33,0.169,0.183,0.003,0.313,0.448,0.382,0.284,0.0,0.271,0.002,0.394,0.559,0.521,0.519,0.272,0.41,0.473,0.364,0.352,0.459,0.449,0.215,0.536,0.349,0.334,0.132,0.108,0.371,0.294,0.211,0.152,0.361,0.249,0.118,0.0,0.007,0.011,0.445,0.463,0.106,0.0,0.0,0.0,0.0,0.0,0.087,0.454,0.316,0.319,0.19,0.138,0.159,0.244,0.259,0.228,0.109,0.096,0.131,0.083,0.275,0.152,0.435,0.335,0.247,0.26,0.016,0.004,0.0,0.018,0.16,0.229,0.317,0.306,0.448,0.005,0.737,0.493,0.669,0.413,0.0,0.002,0.867,0.383,0.299,0.442,0.434,0.196,0.323,0.0,0.402,0.537,0.0,0.722,0.647,0.623,0.002,0.467,0.477,0.43,0.415,0.668,0.057,0.127,0.168,0.346,0.003,0.001,0.006,0.177,0.146,0.795,0.222,0.152,0.196,0.408,0.019,0.594,1.0,1.0,0.967,0.356,0.348,0.3,0.513,0.379,0.703,0.496,0.482,0.25,0.208,0.173,0.144,0.128,0.169,0.069,0.0,0.0,0.0,0.001,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.002,0.0,0.0,0.0,0.206,0.175,0.168,0.0,0.0,0.0,0.15,0.101,0.11,0.133,0.161,0.195,0.199,0.199,0.143,0.0,0.0,0.001,0.323,0.164,0.324,0.319,0.446,0.356,0.286,0.22,0.114,0.044,0.0,0.0,0.0,0.0,0.455,0.533,0.56,0.489,0.633,0.712,0.003,0.0,0.0,0.694,0.541,0.281,0.547,0.0,0.435,0.12,0.0,0.0,0.0,0.0,0.619,0.635,0.454,0.0,0.0,0.0,0.305,0.227,0.039,0.0,0.0,0.0,0.0,0.32,0.655,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.363,0.001,0.0,0.276,0.312,0.254,0.254,0.248,0.334,0.335,0.292,0.403,0.498,0.255,0.219,0.001,0.248,0.104,0.84,0.776,0.672,0.027,0.064,1.0,1.0,1.0,1.0,0.332,0.576,0.465,0.568,0.746,0.529,0.288,0.014,0.0,0.275,0.351,0.182,0.277,0.096,0.002,0.0,0.0,0.0,0.001,0.231,0.368,0.284,0.239,0.138,0.153,0.122,0.191,0.079,0.146,0.327,0.337,0.294,0.171,0.324,0.405,0.16,0.109,0.087,0.032,0.0,0.048,0.0,0.0,0.102,0.038,0.175,0.0,0.0,0.26,0.0,0.22,0.242,0.104,0.0,0.0,0.0,0.024,0.01,0.0,0.0,0.0,0.075,0.004,0.002,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.003,0.004,0.0,0.452,0.526,0.287,0.239,0.005,0.0,0.0,0.003,0.0,0.0,0.0,0.003,0.0,0.0,0.0,0.128,0.368,0.4,0.53,0.567,0.308,0.605,0.339,0.002,0.402,0.665,0.338,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.099,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.378,0.525,0.183,0.192,0.001,0.667,0.683,0.557,0.397,0.376,0.599,0.534,0.43,0.389,0.284,0.346,0.149,0.0,0.0,0.0,0.0,0.003,0.542,0.383,0.537,0.369,0.0,0.0,0.464,0.805,0.483,0.344,0.007,0.0,0.022,0.102,0.038,0.075,0.0,0.093,0.011,0.011,0.0,0.0,0.032,0.001,0.0,0.003,0.056,0.032,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.002,0.128,0.0,0.0,0.0,0.0,0.0]};
