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
  