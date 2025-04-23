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

  // Calcular total de horas trabalhadas (sem noturno ainda)
  const totalTrabalhado = calcularTotalHoras(registro);
  registro.total = totalTrabalhado;
  registro.noturno = calcularHorasNoturnas(registro);

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
  