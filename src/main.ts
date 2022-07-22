import { TrackedEntity } from "./base/TrackedEntity";


interface CollaboratorState {
	name: string;
	email: string;
}

interface CollaboratorData {
	name: string;
	email: string;
}

class Collaborator extends TrackedEntity<CollaboratorState> {
	public static create(data: CollaboratorData): Collaborator {
		return new Collaborator({
			email: data.email,
			name: data.name,
		});
	}

	public update(data: CollaboratorData): void {
		this.state.name = data.name;
		this.state.email = data.email;
	}
}


const collaborator = Collaborator.create({ name: 'Caio', email: 'caio@email.com' });

collaborator.update({ name: 'Caio', email: 'caio@gmail.com' });

console.log('changes:', collaborator.getStagingChanges());

const commitResult = collaborator.commit();

console.log('commit:', commitResult);
