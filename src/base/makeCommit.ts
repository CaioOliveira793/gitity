import { randomUUID } from "node:crypto";
import { DiffSerde } from "../serde/diff";
import { DeepEqualityDiff } from "./diff/DeepEqualityDiff";
import { ProcessStateDiffInput, StateCommit, StateCommitAuthor, StateCommitMetadata } from "./StateCommit";


export interface CreateCommitInput<
	PrevState extends object,
	State extends object
	> extends ProcessStateDiffInput<PrevState, State> {
	event: string;
	entityId: string;
	version: number;
	author: StateCommitAuthor;
	metadata: StateCommitMetadata;
}

export function createDiff<
	PrevState extends object,
	State extends object
>(input: ProcessStateDiffInput<PrevState, State>) {
	const diffMethod = new DeepEqualityDiff;
	return diffMethod.process(input);
}

export function createCommit<
	PrevState extends object,
	State extends object
>({
	previousState,
	state,
	author,
	entityId,
	event,
	metadata,
	version
}: CreateCommitInput<PrevState, State>): StateCommit {
	const diffMethod = new DeepEqualityDiff;
	const diffs = diffMethod.process({ previousState, state });

	if (diffs.length === 0) {
		throw new Error('Cannot create commit with unchaged state');
	}

	return {
		id: randomUUID(),
		date: new Date,
		event,
		diffs: DiffSerde.serialize(diffs),
		entity_id: entityId,
		version,
		author,
		metadata
	};
}
