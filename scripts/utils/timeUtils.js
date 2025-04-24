// timeUtils.js

/**
 * Converte uma string de horas no formato "hh:mm" para minutos totais.
 * @param {string} horas - String no formato "hh:mm"
 * @returns {number} Minutos totais
 */
export function converterHorasParaMinutos(horas) {
  const [hora, minuto] = horas.split(":").map(Number);
  return hora * 60 + minuto;
}

/**
 * Converte minutos em um formato de horas "hh:mm".
 * @param {number} minutos - Minutos totais
 * @returns {string} Hora no formato "hh:mm"
 */
export function converterMinutosParaHoras(minutos) {
  const horas = Math.floor(minutos / 60);
  const minutosRestantes = minutos % 60;
  return `${String(horas).padStart(2, "0")}:${String(minutosRestantes).padStart(2, "0")}`;
}

/**
 * Calcula a duração entre dois horários.
 * @param {string} inicio - Hora de início no formato "hh:mm"
 * @param {string} fim - Hora de término no formato "hh:mm"
 * @returns {number} Duração em minutos
 */
export function calcularDuracao(inicio, fim) {
  const minutosInicio = converterHorasParaMinutos(inicio);
  const minutosFim = converterHorasParaMinutos(fim);
  return minutosFim - minutosInicio;
}

/**
* Calcula a quantidade de minutos trabalhados no período noturno (22h às 5h),
* desconsiderando o tempo de intervalo.
*
* @param {number} entrada - Horário de entrada (em minutos)
* @param {number} saidaFinal - Horário de saída final (em minutos)
* @param {number} saidaIntervalo - Horário de início do intervalo (em minutos)
* @param {number} voltaIntervalo - Horário de fim do intervalo (em minutos)
* @returns {number} Minutos trabalhados em horário noturno
*/
export function calcularHoraNoturna(entrada, saidaFinal, saidaIntervalo, voltaIntervalo) {
  const horaInicioNoturna = 1320; // 22:00 em minutos
  const horaFimNoturna = 300;     // 05:00 em minutos (do dia seguinte)

  /**
   * Calcula a sobreposição entre um período de trabalho e o horário noturno.
   *
   * @param {number} inicio - Início do período de trabalho (em minutos)
   * @param {number} fim - Fim do período de trabalho (em minutos)
   * @returns {number} Minutos dentro do horário noturno
   */
  const sobreporComHoraNoturna = (inicio, fim) => {
    // Adapta fim para considerar o dia seguinte
    if (fim < inicio) fim += 1440;

    const inicioNoturno = horaInicioNoturna;
    const fimNoturno = horaFimNoturna + 1440;

    const inicioEfetivo = Math.max(inicio, inicioNoturno);
    const fimEfetivo = Math.min(fim, fimNoturno);

    return Math.max(0, fimEfetivo - inicioEfetivo);
  };

  // Parte 1: do início até o início do intervalo
  const periodo1 = sobreporComHoraNoturna(entrada, saidaIntervalo);

  // Parte 2: do fim do intervalo até a saída final
  const periodo2 = sobreporComHoraNoturna(voltaIntervalo, saidaFinal);

  return periodo1 + periodo2;
}