document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-ponto");
    const tabela = document.querySelector("#tabelaPonto tbody");
  
    // Escuta o envio do formulário para cadastrar o ponto manualmente
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const dados = capturarDadosFormulario();
      if (!dados) return;
  
      const duracoes = calcularDuracoes(dados);
      adicionarLinhaTabela(dados, duracoes);
      atualizarTotais();
      form.reset();
    });
  });
  
  /**
   * Captura e valida os dados do formulário de ponto.
   * @returns {Object|null} Objeto com os horários ou null se houver campos vazios.
   */
  function capturarDadosFormulario() {
    const dataRef = document.getElementById("dataRef").value;
    const entrada = document.getElementById("entrada").value;
    const saidaIntervalo = document.getElementById("saidaIntervalo").value;
    const voltaIntervalo = document.getElementById("voltaIntervalo").value;
    const saidaFinal = document.getElementById("saidaFinal").value;
  
    if (!(dataRef && entrada && saidaIntervalo && voltaIntervalo && saidaFinal)) {
      alert("Preencha todos os campos!");
      return null;
    }
  
    return { dataRef, entrada, saidaIntervalo, voltaIntervalo, saidaFinal };
  }
  
  /**
   * Calcula a duração total trabalhada, noturna e horas extras.
   * @param {Object} horários - Contém os horários de entrada e saída.
   * @returns {Object} Objeto com as durações formatadas.
   */
  function calcularDuracoes({ entrada, saidaIntervalo, voltaIntervalo, saidaFinal }) {
    const msEntrada = new Date(entrada).getTime();
    const msSaidaIntervalo = new Date(saidaIntervalo).getTime();
    const msVoltaIntervalo = new Date(voltaIntervalo).getTime();
    const msSaidaFinal = new Date(saidaFinal).getTime();
  
    const intervalo = msVoltaIntervalo - msSaidaIntervalo;
    const trabalho = (msSaidaFinal - msEntrada) - intervalo;
  
    return {
      total: formatarDuracao(trabalho),
      noturno: calcularHorasNoturnas(entrada, saidaFinal),
      extra: calcularHorasExtras(trabalho)
    };
  }
  
  /**
   * Adiciona uma nova linha à tabela com os dados do ponto.
   * @param {Object} dados - Horários brutos.
   * @param {Object} duracoes - Cálculos das durações totais.
   */
  function adicionarLinhaTabela(dados, duracoes) {
    const linha = document.createElement("tr");
  
    linha.innerHTML = `
      <td>${dados.dataRef}</td>
      <td>${formatarDataHora(dados.entrada)}</td>
      <td>${formatarDataHora(dados.saidaIntervalo)}</td>
      <td>${formatarDataHora(dados.voltaIntervalo)}</td>
      <td>${formatarDataHora(dados.saidaFinal)}</td>
      <td>${duracoes.total}</td>
      <td>${duracoes.noturno}</td>
      <td>${duracoes.extra}</td>
    `;
  
    document.querySelector("#tabelaPonto tbody").appendChild(linha);
  }
  
  /**
   * Formata uma data/hora no estilo brasileiro (DD/MM/AAAA HH:mm).
   * @param {string} valor - String no formato datetime-local.
   * @returns {string} Data formatada.
   */
  function formatarDataHora(valor) {
    return new Date(valor).toLocaleString("pt-BR").replace(",", "");
  }
  
  /**
   * Converte uma duração em milissegundos para o formato HH:mm.
   * @param {number} ms - Duração em milissegundos.
   * @returns {string} Duração formatada.
   */
  function formatarDuracao(ms) {
    const totalMinutos = Math.floor(ms / 60000);
    const horas = String(Math.floor(totalMinutos / 60)).padStart(2, "0");
    const minutos = String(totalMinutos % 60).padStart(2, "0");
    return `${horas}:${minutos}`;
  }
  
  /**
   * Calcula as horas noturnas (entre 22h e 5h).
   * @param {string} inicio - Horário de início do trabalho.
   * @param {string} fim - Horário de fim do trabalho.
   * @returns {string} Total noturno formatado.
   */
  function calcularHorasNoturnas(inicio, fim) {
    // Ainda não implementado. Retorna 00:00 como padrão.
    return "00:00";
  }
  
  /**
   * Calcula as horas extras com base em 8h como jornada padrão.
   * @param {number} msTrabalhadas - Duração total em milissegundos.
   * @returns {string} Horas extras formatadas.
   */
  function calcularHorasExtras(msTrabalhadas) {
    const limiteJornada = 8 * 60 * 60000; // 8 horas em milissegundos
    const extra = msTrabalhadas - limiteJornada;
    return extra > 0 ? formatarDuracao(extra) : "00:00";
  }
  
  /**
   * Atualiza os totais no rodapé da tabela com a soma das horas.
   */
  function atualizarTotais() {
    let totalMs = 0;
    let totalExtrasMs = 0;
    let totalNoturnoMs = 0;
  
    document.querySelectorAll("#tabelaPonto tbody tr").forEach(linha => {
      const [_, __, ___, ____, _____, total, noturno, extra] = linha.children;
  
      totalMs += converterParaMs(total.textContent);
      totalNoturnoMs += converterParaMs(noturno.textContent);
      totalExtrasMs += converterParaMs(extra.textContent);
    });
  
    document.getElementById("totalHoras").textContent = formatarDuracao(totalMs);
    document.getElementById("totalNoturno").textContent = formatarDuracao(totalNoturnoMs);
    document.getElementById("totalExtras").textContent = formatarDuracao(totalExtrasMs);
  }
  
  /**
   * Converte uma string no formato HH:mm para milissegundos.
   * @param {string} horaStr - Duração no formato HH:mm.
   * @returns {number} Milissegundos.
   */
  function converterParaMs(horaStr) {
    const [h, m] = horaStr.split(":").map(Number);
    return (h * 60 + m) * 60000;
  }
  