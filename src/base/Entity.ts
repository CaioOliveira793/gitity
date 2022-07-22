import { randomUUID } from 'node:crypto';


/**
 * base Entity class
 */
export abstract class Entity<T> {
	public readonly id: string;
	protected state: T;

	protected constructor(state: T, id?: string | null) {
		this.state = state;
		this.id = id ?? randomUUID();
	}
}
