import { Address, AddressData } from "./Address";
import { TrackedEntity, RestoreTrackedEntityData } from "./base/TrackedEntity";

export interface CollaboratorState {
	name: string;
	email: string;
	birthdate: Date;
	address: Address;
}

export interface CollaboratorRestoreState {
	name: string;
	email: string;
	birthdate: Date;
	address: AddressData;
}

export enum CollaboratorChangeEvent {
	Create = 'create_collaborator_command',
	Update = 'update_collaborator_command',
}

export interface CollaboratorData {
	name: string;
	email: string;
	birthdate: Date;
	address: AddressData;
}

export class Collaborator extends TrackedEntity<CollaboratorState, CollaboratorChangeEvent> {
	public static create(data: CollaboratorData): Collaborator {
		const state: CollaboratorState = {
			email: data.email,
			name: data.name,
			birthdate: data.birthdate,
			address: new Address(data.address),
		};

		return new Collaborator({ state });
	}

	public static restore({ id, state, version }: RestoreTrackedEntityData<CollaboratorRestoreState>): Collaborator {
		return new Collaborator({ id, version, state: Collaborator.restoreState(state) });
	}

	public update(data: CollaboratorData): void {
		this.state.name = data.name;
		this.state.email = data.email;
		this.state.birthdate = data.birthdate;
		this.state.address = new Address(data.address);
	}


	private static restoreState(state: CollaboratorRestoreState): CollaboratorState {
		return {
			name: state.name,
			email: state.email,
			birthdate: state.birthdate,
			address: new Address(state.address),
		};
	}

}
