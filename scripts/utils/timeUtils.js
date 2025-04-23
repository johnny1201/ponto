// pontoController.js
import {
    calcularDuracao,
    calcularHoraNoturna,
    converterHorasParaMinutos
  } from "../utils/timeUtils.js";
  
  const DURACAO_SEGUNDA_QUINTA = 450; // 7h30 em minutos
  const DURACAO_SEXTA_FIM_DE_SEMANA = 420; // 7h em minutos
  
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
    const entrada = converterHorasParaMinutos(ponto.entrada);
    const saidaIntervalo = converterHorasParaMinutos(ponto.saidaIntervalo);
    const voltaIntervalo = converterHorasParaMinutos(ponto.voltaIntervalo);
    const saidaFinal = converterHorasParaMinutos(ponto.saidaFinal);
  
    const duracaoTrabalho = saidaFinal - entrada;
    const duracaoIntervalo = voltaIntervalo - saidaIntervalo;
    const duracaoTotal = duracaoTrabalho - duracaoIntervalo;
  
    const duracaoNoturna = calcularHoraNoturna(entrada, saidaFinal, saidaIntervalo, voltaIntervalo);
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
  