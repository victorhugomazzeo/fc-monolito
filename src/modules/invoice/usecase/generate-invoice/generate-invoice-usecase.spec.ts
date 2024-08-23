import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import { Invoice } from "../../domain/invoice";
import { InvoiceItem } from "../../domain/invoice-item";
import GenerateInvoiceUseCase from "./generate-invoice";

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
        add: jest.fn().mockReturnValue(Promise.resolve(invoice)),
        find:jest.fn()
    };
};

describe("Generate Invoice use case unit test", () => {
    it("should generate an invoice", async () => {
        const repository = MockRepository();
        const usecase = new GenerateInvoiceUseCase(repository);

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
                {
                    id: "2",
                    name: "Item 2",
                    price: 200,
                },
            ],
        };

        const result = await usecase.execute(input);

        expect(repository.add).toHaveBeenCalled();
        expect(result.name).toEqual(input.name);
        expect(result.document).toEqual(input.document);
        expect(result.street).toEqual(input.street);
        expect(result.number).toEqual(input.number);
        expect(result.complement).toEqual(input.complement);
        expect(result.city).toEqual(input.city);
        expect(result.state).toEqual(input.state);
        expect(result.zipCode).toEqual(input.zipCode);
        expect(result.items.length).toBe(2);
        expect(result.items[0].id).toEqual(input.items[0].id);
        expect(result.items[0].name).toEqual(input.items[0].name);
        expect(result.items[0].price).toEqual(input.items[0].price);
        expect(result.items[1].id).toEqual(input.items[1].id);
        expect(result.items[1].name).toEqual(input.items[1].name);
        expect(result.items[1].price).toEqual(input.items[1].price);
        expect(result.total).toEqual(300); // 100 + 200
    });
});
