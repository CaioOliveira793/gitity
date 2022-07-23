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
	id?: string;
	name?: string;
	email?: string;
}

export type StateCommitMetadata = Record<string, string>;

export interface StateCommit<Event> {
	id: string;
	diffs: StateDiff[];
	event: Event;
	version: number;
	date: Date;
	author: StateCommitAuthor;
	metadata: StateCommitMetadata;
}
