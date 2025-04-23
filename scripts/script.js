// script.js
import { capturarDadosFormulario, calcularDuracoes } from "./controllers/pontoController.js";
import { adicionarLinhaTabela, atualizarTotais } from "./controllers/tabelaController.js";

// Variáveis globais para armazenar totais
let totais = {
  totalHoras: 0,
  totalNoturno: 0,
  totalExtras: 0
};

// Manipulador de envio do formulário
document.getElementById("form-ponto").addEventListener("submit", function(event) {
  event.preventDefault();

  const ponto = capturarDadosFormulario();
  if (!ponto) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  const duracoes = calcularDuracoes(ponto);
  adicionarLinhaTabela(ponto, duracoes);

  totais.totalHoras += duracoes.duracaoTotal;
  totais.totalNoturno += duracoes.duracaoNoturna;
  totais.totalExtras += duracoes.duracaoExtras;

  atualizarTotais(totais);
});
