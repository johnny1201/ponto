// script.js
import { capturarDadosFormulario, calcularDuracoes } from "./controllers/pontoController.js";
import { adicionarLinhaTabela, atualizarTotais } from "./controllers/tabelaController.js";
import { processarArquivo } from "./utils/xlsxUtils.js";  // Remova as importações não utilizadas

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
  dados.forEach((ponto) => {
    const duracoes = calcularDuracoes(ponto);
    adicionarLinhaTabela(ponto, duracoes);

    // Atualizando os totais após a adição de cada linha
    totais.totalHoras += duracoes.duracaoTotal;
    totais.totalNoturno += duracoes.duracaoNoturna;
    totais.totalExtras += duracoes.duracaoExtras;
  });

  // Atualizando os totais da tabela após a importação
  atualizarTotais(totais);
}


/**
 * Função de callback para lidar com o upload do arquivo XLSX.
 * Valida o arquivo, processa seu conteúdo e preenche a tabela com os dados extraídos.
 * @param {Event} event - O evento de mudança no input de arquivo.
 */
async function handleFileUpload(event) {
  const arquivo = event.target.files[0];

  if (!arquivo || !arquivo.name.endsWith('.xlsx')) {
      alert('Por favor, envie um arquivo XLSX válido!');
      return;
  }

  try {
      const dados = await processarArquivo(arquivo);  // A função processa e retorna os dados
      preencherTabelaComDados(dados);
  } catch (error) {
      alert(error.message || 'Erro ao processar o arquivo. Tente novamente.');
      console.error(error);
  }
}

// Configuração do evento de upload
document.getElementById('fileInput').addEventListener('change', handleFileUpload);

// script.js
document.getElementById('exportarXlsx').addEventListener('click', () => {
  const ws = XLSX.utils.table_to_sheet(document.getElementById('tabelaPonto'));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Ponto");
  XLSX.writeFile(wb, 'folha_de_ponto.xlsx');
});

// script.js
document.getElementById('exportarPdf').addEventListener('click', () => {
  const doc = new jsPDF();
  doc.autoTable({ html: '#tabelaPonto' });
  doc.save('folha_de_ponto.pdf');
});
