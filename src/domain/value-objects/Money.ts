/**
 * Money Value Object
 * Representa un valor monetario inmutable con validación de negocio
 * 
 * Reglas de negocio:
 * - El monto debe ser mayor o igual a 0
 * - La moneda debe estar definida
 * - Es inmutable (no se puede modificar después de crearse)
 */
export class Money {
  private readonly _amount: number;
  private readonly _currency: string;

  private constructor(amount: number, currency: string) {
    this._amount = amount;
    this._currency = currency;
  }

  /**
   * Factory method para crear un objeto Money
   * @throws Error si el monto es negativo
   */
  static create(amount: number, currency: string = 'MXN'): Money {
    if (amount < 0) {
      throw new Error('El monto no puede ser negativo');
    }

    if (!currency || currency.trim().length === 0) {
      throw new Error('La moneda debe estar definida');
    }

    return new Money(amount, currency.trim().toUpperCase());
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }

  /**
   * Suma dos objetos Money
   * @throws Error si las monedas no coinciden
   */
  add(other: Money): Money {
    if (this._currency !== other._currency) {
      throw new Error(`No se pueden sumar monedas diferentes: ${this._currency} y ${other._currency}`);
    }

    return Money.create(this._amount + other._amount, this._currency);
  }

  /**
   * Resta dos objetos Money
   * @throws Error si las monedas no coinciden o el resultado es negativo
   */
  subtract(other: Money): Money {
    if (this._currency !== other._currency) {
      throw new Error(`No se pueden restar monedas diferentes: ${this._currency} y ${other._currency}`);
    }

    return Money.create(this._amount - other._amount, this._currency);
  }

  /**
   * Multiplica el monto por un factor
   */
  multiply(factor: number): Money {
    if (factor < 0) {
      throw new Error('El factor de multiplicación no puede ser negativo');
    }

    return Money.create(this._amount * factor, this._currency);
  }

  /**
   * Compara si dos objetos Money son iguales
   */
  equals(other: Money): boolean {
    return this._amount === other._amount && this._currency === other._currency;
  }

  /**
   * Compara si este Money es mayor que otro
   * @throws Error si las monedas no coinciden
   */
  isGreaterThan(other: Money): boolean {
    if (this._currency !== other._currency) {
      throw new Error(`No se pueden comparar monedas diferentes: ${this._currency} y ${other._currency}`);
    }

    return this._amount > other._amount;
  }

  /**
   * Compara si este Money es menor que otro
   * @throws Error si las monedas no coinciden
   */
  isLessThan(other: Money): boolean {
    if (this._currency !== other._currency) {
      throw new Error(`No se pueden comparar monedas diferentes: ${this._currency} y ${other._currency}`);
    }

    return this._amount < other._amount;
  }

  /**
   * Retorna una representación en string del Money
   */
  toString(): string {
    return `${this._currency} ${this._amount.toFixed(2)}`;
  }

  /**
   * Convierte el Money a un objeto plano para serialización
   */
  toJSON(): { amount: number; currency: string } {
    return {
      amount: this._amount,
      currency: this._currency,
    };
  }

  /**
   * Crea un Money desde un objeto plano
   */
  static fromJSON(data: { amount: number; currency: string }): Money {
    return Money.create(data.amount, data.currency);
  }
}
