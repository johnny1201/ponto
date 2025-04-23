// Armazena os registros
const registros = [];

document.getElementById('form-ponto').addEventListener('submit', function (e) {
  e.preventDefault();

  // Pegar valores dos inputs
  const dataRef = document.getElementById('dataRef').value;
  const entrada = document.getElementById('entrada').value;
  const saidaIntervalo = document.getElementById('saidaIntervalo').value;
  const voltaIntervalo = document.getElementById('voltaIntervalo').value;
  const saidaFinal = document.getElementById('saidaFinal').value;

  // Criar objeto do registro
  const registro = {
    data: dataRef,
    entrada: new Date(entrada),
    saidaIntervalo: new Date(saidaIntervalo),
    voltaIntervalo: new Date(voltaIntervalo),
    saida: new Date(saidaFinal)
  };

  // Calcular total de horas trabalhadas, noturnas e extras
  const totalTrabalhado = calcularTotalHoras(registro);
  registro.total = totalTrabalhado;
  registro.noturno = calcularHorasNoturnas(registro);
  registro.extra = calcularHorasExtras(registro.entrada, registro.total);

  // Adicionar ao array
  registros.push(registro);

  // Atualizar tabela
  atualizarTabela();
});

// Função para calcular total de horas (entrada até saída - intervalo)
function calcularTotalHoras({ entrada, saidaIntervalo, voltaIntervalo, saida }) {
  const trabalho1 = (saidaIntervalo - entrada); // antes do intervalo
  const trabalho2 = (saida - voltaIntervalo);   // depois do intervalo
  const totalMs = trabalho1 + trabalho2;

  return msParaHoraMinuto(totalMs);
}

// Converte milissegundos para HH:mm
function msParaHoraMinuto(ms) {
  const totalMin = Math.floor(ms / 60000);
  const horas = Math.floor(totalMin / 60).toString().padStart(2, '0');
  const minutos = (totalMin % 60).toString().padStart(2, '0');
  return `${horas}:${minutos}`;
}

function atualizarTabela() {
    const tbody = document.querySelector('#tabelaPonto tbody');
    tbody.innerHTML = ''; // Limpa antes de recriar
  
    let totalMin = 0;
    let totalNoturnoMin = 0;
  
    registros.forEach(reg => {
      const tr = document.createElement('tr');
  
      const entrada = reg.entrada.toLocaleString('pt-BR');
      const saidaIntervalo = reg.saidaIntervalo.toLocaleString('pt-BR');
      const voltaIntervalo = reg.voltaIntervalo.toLocaleString('pt-BR');
      const saida = reg.saida.toLocaleString('pt-BR');
      const total = reg.total || '00:00';
      const noturno = reg.noturno || '00:00';
      const extra = reg.extra || '00:00'; // placeholder por enquanto
  
      tr.innerHTML = `
        <td>${reg.data}</td>
        <td>${entrada}</td>
        <td>${saidaIntervalo}</td>
        <td>${voltaIntervalo}</td>
        <td>${saida}</td>
        <td>${total}</td>
        <td>${noturno}</td>
        <td>${extra}</td>
      `;
  
      const [h, m] = total.split(':').map(Number);
      totalMin += h * 60 + m;
  
      const [nh, nm] = noturno.split(':').map(Number);
      totalNoturnoMin += nh * 60 + nm;
  
      tbody.appendChild(tr);
    });
  
    // Atualizar rodapé
    document.getElementById('totalHoras').textContent = msParaHoraMinuto(totalMin * 60000);
    document.getElementById('totalNoturno').textContent = msParaHoraMinuto(totalNoturnoMin * 60000);
  }  

function calcularHorasNoturnas({ entrada, saidaIntervalo, voltaIntervalo, saida }) {
    const trabalho1 = calcularNoturnoPeriodo(entrada, saidaIntervalo);
    const trabalho2 = calcularNoturnoPeriodo(voltaIntervalo, saida);
  
    const totalMin = trabalho1 + trabalho2;
  
    return msParaHoraMinuto(totalMin * 60000); // Convertendo minutos para HH:mm
  }
  
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
      atual = new Date(atual.getTime() + 60000); // +1 minuto
    }
  
    return minutosNoturnos;
  }
  
  document.getElementById('exportarPdf').addEventListener('click', function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
  
    let y = 10;
    doc.text('Folha de Ponto', 10, y);
    y += 10;
  
    registros.forEach(reg => {
      doc.text(`Data: ${reg.data} | Entrada: ${reg.entrada.toLocaleString('pt-BR')} | Saída Intervalo: ${reg.saidaIntervalo.toLocaleString('pt-BR')} | Volta Intervalo: ${reg.voltaIntervalo.toLocaleString('pt-BR')} | Saída: ${reg.saida.toLocaleString('pt-BR')} | Total: ${reg.total} | Noturno: ${reg.noturno}`, 10, y);
      y += 10;
    });
  
    doc.save('folha_ponto.pdf');
  });
  
  function ehFimDeSemana(data) {
    const dia = data.getDay(); // 0 = Domingo, 6 = Sábado
    return dia === 0 || dia === 6;
  }
  
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
  
  // Salvar após adicionar
localStorage.setItem('registrosPonto', JSON.stringify(registros));

// Carregar ao iniciar
window.addEventListener('DOMContentLoaded', () => {
  const dados = localStorage.getItem('registrosPonto');
  if (dados) {
    const carregados = JSON.parse(dados);
    carregados.forEach(reg => {
      // Reconstruir objetos Date
      reg.entrada = new Date(reg.entrada);
      reg.saidaIntervalo = new Date(reg.saidaIntervalo);
      reg.voltaIntervalo = new Date(reg.voltaIntervalo);
      reg.saida = new Date(reg.saida);
      registros.push(reg);
    });
    atualizarTabela();
  }
});
