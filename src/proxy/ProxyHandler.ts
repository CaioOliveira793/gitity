import { isDeepStrictEqual } from "util";
import { StateChangeHandler } from "../base/StateChange";


export function createProxyHandler<T extends object>(changeHandler: StateChangeHandler<T>): ProxyHandler<T> {
	return {
		set(target: any, prop: string | symbol, value): boolean {
			const previous = target[prop];

			changeHandler({
				previousValue: previous,
				currentValue: value,
				property: prop as keyof T,
				shallowEquality: previous === value,
				deepEquality: isDeepStrictEqual(previous, value),
			});

			target[prop] = value;
			return true;
		},
	};
}
