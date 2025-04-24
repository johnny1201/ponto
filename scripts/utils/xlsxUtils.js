import * as XLSX from 'xlsx';
import { converterParaISO, extrairDataISO } from './timeUtils.js';

/**
 * Converte uma linha de dados da planilha para o formato de ponto.
 */
export function transformarLinhaParaPonto(linha) {
  const [dataEntrada, saidaIntervalo, voltaIntervalo, saidaFinal] = linha;

  if (!dataEntrada || !saidaIntervalo || !voltaIntervalo || !saidaFinal) return null;

  return {
    dataRef: extrairDataISO(dataEntrada),
    entrada: converterParaISO(dataEntrada),
    saidaIntervalo: converterParaISO(saidaIntervalo),
    voltaIntervalo: converterParaISO(voltaIntervalo),
    saidaFinal: converterParaISO(saidaFinal)
  };
}

/**
 * Verifica se o arquivo enviado é do tipo XLSX.
 */
export function validarArquivoXlsx(arquivo) {
  return arquivo && arquivo.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
}

/**
 * Lê o conteúdo de um arquivo XLSX e retorna o objeto de planilha.
 */
export function lerArquivoXlsx(arquivo) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      resolve(workbook);
    };
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo.'));
    reader.readAsArrayBuffer(arquivo);
  });
}

/**
 * Processa um arquivo XLSX, convertendo a primeira aba em array de objetos de ponto.
 */
export async function processarArquivo(arquivo) {
    try {
      const workbook = await lerArquivoXlsx(arquivo);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const dados = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
      // Transformar as linhas em objetos de ponto, descartando linhas inválidas
      const pontos = dados.map(transformarLinhaParaPonto).filter(p => p !== null);
      return pontos;
    } catch (error) {
      throw new Error('Erro ao processar o arquivo.');
    }
  }
  
