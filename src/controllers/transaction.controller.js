import TransactionService from "../services/transaction.service";

export default class TransactionController {
    constructor() { }
    create = async (req, res) => TransactionService.create(req, res);
}