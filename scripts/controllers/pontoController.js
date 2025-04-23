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
const DURACAO_SEGUNDA_QUINTA = 450; // 7h30 em minutos
const DURACAO_SEXTA_FIM_DE_SEMANA = 420; // 7h em minutos

export function calcularDuracoes(ponto) {
  const duracaoTotal = calcularDuracao(ponto.entrada, ponto.saidaFinal);
  const duracaoIntervalo = calcularDuracao(ponto.saidaIntervalo, ponto.voltaIntervalo);
  const duracaoEsperada = obterDuracaoEsperada(ponto.entrada);

  const duracaoNoturna = 0; // Implementar lógica para hora noturna, se necessário
  const duracaoExtras = Math.max(0, duracaoTotal - duracaoEsperada);

  return {
    duracaoTotal,
    duracaoNoturna,
    duracaoExtras
  };
}

function obterDuracaoEsperada(entrada) {
  const diaSemana = new Date(entrada).getDay();
  return (diaSemana === 5 || diaSemana === 6) 
    ? DURACAO_SEXTA_FIM_DE_SEMANA 
    : DURACAO_SEGUNDA_QUINTA;
}

