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

// Função para validar se o arquivo é válido e é do tipo XLSX
function validarArquivoXlsx(arquivo) {
  return arquivo && arquivo.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
}

// Função para processar o conteúdo do arquivo e extrair os dados
async function processarArquivo(arquivo) {
  try {
    const workbook = await lerArquivoXlsx(arquivo);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const dados = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    return dados;
  } catch (error) {
    throw new Error('Erro ao processar o arquivo.');
  }
}

// Função para ler o arquivo XLSX e retornar um objeto de planilha
function lerArquivoXlsx(arquivo) {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          resolve(workbook);
      };
      reader.onerror = (error) => reject(new Error('Erro ao ler o arquivo.'));
      reader.readAsBinaryString(arquivo);
  });
}

// Função para preencher a tabela com os dados do arquivo
function preencherTabelaComDados(dados) {
  const tbody = document.querySelector('#tabela tbody');
  tbody.innerHTML = '';  // Limpar a tabela existente

  dados.forEach((linha) => {
      const novaLinha = document.createElement('tr');
      linha.forEach((celula) => {
          const td = document.createElement('td');
          td.textContent = celula;
          novaLinha.appendChild(td);
      });
      tbody.appendChild(novaLinha);
  });
}

// Função de callback para lidar com o upload do arquivo
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
document.getElementById('upload').addEventListener('change', handleFileUpload);
