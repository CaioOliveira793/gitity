

export type JsonReviver = (this: unknown, key: string, value: unknown) => unknown;

const DATE_ISO_FORMAT =
	/^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d(:[0-5]\d)?(\.\d+)?([+-][0-2]\d:[0-5]\d|Z)?$/;

export function validDateISO(value: unknown): boolean {
	return typeof value === 'string' && DATE_ISO_FORMAT.test(value);
}

function dateReviver(_key: string, value: unknown): unknown | Date {
	return validDateISO(value) ? new Date(value as string) : value;
}

export class ExtendedJSON {
	public static stringify = JSON.stringify;

	public static parse = (text: string): unknown => {
		return JSON.parse(text, dateReviver);
	}
}
