import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "./invoice.model";
import { InvoiceItemModel } from "./invoice.item.model";
import InvoiceRepository from "./invoice.repository";
import { Invoice } from "../domain/invoice";
import { InvoiceItem } from "../domain/invoice-item";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../@shared/domain/value-object/address";

describe("Invoice Repository test", () => {

  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create an invoice", async () => {
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
          price: 100
        }),
        new InvoiceItem({
          id: new Id("2"),
          name: "Item 2",
          price: 200
        })
      ]
    });

    const repository = new InvoiceRepository();
    await repository.add(invoice);

    const invoiceDb = await InvoiceModel.findOne({
      where: { id: "1" },
      include: [{ model: InvoiceItemModel, as: 'items' }]
    });

    expect(invoiceDb).toBeDefined();
    expect(invoiceDb.id).toEqual(invoice.id.id);
    expect(invoiceDb.name).toEqual(invoice.name);
    expect(invoiceDb.document).toEqual(invoice.document);
    expect(invoiceDb.street).toEqual(invoice.address.street);
    expect(invoiceDb.number).toEqual(invoice.address.number);
    expect(invoiceDb.complement).toEqual(invoice.address.complement);
    expect(invoiceDb.city).toEqual(invoice.address.city);
    expect(invoiceDb.state).toEqual(invoice.address.state);
    expect(invoiceDb.zipcode).toEqual(invoice.address.zipCode);
    expect(invoiceDb.items.length).toBe(2);
    expect(invoiceDb.items[0].name).toEqual(invoice.items[0].name);
    expect(invoiceDb.items[0].price).toEqual(invoice.items[0].price);
    expect(invoiceDb.items[1].name).toEqual(invoice.items[1].name);
    expect(invoiceDb.items[1].price).toEqual(invoice.items[1].price);
  });

  it("should find an invoice", async () => {
    const invoice = await InvoiceModel.create({
      id: '1',
      name: 'Lucian',
      document: "1234-5678",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipcode: "88888-888",
      createdAt: new Date(),
      updatedAt: new Date(),
      items: [
        {
          id: '1',
          name: "Item 1",
          price: 100,
        },
        {
          id: '2',
          name: "Item 2",
          price: 200,
        }
      ]
    }, {
      include: [{ model: InvoiceItemModel, as: 'items' }]
    });

    const repository = new InvoiceRepository();
    const result = await repository.find(invoice.id);

    expect(result.id.id).toEqual(invoice.id);
    expect(result.name).toEqual(invoice.name);
    expect(result.document).toEqual(invoice.document);
    expect(result.address.street).toEqual(invoice.street);
    expect(result.address.number).toEqual(invoice.number);
    expect(result.address.complement).toEqual(invoice.complement);
    expect(result.address.city).toEqual(invoice.city);
    expect(result.address.state).toEqual(invoice.state);
    expect(result.address.zipCode).toEqual(invoice.zipcode);
    expect(result.items.length).toBe(2);
    expect(result.items[0].name).toEqual(invoice.items[0].name);
    expect(result.items[0].price).toEqual(invoice.items[0].price);
    expect(result.items[1].name).toEqual(invoice.items[1].name);
    expect(result.items[1].price).toEqual(invoice.items[1].price);
  });
});
