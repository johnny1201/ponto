// pontoController.js
import { calcularDuracao } from "../utils/timeUtils.js";

/**
 * Captura os dados do formulário e retorna um objeto com as informações.
 * @returns {Object|null} Objeto com os dados ou null se houver erro
 */
export function capturarDadosFormulario() {
  const dataRef = document.getElementById("dataRef").value;
  const entrada = document.getElementById("entrada").value;
  const saidaIntervalo = document.getElementById("saidaIntervalo").value;
  const voltaIntervalo = document.getElementById("voltaIntervalo").value;
  const saidaFinal = document.getElementById("saidaFinal").value;

  if (!dataRef || !entrada || !saidaIntervalo || !voltaIntervalo || !saidaFinal) {
    return null;
  }

  return {
    dataRef,
    entrada,
    saidaIntervalo,
    voltaIntervalo,
    saidaFinal
  };
}

/**
 * Calcula as durações (total, noturno, extra) a partir dos horários do ponto.
 * @param {Object} ponto - Objeto com os horários de entrada, intervalo, etc.
 * @returns {Object} Objeto com as durações calculadas
 */
export function calcularDuracoes(ponto) {
  const duracaoTotal = calcularDuracao(ponto.entrada, ponto.saidaFinal);
  const duracaoIntervalo = calcularDuracao(ponto.saidaIntervalo, ponto.voltaIntervalo);

  // Considerando as horas extras e noturnas como exemplo
  const duracaoNoturna = 0; // A lógica para hora noturna pode ser implementada aqui
  const duracaoExtras = Math.max(0, duracaoTotal - 480); // 480 minutos = 8h (exemplo)

  return {
    duracaoTotal,
    duracaoNoturna,
    duracaoExtras
  };
}
