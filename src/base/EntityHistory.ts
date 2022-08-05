import { DommainCommand } from "./DomainCommand";
import { StateCommitAuthor, StateCommitMetadata, StateDiff } from "./StateCommit";


export interface StateCommitResponse {
	id: string;
	date: Date;
	event: DommainCommand;
	entity_id: string;
	version: number;
	diffs: StateDiff[];
	author: StateCommitAuthor;
	metadata: StateCommitMetadata;
}
