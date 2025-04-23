// Armazena os registros
const registros = [];

// Adiciona um ouvinte para o envio do formulário
document.getElementById('form-ponto').addEventListener('submit', function (e) {
  e.preventDefault();
  const registro = obterRegistroDoFormulario();
  if (registro) {
    registros.push(registro);
    atualizarTabela();
    salvarRegistrosNoLocalStorage();
  }
});

// Função para obter os dados do formulário e calcular as horas
function obterRegistroDoFormulario() {
  const dataRef = document.getElementById('dataRef').value;
  const entrada = document.getElementById('entrada').value;
  const saidaIntervalo = document.getElementById('saidaIntervalo').value;
  const voltaIntervalo = document.getElementById('voltaIntervalo').value;
  const saidaFinal = document.getElementById('saidaFinal').value;

  const registro = criarRegistro(dataRef, entrada, saidaIntervalo, voltaIntervalo, saidaFinal);
  if (!registro) {
    alert('Por favor, preencha todas as datas corretamente.');
    return null;
  }
  return registro;
}

// Cria o objeto de registro e calcula os totais
function criarRegistro(dataRef, entrada, saidaIntervalo, voltaIntervalo, saidaFinal) {
  const registro = {
    data: dataRef,
    entrada: new Date(entrada),
    saidaIntervalo: new Date(saidaIntervalo),
    voltaIntervalo: new Date(voltaIntervalo),
    saida: new Date(saidaFinal),
    total: calcularTotalHoras(entrada, saidaIntervalo, voltaIntervalo, saidaFinal),
    noturno: calcularHorasNoturnas(entrada, saidaIntervalo, voltaIntervalo, saidaFinal),
    extra: calcularHorasExtras(entrada, calcularTotalHoras(entrada, saidaIntervalo, voltaIntervalo, saidaFinal))
  };
  return registro;
}

// Calcula o total de horas trabalhadas
function calcularTotalHoras(entrada, saidaIntervalo, voltaIntervalo, saida) {
  const trabalho1 = (saidaIntervalo - entrada); 
  const trabalho2 = (saida - voltaIntervalo);   
  const totalMs = trabalho1 + trabalho2;
  return msParaHoraMinuto(totalMs);
}

// Converte milissegundos para o formato HH:mm
function msParaHoraMinuto(ms) {
  const totalMin = Math.floor(ms / 60000);
  const horas = Math.floor(totalMin / 60).toString().padStart(2, '0');
  const minutos = (totalMin % 60).toString().padStart(2, '0');
  return `${horas}:${minutos}`;
}

// Atualiza a tabela com os registros
function atualizarTabela() {
  const tbody = document.querySelector('#tabelaPonto tbody');
  tbody.innerHTML = ''; // Limpa a tabela

  let totalMin = 0;
  let totalNoturnoMin = 0;

  registros.forEach(reg => {
    const tr = document.createElement('tr');
    tr.innerHTML = gerarLinhaTabela(reg);
    tbody.appendChild(tr);

    // Acumulando totais
    totalMin += calcularMinutos(reg.total);
    totalNoturnoMin += calcularMinutos(reg.noturno);
  });

  // Atualiza rodapé com totais
  document.getElementById('totalHoras').textContent = msParaHoraMinuto(totalMin * 60000);
  document.getElementById('totalNoturno').textContent = msParaHoraMinuto(totalNoturnoMin * 60000);
}

// Gera uma linha da tabela com os dados do registro
function gerarLinhaTabela(reg) {
  const entrada = reg.entrada.toLocaleString('pt-BR');
  const saidaIntervalo = reg.saidaIntervalo.toLocaleString('pt-BR');
  const voltaIntervalo = reg.voltaIntervalo.toLocaleString('pt-BR');
  const saida = reg.saida.toLocaleString('pt-BR');
  const total = reg.total || '00:00';
  const noturno = reg.noturno || '00:00';
  const extra = reg.extra || '00:00'; // placeholder por enquanto

  return `
    <td>${reg.data}</td>
    <td>${entrada}</td>
    <td>${saidaIntervalo}</td>
    <td>${voltaIntervalo}</td>
    <td>${saida}</td>
    <td>${total}</td>
    <td>${noturno}</td>
    <td>${extra}</td>
  `;
}

// Calcula os minutos de uma hora no formato HH:mm
function calcularMinutos(tempo) {
  const [h, m] = tempo.split(':').map(Number);
  return h * 60 + m;
}

