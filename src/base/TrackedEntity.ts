import { randomUUID } from 'node:crypto';
import { StateCommit, StateDiffProcessor, StateDiff, StateCommitMetadata, StateCommitAuthor } from './StateCommit';
import { Entity } from './Entity';
import { DeepEqualityDiff } from './diff/DeepEqualityDiff';
import { clone } from '../utils/clone';


/*
- [x] specify tracked values (all properties will be tracked)
- [x] comparition functions for changed values (using shallow and deep comparission, also is possible to have multiple implementations of the changes processor)
- [ ] how to create snapshots (consider untracked props and new props)
- [ ] how to replay changes (creating a rollback change)

- create entity
- commit
- update entity
- commit
- snapshot

Doubts:
- how to restore the state from the commits

*/

export interface CreateTrackedEntityData<State extends object> {
	readonly state: State;
	readonly version?: number;
	readonly id?: string | null;
}

export interface RestoreTrackedEntityData<State extends object> {
	readonly state: State;
	readonly version: number;
	readonly id: string;
}

export interface StateCommitInput<ChangeEvent> {
	author: StateCommitAuthor;
	event: ChangeEvent;
	metadata?: StateCommitMetadata;
}

export abstract class TrackedEntity<
	State extends object,
	ChangeEvent
	> extends Entity<State> {
	protected previousState: Partial<State>;
	protected stateVersion: number;

	protected constructor({ state, id, version }: CreateTrackedEntityData<State>) {
		super(state, id);
		this.stateVersion = version ?? 0;

		if (!this.stateVersion) {
			this.previousState = {};
		} else {
			this.previousState = clone(state);
		}
	}

	public getStateDiffs(diffMethod: StateDiffProcessor = new DeepEqualityDiff): StateDiff[] {
		return diffMethod.process({
			previousState: this.previousState,
			state: this.state,
		});
	}

	public get version(): number { return this.stateVersion; }

	public commit({ author, event, metadata }: StateCommitInput<ChangeEvent>): StateCommit<ChangeEvent> {
		this.stateVersion += 1;

		const diffMethod = new DeepEqualityDiff;
		const diffs = diffMethod.process({
			previousState: this.previousState,
			state: this.state,
		});

		if (diffs.length === 0) {
			throw new Error('Cannot create commit with unchaged state');
		}

		// deep clone
		this.previousState = clone(this.state);

		return {
			id: randomUUID(),
			diffs,
			version: this.stateVersion,
			date: new Date,
			event,
			author,
			metadata: metadata ?? {}
		};
	}

}
