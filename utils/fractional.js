export class Fractional {
    static fromDecimal(decimal) {
        const [integer, decimalPart] = decimal.toString().split(".");
        if (!decimalPart) return new Fractional(parseInt(integer), 1);
        const denominator = Math.pow(10, decimalPart.length);
        const numerator = parseInt(integer + decimalPart);
        return new Fractional(numerator, denominator);
    }

    constructor(numerator, denominator = 1) {
        this.numerator = numerator;
        this.denominator = denominator;

        const gcd = (a, b) => {
            if (!b) return a;
            return gcd(b, a % b);
        }

        const gcdValue = gcd(this.numerator, this.denominator);
        this.numerator /= gcdValue;
        this.denominator /= gcdValue;
    }

    add(fractional) {
        const numerator = this.numerator * fractional.denominator + fractional.numerator * this.denominator;
        const denominator = this.denominator * fractional.denominator;
        return new Fractional(numerator, denominator);
    }

    subtract(fractional) {
        const numerator = this.numerator * fractional.denominator - fractional.numerator * this.denominator;
        const denominator = this.denominator * fractional.denominator;
        return new Fractional(numerator, denominator);
    }

    multiply(fractional) {
        const numerator = this.numerator * fractional.numerator;
        const denominator = this.denominator * fractional.denominator;
        return new Fractional(numerator, denominator);
    }

    divide(fractional) {
        const numerator = this.numerator * fractional.denominator;
        const denominator = this.denominator * fractional.numerator;
        return new Fractional(numerator, denominator);
    }

    isBiggerThan(fractional) {
        return this.numerator * fractional.denominator > fractional.numerator * this.denominator;
    }

    isSmallerThan(fractional) {
        return this.numerator * fractional.denominator < fractional.numerator * this.denominator;
    }

    equals(fractional) {
        return this.numerator * fractional.denominator == fractional.numerator * this.denominator;
    }

    toDecimal() {
        return this.numerator / this.denominator;
    }
}