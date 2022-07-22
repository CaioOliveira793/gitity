import { StateChangesProcessor } from "../processors/ChagesProcessor";
import { DeepEqualityProcessor } from "../processors/DeepEqualityProcessor";

export interface CommitOptions {
	changesProcessor: StateChangesProcessor;
}

export const DefaultCommitOptions: CommitOptions = {
	changesProcessor: new DeepEqualityProcessor,
}

export interface CommitResult<T extends object> {
	stateDiff: Partial<T>;
	previusVersion: number;
	currentVersion: number;
}
