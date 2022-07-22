import { StateChangedEvent } from "../base/StateChange";


export interface StateChangesProcessor {
	process<T extends object>(changes: StateChangedEvent<T>[]): Partial<T>;
}
