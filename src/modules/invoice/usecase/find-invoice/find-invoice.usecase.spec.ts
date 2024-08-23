
import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import { Invoice } from "../../domain/invoice";
import { InvoiceItem } from "../../domain/invoice-item";
import FindInvoiceUseCase from "./find-invoice.usecase";

const invoice = new Invoice({
    id: new Id("1"),
    name: "Lucian",
    document: "1234-5678",
    address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888"
    ),
    items: [
        new InvoiceItem({
            id: new Id("1"),
            name: "Item 1",
            price: 100,
        }),
        new InvoiceItem({
            id: new Id("2"),
            name: "Item 2",
            price: 200,
        }),
    ],
    createdAt: new Date(),
});

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    };
};

describe("Find Invoice use case unit test", () => {
    it("should find an invoice", async () => {
        const repository = MockRepository();
        const usecase = new FindInvoiceUseCase(repository);

        const input = {
            id: "1",
        };

        const result = await usecase.execute(input);

        expect(repository.find).toHaveBeenCalled();
        expect(result.id).toEqual(input.id);
        expect(result.name).toEqual(invoice.name);
        expect(result.document).toEqual(invoice.document);
        expect(result.address).toEqual({
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement || '',
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
        });
        expect(result.items.length).toBe(2);
        expect(result.items[0].id).toEqual(invoice.items[0].id.id);
        expect(result.items[0].name).toEqual(invoice.items[0].name);
        expect(result.items[0].price).toEqual(invoice.items[0].price);
        expect(result.items[1].id).toEqual(invoice.items[1].id.id);
        expect(result.items[1].name).toEqual(invoice.items[1].name);
        expect(result.items[1].price).toEqual(invoice.items[1].price);
        expect(result.total).toEqual(300);
        expect(result.createdAt).toEqual(invoice.createdAt);
    });
});
