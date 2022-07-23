import { isDeepStrictEqual } from 'node:util';
import { clone } from '../../utils/clone';
import { ProcessStateDiffInput, PropChangeType, StateDiff, StateDiffProcessor } from '../StateCommit';


export class DeepEqualityDiff implements StateDiffProcessor {

	private propertyInState<T extends object>(state: T, prop: string): boolean {
		return prop in state;
	}

	public process<
		PrevState extends object,
		State extends object
	>({
		previousState,
		state
	}: ProcessStateDiffInput<PrevState, State>): StateDiff[] {
		const diffs: StateDiff[] = [];

		for (const prop in state) {
			if (!this.propertyInState(previousState, prop)) {
				diffs.push({
					prop,
					type: PropChangeType.Added,
					value: clone(state[prop]),
				});

				continue;
			}

			if (!isDeepStrictEqual((previousState as any)[prop], state[prop])) {
				diffs.push({
					prop,
					type: PropChangeType.Modified,
					value: clone(state[prop]),
				});

				continue;
			}
		}

		for (const prop in previousState) {
			if (!this.propertyInState(state, prop)) {
				diffs.push({
					prop,
					type: PropChangeType.Deleted,
					value: undefined,
				});
			}
		}

		return diffs;
	}

}
