import TransactionService from "../services/transaction.service";

class TransactionController {
    constructor() { }
    create = async (req, res) => TransactionService.create(req, res);
}

export default new TransactionController();