const xlsxUtils = require('../xlsxUtils'); // Ajuste o caminho conforme necessário
const XLSX = require('xlsx');

jest.mock('xlsx', () => ({
  utils: {
    sheet_to_json: jest.fn(),
  },
  read: jest.fn(),
  writeFile: jest.fn(),
}));

describe('xlsxUtils', () => {
  describe('transformarLinhaParaPonto', () => {
    test('should transform a valid row to ponto format', () => {
      const linha = ['2025-04-24 08:00', '2025-04-24 12:00', '2025-04-24 13:00', '2025-04-24 17:00'];
      const result = xlsxUtils.transformarLinhaParaPonto(linha);

      expect(result).toBeDefined();
      expect(result).toEqual({
        dataRef: expect.any(String),
        entrada: expect.any(String),
        saidaIntervalo: expect.any(String),
        voltaIntervalo: expect.any(String),
        saidaFinal: expect.any(String),
      });
    });

    test('should return null if any required field is missing', () => {
      const linhaIncompleta = ['2025-04-24 08:00', '2025-04-24 12:00', '', '2025-04-24 17:00'];
      const result = xlsxUtils.transformarLinhaParaPonto(linhaIncompleta);
      expect(result).toBeNull();
    });
  });

  describe('validateArquivoXlsx', () => {
    test('should return true for valid XLSX file', () => {
      const validFile = { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
      expect(xlsxUtils.validarArquivoXlsx(validFile)).toBe(true);
    });

    test('should return false for invalid file type', () => {
      const invalidFile = { type: 'text/plain' };
      expect(xlsxUtils.validarArquivoXlsx(invalidFile)).toBe(false);
    });
  });

  describe('lerArquivoXlsx', () => {
    test('should read and resolve the file correctly', (done) => {
      const mockFile = new Blob(['mock data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const fileReaderMock = jest.fn().mockImplementationOnce(() => ({
        onload: (e) => e.target.result = new ArrayBuffer(8), // Mocked result
        readAsArrayBuffer: jest.fn(),
      }));
      global.FileReader = fileReaderMock;

      xlsxUtils.lerArquivoXlsx(mockFile).then((workbook) => {
        expect(workbook).toBeDefined();
        done();
      });

      const fileReader = new FileReader();
      fileReader.onload({ target: { result: new ArrayBuffer(8) } });
    });

    test('should reject if there is an error reading the file', async () => {
      const mockFile = new Blob(['invalid file'], { type: 'text/plain' });
      await expect(xlsxUtils.lerArquivoXlsx(mockFile)).rejects.toThrow('Erro ao ler o arquivo.');
    });

    test('should reject if the file is empty', async () => {
      const mockEmptyFile = new Blob([''], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      await expect(xlsxUtils.lerArquivoXlsx(mockEmptyFile)).rejects.toThrow('Erro ao ler o arquivo.');
    });
  });

  describe('processarArquivo', () => {
    test('should process a valid XLSX file and return pontos', async () => {
      const mockFile = new Blob(['valid file content'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const mockWorkbook = { Sheets: { 'Sheet1': {} }, SheetNames: ['Sheet1'] };
      const mockData = [['2025-04-24 08:00', '2025-04-24 12:00', '2025-04-24 13:00', '2025-04-24 17:00']];
      XLSX.read.mockReturnValue(mockWorkbook);
      XLSX.utils.sheet_to_json.mockReturnValue(mockData);

      const pontos = await xlsxUtils.processarArquivo(mockFile);
      expect(pontos).toBeDefined();
      expect(pontos).toEqual([{
        dataRef: expect.any(String),
        entrada: expect.any(String),
        saidaIntervalo: expect.any(String),
        voltaIntervalo: expect.any(String),
        saidaFinal: expect.any(String),
      }]);
    });

    test('should throw an error if the file is invalid', async () => {
      const mockFile = new Blob(['invalid file content'], { type: 'text/plain' });
      XLSX.read.mockImplementation(() => { throw new Error('Invalid file'); });

      await expect(xlsxUtils.processarArquivo(mockFile)).rejects.toThrow('Erro ao processar o arquivo.');
    });

    test('should handle empty files gracefully', async () => {
      const mockEmptyFile = new Blob([''], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      XLSX.read.mockImplementation(() => { return { Sheets: { 'Sheet1': {} }, SheetNames: ['Sheet1'] }; });
      XLSX.utils.sheet_to_json.mockReturnValue([]);

      const pontos = await xlsxUtils.processarArquivo(mockEmptyFile);
      expect(pontos).toEqual([]);
    });

    test('should throw an error for malformed data in the XLSX file', async () => {
      const malformedData = [{ name: 'John' }, { age: 25 }];
      const mockFile = new Blob(['malformed file'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      XLSX.read.mockImplementation(() => ({ Sheets: { 'Sheet1': {} }, SheetNames: ['Sheet1'] }));
      XLSX.utils.sheet_to_json.mockReturnValue(malformedData);

      await expect(xlsxUtils.processarArquivo(mockFile)).rejects.toThrow('Erro ao processar os dados.');
    });
  });

  describe('generateXlsx', () => {
    test('should generate a valid XLSX file from data', () => {
      const mockData = [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 },
      ];

      // Mocking XLSX.writeFile if necessary
      XLSX.writeFile = jest.fn();

      xlsxUtils.generateXlsx(mockData);
      expect(XLSX.writeFile).toHaveBeenCalled();
    });

    test('should throw an error if data is invalid', () => {
      const invalidData = null;
      expect(() => xlsxUtils.generateXlsx(invalidData)).toThrow();
    });
  });
});
