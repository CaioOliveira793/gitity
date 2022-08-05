import { randomUUID } from "crypto";
import { DiffSerde } from "../serde/diff";
import { PropChangeType, StateCommit } from "./StateCommit";


export type SnapshotData = Record<string, unknown>;

export interface Snapshot {
	id: string;
	entityId: string;
	state: SnapshotData;
	version: number;
}

function snapshotVersion(commits: StateCommit[], lastSnapshot?: Snapshot): number {
	return lastSnapshot?.version
		? lastSnapshot.version + commits.length
		: commits[commits.length - 1].version;
}

function snapshotEntityId(commits: StateCommit[], lastSnapshot?: Snapshot): string {
	return lastSnapshot?.entityId ?? commits[commits.length - 1].entity_id;
}

/**
 *
 * @param commits all commits of the entity sorted by version from the last snapshot if provided
 * @param lastSnapshot the last snapshot of the entity (most recent snapshot)
 * @returns the current entity snapshot
 */
export function makeSnapshot(commits: StateCommit[], lastSnapshot?: Snapshot): Snapshot {
	if (commits.length === 0) {
		if (!lastSnapshot) {
			throw new TypeError(
				'Cannot create snapshot without last snapshot and at least one commit'
			);
		}

		return lastSnapshot;
	}

	const state: SnapshotData = lastSnapshot?.state ?? {};
	const entityId = snapshotEntityId(commits, lastSnapshot);
	const version = snapshotVersion(commits, lastSnapshot);

	for (const commit of commits) {
		const diffs = DiffSerde.deserialize(commit.diffs);
		for (const diff of diffs) {
			switch (diff.type) {
				case PropChangeType.Deleted: {
					delete state[diff.prop];
					break;
				}

				case PropChangeType.Added: {
					state[diff.prop] = diff.value;
					break;
				}

				case PropChangeType.Modified: {
					state[diff.prop] = diff.value;
					break;
				}
			}
		}
	}

	return { id: randomUUID(), entityId, state, version };
}
