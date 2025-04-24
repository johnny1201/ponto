import {
    capturarDadosFormulario,
    calcularDuracoes
  } from "../controllers/pontoController.js";
  import * as timeUtils from "../utils/timeUtils.js";
  
  jest.mock("../utils/timeUtils.js", () => ({
    calcularDuracao: jest.fn(),
    calcularHoraNoturna: jest.fn(),
  }));
  
  describe("pontoController", () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <input id="dataRef" value="2023-10-04" />
        <input id="entrada" value="2023-10-04T08:00" />
        <input id="saidaIntervalo" value="2023-10-04T12:00" />
        <input id="voltaIntervalo" value="2023-10-04T13:00" />
        <input id="saidaFinal" value="2023-10-04T17:00" />
      `;
  
      timeUtils.calcularDuracao.mockReset();
      timeUtils.calcularHoraNoturna.mockReset();
    });
  
    describe("capturarDadosFormulario", () => {
      it("should capture form data correctly", () => {
        const resultado = capturarDadosFormulario();
        expect(resultado).toEqual({
          dataRef: "2023-10-04",
          entrada: "2023-10-04T08:00",
          saidaIntervalo: "2023-10-04T12:00",
          voltaIntervalo: "2023-10-04T13:00",
          saidaFinal: "2023-10-04T17:00",
        });
      });
  
      it("should return null if any field is missing", () => {
        document.getElementById("saidaFinal").value = "";
        expect(capturarDadosFormulario()).toBeNull();
      });
  
      it("should return null if multiple fields are missing", () => {
        document.getElementById("entrada").value = "";
        document.getElementById("voltaIntervalo").value = "";
        expect(capturarDadosFormulario()).toBeNull();
      });
    });
  
    describe("calcularDuracoes", () => {
      const ponto = {
        dataRef: "2023-10-04",
        entrada: "2023-10-04T08:00",
        saidaIntervalo: "2023-10-04T12:00",
        voltaIntervalo: "2023-10-04T13:00",
        saidaFinal: "2023-10-04T18:00",
      };
  
      it("should calculate durations including extras", () => {
        timeUtils.calcularDuracao.mockImplementation((inicio, fim) => {
          if (inicio === ponto.entrada && fim === ponto.saidaFinal) return 600; // 10h
          if (inicio === ponto.saidaIntervalo && fim === ponto.voltaIntervalo) return 60; // 1h
          return 0;
        });
  
        timeUtils.calcularHoraNoturna.mockReturnValue(30);
  
        const resultado = calcularDuracoes(ponto);
        expect(resultado).toEqual({
          duracaoTotal: 540,       // 10h - 1h = 9h => 540 minutos
          duracaoNoturna: 30,
          duracaoExtras: 90        // 540 - 450 = 90 minutos extras
        });
      });
  
      it("should use 7h (420 min) as expected on Fridays", () => {
        const pontoSexta = { ...ponto, dataRef: "2023-10-06" }; // sexta-feira
        timeUtils.calcularDuracao.mockImplementation((inicio, fim) => {
          if (inicio === pontoSexta.entrada && fim === pontoSexta.saidaFinal) return 540;
          if (inicio === pontoSexta.saidaIntervalo && fim === pontoSexta.voltaIntervalo) return 60;
          return 0;
        });
        timeUtils.calcularHoraNoturna.mockReturnValue(0);
  
        const resultado = calcularDuracoes(pontoSexta);
        expect(resultado).toEqual({
          duracaoTotal: 480,
          duracaoNoturna: 0,
          duracaoExtras: 60 // 480 - 420
        });
      });
  
      it("should correctly calculate durations for weekends", () => {
        const pontoFimDeSemana = { ...ponto, dataRef: "2023-10-07" }; // sábado
        timeUtils.calcularDuracao.mockImplementation((inicio, fim) => {
          if (inicio === pontoFimDeSemana.entrada && fim === pontoFimDeSemana.saidaFinal) return 600; // 10h
          if (inicio === pontoFimDeSemana.saidaIntervalo && fim === pontoFimDeSemana.voltaIntervalo) return 60; // 1h
          return 0;
        });
        timeUtils.calcularHoraNoturna.mockReturnValue(0);
  
        const resultado = calcularDuracoes(pontoFimDeSemana);
        expect(resultado).toEqual({
          duracaoTotal: 540,       // 10h - 1h = 9h => 540 minutos
          duracaoNoturna: 0,
          duracaoExtras: 120      // 540 - 420 (fim de semana)
        });
      });
  
      it("should calculate extra hours correctly when total duration is lower than expected", () => {
        const pontoBaixaDuracao = { ...ponto, saidaFinal: "2023-10-04T16:00" }; // saída 1h mais cedo
        timeUtils.calcularDuracao.mockImplementation((inicio, fim) => {
          if (inicio === pontoBaixaDuracao.entrada && fim === pontoBaixaDuracao.saidaFinal) return 540; // 9h
          if (inicio === pontoBaixaDuracao.saidaIntervalo && fim === pontoBaixaDuracao.voltaIntervalo) return 60; // 1h
          return 0;
        });
        timeUtils.calcularHoraNoturna.mockReturnValue(0);
  
        const resultado = calcularDuracoes(pontoBaixaDuracao);
        expect(resultado).toEqual({
          duracaoTotal: 480,        // 9h - 1h = 8h => 480 minutos
          duracaoNoturna: 0,
          duracaoExtras: 60         // 480 - 420
        });
      });
    });
  });
  