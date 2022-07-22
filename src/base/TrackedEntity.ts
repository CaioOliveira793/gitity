import { StateChangesProcessor } from "../processors/ChagesProcessor";
import { DeepEqualityProcessor } from "../processors/DeepEqualityProcessor";
import { createProxyHandler } from "../proxy/ProxyHandler";
import { CommitOptions, CommitResult, DefaultCommitOptions } from "./Commit";
import { Entity } from "./Entity";
import { StateChangedEvent } from "./StateChange";


/*
- [x] specify tracked values (all properties will be tracked)
- [x] comparition functions for changed values (using shallow and deep comparission, also is possible to have multiple implementations of the changes processor)
- [ ] how to create snapshots (consider untracked props and new props)
- [ ] how to replay changes (creating a rollback change)
*/

export class TrackedEntity<T extends object> extends Entity<T> {
	protected readonly changes: StateChangedEvent<T>[] = [];
	protected version: number;

	protected constructor(state: T, id?: string | null, version: number = 0) {
		const proxiedState = new Proxy<T>(state, createProxyHandler(event => {
			this.changes.push(event);
		}));

		super(proxiedState, id);
		this.version = version;
	}

	public getStagingChanges(): StateChangedEvent<T>[] {
		return this.changes.slice();
	}

	public clearStagingChanges(): void {
		this.changes.length = 0;
	}

	public commit(options: CommitOptions = DefaultCommitOptions): CommitResult<T> {
		// const { ... } = merge(options, DefaultCommitOptions);
		const changes = this.changes.slice();
		this.changes.length = 0;

		const previusVersion = this.version;
		this.version += 1;
		const stateDiff = options.changesProcessor.process(changes);
		return {
			stateDiff,
			currentVersion: this.version,
			previusVersion
		};
	}

}
