import { capturarDadosFormulario, calcularDuracoes } from "../controllers/pontoController.js";
import { adicionarLinhaTabela, atualizarTotais } from "../controllers/tabelaController.js";
import { processarArquivo } from "../utils/xlsxUtils.js";

jest.mock("../controllers/pontoController.js");
jest.mock("../controllers/tabelaController.js");
jest.mock("../utils/xlsxUtils.js");

describe("script.js integration tests", () => {
  let formPonto, fileInput, exportarXlsx, exportarPdf;

  beforeEach(() => {
    document.body.innerHTML = `
      <form id="form-ponto"></form>
      <input type="file" id="fileInput" />
      <button id="exportarXlsx"></button>
      <button id="exportarPdf"></button>
      <table id="tabelaPonto"></table>
    `;

    formPonto = document.getElementById("form-ponto");
    fileInput = document.getElementById("fileInput");
    exportarXlsx = document.getElementById("exportarXlsx");
    exportarPdf = document.getElementById("exportarPdf");
  });

  test("should handle form submission and update totals", () => {
    const mockPonto = { entrada: "08:00", saida: "17:00" };
    const mockDuracoes = { duracaoTotal: 8, duracaoNoturna: 0, duracaoExtras: 0 };

    capturarDadosFormulario.mockReturnValue(mockPonto);
    calcularDuracoes.mockReturnValue(mockDuracoes);

    const submitEvent = new Event("submit");
    formPonto.dispatchEvent(submitEvent);

    expect(capturarDadosFormulario).toHaveBeenCalled();
    expect(calcularDuracoes).toHaveBeenCalledWith(mockPonto);
    expect(adicionarLinhaTabela).toHaveBeenCalledWith(mockPonto, mockDuracoes);
    expect(atualizarTotais).toHaveBeenCalledWith({
      totalHoras: 8,
      totalNoturno: 0,
      totalExtras: 0,
    });
  });

  test("should handle file upload and process data", async () => {
    const mockFile = new File(["content"], "test.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const mockDados = [{ entrada: "08:00", saida: "17:00" }];
    const mockDuracoes = { duracaoTotal: 8, duracaoNoturna: 0, duracaoExtras: 0 };

    processarArquivo.mockResolvedValue(mockDados);
    calcularDuracoes.mockReturnValue(mockDuracoes);

    const changeEvent = { target: { files: [mockFile] } };
    fileInput.dispatchEvent(new Event("change", changeEvent));

    await new Promise(process.nextTick);

    expect(processarArquivo).toHaveBeenCalledWith(mockFile);
    expect(adicionarLinhaTabela).toHaveBeenCalledWith(mockDados[0], mockDuracoes);
    expect(atualizarTotais).toHaveBeenCalledWith({
      totalHoras: 8,
      totalNoturno: 0,
      totalExtras: 0,
    });
  });

  test("should handle XLSX export", () => {
    const mockTable = document.getElementById("tabelaPonto");
    const mockSheet = {};
    const mockWorkbook = {};

    global.XLSX = {
      utils: {
        table_to_sheet: jest.fn(() => mockSheet),
        book_new: jest.fn(() => mockWorkbook),
        book_append_sheet: jest.fn(),
      },
      writeFile: jest.fn(),
    };

    exportarXlsx.click();

    expect(XLSX.utils.table_to_sheet).toHaveBeenCalledWith(mockTable);
    expect(XLSX.utils.book_new).toHaveBeenCalled();
    expect(XLSX.utils.book_append_sheet).toHaveBeenCalledWith(mockWorkbook, mockSheet, "Ponto");
    expect(XLSX.writeFile).toHaveBeenCalledWith(mockWorkbook, "folha_de_ponto.xlsx");
  });

  test("should handle PDF export", () => {
    const mockDoc = {
      autoTable: jest.fn(),
      save: jest.fn(),
    };

    global.jsPDF = jest.fn(() => mockDoc);

    exportarPdf.click();

    expect(jsPDF).toHaveBeenCalled();
    expect(mockDoc.autoTable).toHaveBeenCalledWith({ html: "#tabelaPonto" });
    expect(mockDoc.save).toHaveBeenCalledWith("folha_de_ponto.pdf");
  });

  test("should handle errors during file processing", async () => {
    const mockError = new Error("File processing failed");
    processarArquivo.mockRejectedValue(mockError);

    const mockFile = new File(["content"], "test.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const changeEvent = { target: { files: [mockFile] } };
    fileInput.dispatchEvent(new Event("change", changeEvent));

    await new Promise(process.nextTick);

    expect(processarArquivo).toHaveBeenCalledWith(mockFile);
    expect(adicionarLinhaTabela).not.toHaveBeenCalled();
    expect(atualizarTotais).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(mockError);
  });
});