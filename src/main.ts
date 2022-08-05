import { randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { StateCommit } from "./base/StateCommit";
import { makeSnapshot } from "./base/StateSnapshot";
import { Collaborator } from "./Collaborator";
import { CreateCollaboratorCommand } from "./events/CreateCollaboratorCommand";
import { ExtendedJSON } from "./serde/ExtendedJSON";


const author = {
	id: randomUUID(),
	name: 'Caio Oliveira',
	email: 'caio@gmail.com',
};

const commits: StateCommit[] = [];

const collaborator = Collaborator.create({
	name: 'Caio',
	email: 'caio@email.com',
	birthdate: new Date,
	address: {
		district: 'dis',
		street: 'street',
	}
});

commits.push(collaborator.commit({ event: CreateCollaboratorCommand.type, author }));

collaborator.update({
	name: 'Caio Oliveira',
	email: 'caio@gmail.com',
	birthdate: new Date,
	address: {
		district: 'district',
		street: String.raw`the

		street`,
	}
});

commits.push(collaborator.commit({ event: CreateCollaboratorCommand.type, author }));

const snapshot = makeSnapshot(ExtendedJSON.parse(ExtendedJSON.stringify(commits)) as unknown as StateCommit[]);

console.log('snapshot:', snapshot);

const restoredCollaborator = Collaborator.restorePreviusVersion(snapshot);

console.log('collaborator restored:', restoredCollaborator);
console.log('restored collaborator equality:', isDeepStrictEqual(collaborator, restoredCollaborator));
