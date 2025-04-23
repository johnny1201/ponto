// tabelaController.js
import { converterMinutosParaHoras } from "../utils/timeUtils.js";

/**
 * Adiciona uma nova linha à tabela com os dados do ponto.
 * @param {Object} ponto - Objeto com os dados do ponto
 * @param {Object} duracoes - Objeto com as durações calculadas
 */
export function adicionarLinhaTabela(ponto, duracoes) {
  const tabelaPonto = document.getElementById("tabelaPonto").getElementsByTagName("tbody")[0];
  
  const novaLinha = tabelaPonto.insertRow();
  
  novaLinha.insertCell(0).textContent = ponto.dataRef;
  novaLinha.insertCell(1).textContent = ponto.entrada;
  novaLinha.insertCell(2).textContent = ponto.saidaIntervalo;
  novaLinha.insertCell(3).textContent = ponto.voltaIntervalo;
  novaLinha.insertCell(4).textContent = ponto.saidaFinal;
  novaLinha.insertCell(5).textContent = converterMinutosParaHoras(duracoes.duracaoTotal);
  novaLinha.insertCell(6).textContent = converterMinutosParaHoras(duracoes.duracaoNoturna);
  novaLinha.insertCell(7).textContent = converterMinutosParaHoras(duracoes.duracaoExtras);
}

/**
 * Atualiza os totais na tabela (Total de Horas, Noturnas, Extras).
 * @param {Object} totais - Objeto com totais de horas, extras e noturnas
 */
export function atualizarTotais(totais) {
  document.getElementById("totalHoras").textContent = converterMinutosParaHoras(totais.totalHoras);
  document.getElementById("totalNoturno").textContent = converterMinutosParaHoras(totais.totalNoturno);
  document.getElementById("totalExtras").textContent = converterMinutosParaHoras(totais.totalExtras);
}
