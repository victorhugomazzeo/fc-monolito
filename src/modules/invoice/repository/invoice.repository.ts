import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import { Invoice } from "../domain/invoice";
import { InvoiceItem } from "../domain/invoice-item";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceItemModel } from "./invoice.item.model";
import { InvoiceModel } from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
    async add(invoice: Invoice): Promise<void> {
        await InvoiceModel.create(
            {
                id: invoice.id.id,
                name: invoice.name,
                document: invoice.document,
                street: invoice.address.street,
                number: invoice.address.number,
                complement: invoice.address.complement,
                city: invoice.address.city,
                state: invoice.address.state,
                zipcode: invoice.address.zipCode,
                createdAt: invoice.createdAt,
                updatedAt: invoice.updatedAt,
                items: invoice.items.map(item => ({
                    id: item.id.id,
                    name: item.name,
                    price: item.price,
                })),
            },
            {
                include: [{ model: InvoiceItemModel, as: 'items' }],
            }
        );
    }

    async find(id: string): Promise<Invoice> {
        const invoice = await InvoiceModel.findOne({
            where: { id },
            include: [{ model: InvoiceItemModel, as: 'items' }],
        });

        if (!invoice) {
            throw new Error(`Invoice with id ${id} not found`);
        }

        const items = invoice.items.map((item: any) => new InvoiceItem({
            id: new Id(item.id),
            name: item.name,
            price: item.price,
        }));

        return new Invoice({
            id: new Id(invoice.id),
            name: invoice.name,
            document: invoice.document,
            address: new Address(
                invoice.street,
                invoice.number,
                invoice.complement,
                invoice.city,
                invoice.state,
                invoice.zipcode,
            ),
            items,
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt,
        });
    }
}
