// tabelaController.js
import { converterMinutosParaHoras } from "../utils/timeUtils.js";

/**
 * Adiciona uma nova linha à tabela com os dados do ponto.
 * @param {Object} ponto - Objeto com os dados do ponto
 * @param {Object} duracoes - Objeto com as durações calculadas (total, noturno, extra)
 */
export function adicionarLinhaTabela(ponto, duracoes) {
  const tbody = document.querySelector('#tabelaPonto tbody');
  const novaLinha = document.createElement('tr');

  const dadosPonto = [
    ponto.dataRef,
    ponto.entrada,
    ponto.saidaIntervalo,
    ponto.voltaIntervalo,
    ponto.saidaFinal,
    converterMinutosParaHoras(duracoes.duracaoTotal),
    converterMinutosParaHoras(duracoes.duracaoNoturna),
    converterMinutosParaHoras(duracoes.duracaoExtras)
  ];

  dadosPonto.forEach((valor) => {
    const td = document.createElement('td');
    td.textContent = valor;
    novaLinha.appendChild(td);
  });

  tbody.appendChild(novaLinha);
}

/**
 * Atualiza os totais na tabela (Total de Horas, Noturnas, Extras).
 * @param {Object} totais - Objeto com totais de horas, extras e noturnas
 */
export function atualizarTotais(totais) {
  const totalHoras = document.getElementById("totalHoras");
  const totalNoturno = document.getElementById("totalNoturno");
  const totalExtras = document.getElementById("totalExtras");

  totalHoras.textContent = converterMinutosParaHoras(totais.totalHoras);
  totalNoturno.textContent = converterMinutosParaHoras(totais.totalNoturno);
  totalExtras.textContent = converterMinutosParaHoras(totais.totalExtras);
}

