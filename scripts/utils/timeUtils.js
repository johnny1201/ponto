/**
 * Converte uma string de horas no formato "hh:mm" para minutos totais.
 */
export function converterHorasParaMinutos(horas) {
  const [hora, minuto] = horas.split(":").map(Number);
  return hora * 60 + minuto;
}

/**
 * Converte minutos em um formato de horas "hh:mm".
 */
export function converterMinutosParaHoras(minutos) {
  const horas = Math.floor(minutos / 60);
  const minutosRestantes = minutos % 60;
  return `${String(horas).padStart(2, "0")}:${String(minutosRestantes).padStart(2, "0")}`;
}

/**
 * Calcula a duração entre dois horários considerando data/hora completa.
 */
export function calcularDuracao(dataHoraInicio, dataHoraFim) {
  const inicio = new Date(dataHoraInicio);
  const fim = new Date(dataHoraFim);
  const duracaoEmMs = fim - inicio;
  return Math.floor(duracaoEmMs / 60000);
}

/**
 * Calcula a quantidade de minutos trabalhados no período noturno (22h às 5h).
 */
export function calcularHoraNoturna(entrada, saidaFinal, saidaIntervalo, voltaIntervalo) {
  const HORA_INICIO_NOTURNA = 22;
  const HORA_FIM_NOTURNA = 5;

  const calcularPeriodoNoturno = (inicio, fim) => {
    let minutosNoturnos = 0;
    const atual = new Date(inicio);
    while (atual < fim) {
      const hora = atual.getHours();
      if (hora >= HORA_INICIO_NOTURNA || hora < HORA_FIM_NOTURNA) {
        minutosNoturnos++;
      }
      atual.setMinutes(atual.getMinutes() + 1);
    }
    return minutosNoturnos;
  };

  const entradaDt = new Date(entrada);
  const saidaFinalDt = new Date(saidaFinal);
  const saidaIntervaloDt = new Date(saidaIntervalo);
  const voltaIntervaloDt = new Date(voltaIntervalo);

  const periodo1 = calcularPeriodoNoturno(entradaDt, saidaIntervaloDt);
  const periodo2 = calcularPeriodoNoturno(voltaIntervaloDt, saidaFinalDt);

  return periodo1 + periodo2;
}

/**
 * Converte uma string de data e hora no formato "DD/MM/AAAA HH:mm" para o formato ISO.
 */
export function converterParaISO(dataStr) {
  const [dia, mes, anoHora] = dataStr.split("/");
  const [ano, hora] = anoHora.split(" ");
  return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}T${hora}`;
}

/**
 * Extrai a data (sem a hora) de uma string de data e hora no formato "DD/MM/AAAA HH:mm"
 */
export function extrairDataISO(dataStr) {
  const [dia, mes, anoHora] = dataStr.split("/");
  const [ano] = anoHora.split(" ");
  return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
}
