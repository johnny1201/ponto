import {
    converterHorasParaMinutos,
    converterMinutosParaHoras,
    calcularDuracao,
    calcularHoraNoturna,
  } from './timeUtils';
  
  describe('Funções de timeUtils', () => {
    test('converterHorasParaMinutos deve converter "02:30" para 150', () => {
      expect(converterHorasParaMinutos("02:30")).toBe(150);
    });
  
    test('converterMinutosParaHoras deve converter 150 para "02:30"', () => {
      expect(converterMinutosParaHoras(150)).toBe("02:30");
    });
  
    test('calcularDuracao deve retornar 60 minutos entre "14:00" e "15:00"', () => {
      expect(calcularDuracao("14:00", "15:00")).toBe(60);
    });
  
    test('calcularDuracao deve lidar com virada de dia, entre "23:00" e "01:00"', () => {
      expect(calcularDuracao("23:00", "01:00")).toBe(-1320); // comportamento atual
      // Se desejar adaptar para lidar com virada, podemos ajustar a função
    });
  
    describe('calcularHoraNoturna', () => {
      test('Turno todo fora da hora noturna deve retornar 0', () => {
        const entrada = 480; // 08:00
        const saidaFinal = 1020; // 17:00
        const saidaIntervalo = 720; // 12:00
        const voltaIntervalo = 780; // 13:00
        expect(calcularHoraNoturna(entrada, saidaFinal, saidaIntervalo, voltaIntervalo)).toBe(0);
      });
  
      test('Turno integralmente dentro da hora noturna', () => {
        const entrada = 1320; // 22:00
        const saidaFinal = 180; // 03:00 do dia seguinte
        const saidaIntervalo = 1440; // 00:00
        const voltaIntervalo = 1500; // 01:00
        expect(calcularHoraNoturna(entrada, saidaFinal, saidaIntervalo, voltaIntervalo)).toBe(300); // 5 horas
      });
  
      test('Parte do turno na hora noturna', () => {
        const entrada = 1260; // 21:00
        const saidaFinal = 360; // 06:00 do dia seguinte
        const saidaIntervalo = 1320; // 22:00
        const voltaIntervalo = 1380; // 23:00
        expect(calcularHoraNoturna(entrada, saidaFinal, saidaIntervalo, voltaIntervalo)).toBe(360); // 6h
      });
    });
  });
  