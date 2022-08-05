import { StateCommit, StateDiff, StateCommitMetadata, StateCommitAuthor } from './StateCommit';
import { Entity } from './Entity';
import { clone } from '../utils/clone';
import { createCommit, createDiff } from './makeCommit';


/*
- [x] specify tracked values (all properties will be tracked)
- [x] comparition functions for changed values (using shallow and deep comparission, also is possible to have multiple implementations of the changes processor)
- [x] how to create snapshots (consider untracked props and new props)
- [ ] how to replay changes (creating a rollback change)
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

export interface StateCommitInput {
	author: StateCommitAuthor;
	event: string;
	metadata?: StateCommitMetadata;
}

export abstract class TrackedEntity<State extends object> extends Entity<State> {
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

	public getStateDiff(): StateDiff[] {
		return createDiff({ previousState: this.previousState, state: this.state });
	}

	public get version(): number { return this.stateVersion; }

	public commit({ author, event, metadata = {} }: StateCommitInput): StateCommit {
		const version = this.stateVersion + 1;

		const commit = createCommit({
			previousState: this.previousState,
			state: clone(this.state),
			author,
			entityId: this.id,
			event,
			metadata,
			version
		});

		this.previousState = clone(this.state);
		this.stateVersion = version;
		return commit;
	}

}
