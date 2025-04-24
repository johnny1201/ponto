// tabelaController.test.js

jest.mock("../scripts/utils/timeUtils.js");

describe("tabelaController", () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <table id="tabelaPonto">
                <tbody></tbody>
            </table>
            <div id="totalHoras"></div>
            <div id="totalNoturno"></div>
            <div id="totalExtras"></div>
        `;
    });

    describe("adicionarLinhaTabela", () => {
        test("should add a new row to the table with the correct data", () => {
            const ponto = {
                dataRef: "2023-10-01",
                entrada: "08:00",
                saidaIntervalo: "12:00",
                voltaIntervalo: "13:00",
                saidaFinal: "17:00",
            };
            const duracoes = {
                duracaoTotal: 480,
                duracaoNoturna: 60,
                duracaoExtras: 30,
            };

            converterMinutosParaHoras.mockImplementation((minutos) => `${minutos / 60}h`);

            adicionarLinhaTabela(ponto, duracoes);

            const rows = document.querySelectorAll("#tabelaPonto tbody tr");
            expect(rows.length).toBe(1);

            const cells = rows[0].querySelectorAll("td");
            expect(cells.length).toBe(8);
            expect(cells[0].textContent).toBe("2023-10-01");
            expect(cells[1].textContent).toBe("08:00");
            expect(cells[2].textContent).toBe("12:00");
            expect(cells[3].textContent).toBe("13:00");
            expect(cells[4].textContent).toBe("17:00");
        });
    });

    describe("atualizarTotais", () => {
        test("should update the totals correctly", () => {
            const duracoes = {
                duracaoTotal: 480,
                duracaoNoturna: 60,
                duracaoExtras: 30,
            };

            converterMinutosParaHoras.mockImplementation((minutos) => `${minutos / 60}h`);

            atualizarTotais(duracoes);

            const totalHoras = document.querySelector("#totalHoras").textContent;
            const totalNoturno = document.querySelector("#totalNoturno").textContent;
            const totalExtras = document.querySelector("#totalExtras").textContent;

            expect(totalHoras).toBe("8h");
            expect(totalNoturno).toBe("1h");
            expect(totalExtras).toBe("0.5h");
        });
    });
});