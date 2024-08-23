import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "../repository/invoice.model";
import { InvoiceItemModel } from "../repository/invoice.item.model";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import InvoiceFacade from "./invoice.facade";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";

describe("Invoice Facade test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([InvoiceModel, InvoiceItemModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should generate an invoice", async () => {

        const facade = InvoiceFacadeFactory.create();

        const input = {
            name: "Lucian",
            document: "1234-5678",
            street: "Rua 123",
            number: "99",
            complement: "Casa Verde",
            city: "Criciúma",
            state: "SC",
            zipCode: "88888-888",
            items: [
                {
                    id: "1",
                    name: "Item 1",
                    price: 100,
                },
            ],
        };

        const output = await facade.generate(input);

        expect(output).toBeDefined();
        expect(output.id).toBeDefined();
        expect(output.name).toBe(input.name);
        expect(output.document).toBe(input.document);
        expect(output.street).toBe(input.street);
        expect(output.number).toBe(input.number);
        expect(output.complement).toBe(input.complement);
        expect(output.city).toBe(input.city);
        expect(output.state).toBe(input.state);
        expect(output.zipCode).toBe(input.zipCode);
        expect(output.items.length).toBe(1);
        expect(output.items[0].id).toBe(input.items[0].id);
        expect(output.items[0].name).toBe(input.items[0].name);
        expect(output.items[0].price).toBe(input.items[0].price);
        expect(output.total).toBe(100);
    });

    it("should find an invoice", async () => {
        const facade = InvoiceFacadeFactory.create();

        const inputGenerate = {
            name: "Lucian",
            document: "1234-5678",
            street: "Rua 123",
            number: "99",
            complement: "Casa Verde",
            city: "Criciúma",
            state: "SC",
            zipCode: "88888-888",
            items: [
                {
                    id: "1",
                    name: "Item 1",
                    price: 100,
                },
            ],
        };

        const generatedInvoice = await facade.generate(inputGenerate);

        const inputFind = { id: generatedInvoice.id };
        const foundInvoice = await facade.find(inputFind);

        expect(foundInvoice).toBeDefined();
        expect(foundInvoice.id).toBe(generatedInvoice.id);
        expect(foundInvoice.name).toBe(generatedInvoice.name);
        expect(foundInvoice.document).toBe(generatedInvoice.document);
        expect(foundInvoice.address.street).toBe(generatedInvoice.street);
        expect(foundInvoice.address.number).toBe(generatedInvoice.number);
        expect(foundInvoice.address.complement).toBe(generatedInvoice.complement);
        expect(foundInvoice.address.city).toBe(generatedInvoice.city);
        expect(foundInvoice.address.state).toBe(generatedInvoice.state);
        expect(foundInvoice.address.zipCode).toBe(generatedInvoice.zipCode);
        expect(foundInvoice.items.length).toBe(1);
        expect(foundInvoice.items[0].id).toBe(generatedInvoice.items[0].id);
        expect(foundInvoice.items[0].name).toBe(generatedInvoice.items[0].name);
        expect(foundInvoice.items[0].price).toBe(generatedInvoice.items[0].price);
        expect(foundInvoice.total).toBe(100);
    });
});
