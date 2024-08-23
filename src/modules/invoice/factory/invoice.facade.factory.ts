import InvoiceFacade from "../facade/invoice.facade";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice";


export default class InvoiceFacadeFactory {
    static create() {
        const repository = new InvoiceRepository();
        const findUsecase = new FindInvoiceUseCase(repository);
        const addUsecase = new GenerateInvoiceUseCase(repository);

        const facade = new InvoiceFacade(
            findUsecase,
            addUsecase
        );

        return facade;
    }
}
