export interface ProcessStateDiffInput<PrevState extends object, State extends object> {
	previousState: Partial<PrevState>;
	state: State;
}

export interface StateDiffProcessor {
	process<
		PrevState extends object,
		State extends object
	>(input: ProcessStateDiffInput<PrevState, State>): StateDiff[];
}

export interface StateCommitOptions {
	diffMethod: StateDiffProcessor;
}

export enum PropChangeType {
	Modified = 'm',
	Added = 'a',
	Deleted = 'd',
}

export interface StateDiff {
	type: PropChangeType;
	prop: string;
	value: unknown;
}

export interface StateCommitAuthor {
	id: string | null;
	name: string;
	email: string | null;
}

export type StateCommitMetadata = Record<string, string>;

export interface StateCommit {
	/** Commit id */
	id: string;

	/** The commit date */
	date: Date;

	/** Serialized event that originated the commit */
	event: string;

	/** Entity id */
	entity_id: string;

	/** Entity version */
	version: number;

	/** Commit diffs (serialized) */
	diffs: string;

	/** Commit author */
	author: StateCommitAuthor;

	/** Commit metadata */
	metadata: StateCommitMetadata;
}
