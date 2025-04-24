import {
  converterHorasParaMinutos,
  converterMinutosParaHoras,
  calcularDuracao,
  calcularHoraNoturna,
  converterParaISO,
  extrairDataISO
} from '../utils/timeUtils.js'; // ajuste o caminho conforme seu projeto

describe('Funções de timeUtils', () => {

  test('converterHorasParaMinutos deve converter "02:30" em 150 minutos', () => {
    expect(converterHorasParaMinutos("02:30")).toBe(150);
  });

  test('converterMinutosParaHoras deve converter 150 em "02:30"', () => {
    expect(converterMinutosParaHoras(150)).toBe("02:30");
  });

  test('calcularDuracao deve calcular corretamente a diferença entre duas datas', () => {
    const inicio = "2025-04-23T22:00";
    const fim = "2025-04-23T23:30";
    expect(calcularDuracao(inicio, fim)).toBe(90);
  });

  test('calcularHoraNoturna deve retornar minutos entre 22h e 05h', () => {
    const entrada = "2025-04-23T21:00";
    const saidaIntervalo = "2025-04-23T23:00";
    const voltaIntervalo = "2025-04-24T03:00";
    const saidaFinal = "2025-04-24T06:00";
    expect(calcularHoraNoturna(entrada, saidaFinal, saidaIntervalo, voltaIntervalo)).toBeGreaterThan(0);
  });

  test('converterParaISO deve converter "23/04/2025 15:30" para "2025-04-23T15:30"', () => {
    expect(converterParaISO("23/04/2025 15:30")).toBe("2025-04-23T15:30");
  });

  test('extrairDataISO deve extrair "2025-04-23" de "23/04/2025 15:30"', () => {
    expect(extrairDataISO("23/04/2025 15:30")).toBe("2025-04-23");
  });

});
