
export interface AddressData {
	readonly street: string;
	readonly district: string;
}

export class Address implements AddressData {
	public readonly street: string;
	public readonly district: string;

	constructor(data: AddressData) {
		this.district = data.district;
		this.street = data.street;
	}

	public toString(): string { return `${this.district} ${this.street}`; }

	public someMethod() { return false; }

}
