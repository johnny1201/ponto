// script.js
import { capturarDadosFormulario, calcularDuracoes } from "./controllers/pontoController.js";
import { adicionarLinhaTabela, atualizarTotais } from "./controllers/tabelaController.js";
import {
  transformarLinhaParaPonto,
  validarArquivoXlsx,
  lerArquivoXlsx,
  processarArquivo
} from "./utils/xlsxUtils.js";

// Variáveis globais para armazenar totais
let totais = {
  totalHoras: 0,
  totalNoturno: 0,
  totalExtras: 0
};

/**
 * Manipulador do envio do formulário de ponto.
 * Captura os dados do formulário, calcula as durações e adiciona uma nova linha à tabela.
 * Atualiza os totais acumulados de horas, horas noturnas e horas extras.
 * @param {Event} event - O evento de envio do formulário.
 */
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

/**
 * Preenche a tabela HTML com os dados extraídos do arquivo XLSX.
 * @param {Object[]} dados - Array de objetos contendo os dados do ponto.
 */
function preencherTabelaComDados(dados) {
  const tbody = document.querySelector('#tabela tbody');
  tbody.innerHTML = '';  // Limpar a tabela existente

  dados.forEach((ponto) => {
    const novaLinha = document.createElement('tr');
    
    Object.values(ponto).forEach((valor) => {
      const td = document.createElement('td');
      td.textContent = valor;
      novaLinha.appendChild(td);
    });

    tbody.appendChild(novaLinha);
  });
}

/**
 * Função de callback para lidar com o upload do arquivo XLSX.
 * Valida o arquivo, processa seu conteúdo e preenche a tabela com os dados extraídos.
 * @param {Event} event - O evento de mudança no input de arquivo.
 */
async function handleFileUpload(event) {
  const arquivo = event.target.files[0];

  if (!validarArquivoXlsx(arquivo)) {
      alert('Por favor, envie um arquivo XLSX válido!');
      return;
  }

  try {
      const dados = await processarArquivo(arquivo);
      preencherTabelaComDados(dados);
  } catch (error) {
      alert(error.message || 'Erro ao processar o arquivo. Tente novamente.');
      console.error(error);
  }
}

// Configuração do evento de upload
document.getElementById('fileInput').addEventListener('change', handleFileUpload);
