

class TransactionService {
    constructor() { }
    async create(req, res, next) {
        console.log("Transaction created");
    }
}

export default new TransactionService()