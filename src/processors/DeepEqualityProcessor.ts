import { StateChangedEvent } from "../base/StateChange";
import { StateChangesProcessor } from "./ChagesProcessor";


export class DeepEqualityProcessor implements StateChangesProcessor {

	public process<T extends object>(changes: StateChangedEvent<T>[]): Partial<T> {
		const diff: Partial<T> = {};

		for (const change of changes) {
			if (change.deepEquality) continue;
			diff[change.property] = change.currentValue;
		}

		return diff;
	}

}
