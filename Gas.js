class Gas {
    constructor(name, amount) {
        this.name = name;
        this.amount = amount;

        switch(name) {
            case "H2":
                this.boilingPoint = 1;
                break;
            case "He":
                this.boilingPoint = 0.8;
                break;
        }
    }

    getAmount() {
        return this.amount;
    }
    getName() {
        return this.name;
    }

    setAmount(x) {
        this.amount = x;
    }
    setName(x) {
        this.name = x;
    }

    formatGas() {
        return "You have " + this.amount + " " + this.name + " molecules.";
    }
}
