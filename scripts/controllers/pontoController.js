// pontoController.js
import {
  calcularDuracao,
  calcularHoraNoturna
} from "../utils/timeUtils.js";

const DURACAO_SEGUNDA_QUINTA = 450; // 7h30 em minutos
const DURACAO_SEXTA_FIM_DE_SEMANA = 420; // 7h em minutos

/**
 * Captura os dados do formulário e retorna um objeto com as informações em formato ISO.
 * @returns {Object|null} Objeto com os dados ou null se houver erro
 */
export function capturarDadosFormulario() {
  const dataRef = document.getElementById("dataRef").value; // formato: yyyy-mm-dd
  const entrada = document.getElementById("entrada").value; // hh:mm
  const saidaIntervalo = document.getElementById("saidaIntervalo").value;
  const voltaIntervalo = document.getElementById("voltaIntervalo").value;
  const saidaFinal = document.getElementById("saidaFinal").value;

  if (!dataRef || !entrada || !saidaIntervalo || !voltaIntervalo || !saidaFinal) {
    return null;
  }

  // Adiciona a data aos horários
  const entradaFull = `${dataRef}T${entrada}`;
  const saidaIntervaloFull = `${dataRef}T${saidaIntervalo}`;
  const voltaIntervaloFull = `${dataRef}T${voltaIntervalo}`;
  const saidaFinalFull = `${dataRef}T${saidaFinal}`;

  return {
    dataRef,
    entrada: entradaFull,
    saidaIntervalo: saidaIntervaloFull,
    voltaIntervalo: voltaIntervaloFull,
    saidaFinal: saidaFinalFull
  };
}

/**
 * Calcula as durações (total, noturno, extra) a partir dos horários do ponto.
 * @param {Object} ponto - Objeto com os horários de entrada, intervalo, etc.
 * @returns {Object} Objeto com as durações calculadas
 */
export function calcularDuracoes(ponto) {
  const duracaoTrabalho = calcularDuracao(ponto.entrada, ponto.saidaFinal);
  const duracaoIntervalo = calcularDuracao(ponto.saidaIntervalo, ponto.voltaIntervalo);
  const duracaoTotal = duracaoTrabalho - duracaoIntervalo;

  const duracaoNoturna = calcularHoraNoturna(
    ponto.entrada,
    ponto.saidaFinal,
    ponto.saidaIntervalo,
    ponto.voltaIntervalo
  );

  const duracaoEsperada = obterDuracaoEsperada(ponto.dataRef);
  const duracaoExtras = Math.max(0, duracaoTotal - duracaoEsperada);

  return {
    duracaoTotal,
    duracaoNoturna,
    duracaoExtras
  };
}

function obterDuracaoEsperada(data) {
  const diaSemana = new Date(data).getDay(); // 0 = domingo, 6 = sábado
  return (diaSemana === 5 || diaSemana === 6)
    ? DURACAO_SEXTA_FIM_DE_SEMANA
    : DURACAO_SEGUNDA_QUINTA;
}
