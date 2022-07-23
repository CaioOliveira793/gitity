import { isDeepStrictEqual } from "node:util";
import { PropChangeType, StateCommit } from "./base/StateCommit";
import { CollaboratorChangeEvent, Collaborator, CollaboratorRestoreState } from "./Collaborator";


const author = {
	id: '123',
	name: 'Caio Oliveira',
};

const commits: StateCommit<CollaboratorChangeEvent>[] = [];

const collaborator = Collaborator.create({
	name: 'Caio',
	email: 'caio@email.com',
	birthdate: new Date,
	address: {
		district: 'dis',
		street: 'street',
	}
});

commits.push(collaborator.commit({ event: CollaboratorChangeEvent.Create, author }));

collaborator.update({
	name: 'Caio Oliveira',
	email: 'caio@gmail.com',
	birthdate: new Date,
	address: {
		district: 'district',
		street: 'the street',
	}
});

commits.push(collaborator.commit({ event: CollaboratorChangeEvent.Update, author }));

console.log('collaborator:', collaborator)

console.log('commits:', commits);

const snapshot: Record<string, unknown> = {};
for (const commit of commits) {
	for (const diff of commit.diffs) {
		switch (diff.type) {
			case PropChangeType.Deleted: {
				delete snapshot[diff.prop];
				break;
			}

			case PropChangeType.Added: {
				snapshot[diff.prop] = diff.value;
				break;
			}

			case PropChangeType.Modified: {
				snapshot[diff.prop] = diff.value;
				break;
			}
		}
	}
}

console.log('snapshot:', snapshot);

const restoredCollaborator = Collaborator.restore({
	id: collaborator.id,
	version: collaborator.version,
	state: snapshot as unknown as CollaboratorRestoreState,
});

console.log('collaborator restored:', restoredCollaborator);

console.log('restored collaborator equality:', isDeepStrictEqual(collaborator, restoredCollaborator));