// Calcula as horas noturnas trabalhadas
function calcularHorasNoturnas(entrada, saidaIntervalo, voltaIntervalo, saida) {
  const trabalho1 = calcularNoturnoPeriodo(entrada, saidaIntervalo);
  const trabalho2 = calcularNoturnoPeriodo(voltaIntervalo, saida);
  return msParaHoraMinuto((trabalho1 + trabalho2) * 60000); // Converte minutos para HH:mm
}

// Calcula o número de minutos noturnos em um período específico
function calcularNoturnoPeriodo(inicio, fim) {
  let minutosNoturnos = 0;
  const noturnoInicio = 22; // 22h
  const noturnoFim = 5;     // 5h do dia seguinte
  let atual = new Date(inicio);

  while (atual < fim) {
    const hora = atual.getHours();
    if (hora >= noturnoInicio || hora < noturnoFim) {
      minutosNoturnos++;
    }
    atual = new Date(atual.getTime() + 60000); // Incrementa 1 minuto
  }

  return minutosNoturnos;
}

// Calcula as horas extras trabalhadas
function calcularHorasExtras(entrada, total) {
  const [h, m] = total.split(':').map(Number);
  const minutosTotais = h * 60 + m;
  const jornadaPadraoMin = ehFimDeSemana(entrada) ? 7 * 60 : 7 * 60 + 30;

  if (minutosTotais > jornadaPadraoMin) {
    return msParaHoraMinuto((minutosTotais - jornadaPadraoMin) * 60000);
  } else {
    return '00:00';
  }
}

// Verifica se é fim de semana
function ehFimDeSemana(data) {
  const dia = data.getDay();
  return dia === 0 || dia === 6; // Domingo ou Sábado
}

// Salva os registros no LocalStorage
function salvarRegistrosNoLocalStorage() {
  localStorage.setItem('registrosPonto', JSON.stringify(registros));
}

// Carrega os registros do LocalStorage ao iniciar a página
window.addEventListener('DOMContentLoaded', () => {
  const dados = localStorage.getItem('registrosPonto');
  if (dados) {
    const carregados = JSON.parse(dados);
    carregados.forEach(reg => {
      reg.entrada = new Date(reg.entrada);
      reg.saidaIntervalo = new Date(reg.saidaIntervalo);
      reg.voltaIntervalo = new Date(reg.voltaIntervalo);
      reg.saida = new Date(reg.saida);
      registros.push(reg);
    });
    atualizarTabela();
  }
});

// Função para importar dados de um arquivo XLSX
document.getElementById('fileInput').addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!isValidFile(file)) {
    alert('Por favor, selecione um arquivo .xlsx válido');
    return;
  }

  const reader = new FileReader();
  reader.onload = () => processFile(reader.result);
  reader.readAsBinaryString(file);
}

function isValidFile(file) {
  return file && file.name.endsWith('.xlsx');
}

function processFile(fileData) {
  try {
    const workbook = XLSX.read(fileData, { type: 'binary' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const registros = rows.slice(1).map((row, index) => processRow(row, index + 2)).filter(Boolean);
    atualizarTabela(registros);
  } catch (error) {
    handleError(error, 'Erro ao processar o arquivo XLSX');
  }
}

function processRow(row, rowIndex) {
  try {
    const [dataRef, entrada, saidaIntervalo, voltaIntervalo, saida] = row;
    const parsedData = parseDates([entrada, saidaIntervalo, voltaIntervalo, saida]);

    if (parsedData.some(isNaN)) {
      throw new Error(`Datas inválidas na linha ${rowIndex}`);
    }

    const registro = {
      data: dataRef,
      entrada: parsedData[0],
      saidaIntervalo: parsedData[1],
      voltaIntervalo: parsedData[2],
      saida: parsedData[3],
      total: calcularTotalHoras({ entrada: parsedData[0], saidaIntervalo: parsedData[1], voltaIntervalo: parsedData[2], saida: parsedData[3] }),
      noturno: calcularHorasNoturnas({ entrada: parsedData[0], saidaIntervalo: parsedData[1], voltaIntervalo: parsedData[2], saida: parsedData[3] }),
      extra: calcularHorasExtras({ entrada: parsedData[0], total: calcularTotalHoras({ entrada: parsedData[0], saidaIntervalo: parsedData[1], voltaIntervalo: parsedData[2], saida: parsedData[3] }) })
    };

    return registro;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

function handleError(error, errorMsg) {
  console.error(errorMsg);
  alert(errorMsg);
}
