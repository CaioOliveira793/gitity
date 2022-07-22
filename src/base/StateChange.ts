
export interface StateChangedEvent<T> {
	previousValue: T[keyof T];
	currentValue: T[keyof T];
	property: keyof T;
	shallowEquality: boolean;
	deepEquality: boolean;
}

export type StateChangeHandler<T> = (event: StateChangedEvent<T>) => void;
