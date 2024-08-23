import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import { Invoice } from "../../domain/invoice";
import { InvoiceItem } from "../../domain/invoice-item";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.dto";

export default class GenerateInvoiceUseCase {

    private _invoiceRepository: InvoiceGateway;

    constructor(invoiceRepository: InvoiceGateway) {
        this._invoiceRepository = invoiceRepository;
    }

    async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {

        const address = new Address(
            input.street,
            input.number,
            input.complement,
            input.city,
            input.state,
            input.zipCode
        );

        const items = input.items.map(item => new InvoiceItem({
            id: new Id(item.id),
            name: item.name,
            price: item.price
        }));

        const invoice = new Invoice({
            name: input.name,
            document: input.document,
            address,
            items,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await this._invoiceRepository.add(invoice);

        const total = items.reduce((sum, item) => sum + item.price, 0);

        return {
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement || '',
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            items: invoice.items.map(item => ({
                id: item.id.id,
                name: item.name,
                price: item.price,
            })),
            total
        };
    }
}
