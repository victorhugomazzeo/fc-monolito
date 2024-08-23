import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface from "./invoice.facade.interface";
import {
    FindInvoiceFacadeInputDTO,
    FindInvoiceFacadeOutputDTO,
    GenerateInvoiceFacadeInputDto,
    GenerateInvoiceFacadeOutputDto
} from "./invoice.facade.interface";



export default class InvoiceFacade implements InvoiceFacadeInterface {
    private _findUsecase: UseCaseInterface;
    private _generateUsecase: UseCaseInterface;

    constructor(findUsecase: UseCaseInterface, generateUsecase: UseCaseInterface) {
        this._findUsecase = findUsecase;
        this._generateUsecase = generateUsecase;
    }

    async find(
        input: FindInvoiceFacadeInputDTO
    ): Promise<FindInvoiceFacadeOutputDTO> {
        return await this._findUsecase.execute(input);
    }

    async generate(
        input: GenerateInvoiceFacadeInputDto
    ): Promise<GenerateInvoiceFacadeOutputDto> {
        return await this._generateUsecase.execute(input);
    }
}
