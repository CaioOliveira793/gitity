import { Address, AddressData } from "./Address";
import { Snapshot } from "./base/StateSnapshot";
import { TrackedEntity, RestoreTrackedEntityData } from "./base/TrackedEntity";

export interface CollaboratorState {
	name: string;
	email: string;
	birthdate: Date;
	address: Address;
	'test "prop"': string;
}

export interface CollaboratorRestoreState {
	name: string;
	email: string;
	birthdate: Date;
	'test "prop"': string;
	address: AddressData;
}

export interface CollaboratorData {
	name: string;
	email: string;
	birthdate: Date;
	address: AddressData;
}

export class Collaborator extends TrackedEntity<CollaboratorState> {
	public static create(data: CollaboratorData): Collaborator {
		const state: CollaboratorState = {
			email: data.email,
			name: data.name,
			birthdate: data.birthdate,
			'test "prop"': '12345',
			address: new Address(data.address),
		};

		return new Collaborator({ state });
	}

	public static restore({ id, state, version }: RestoreTrackedEntityData<CollaboratorRestoreState>): Collaborator {
		return new Collaborator({
			id,
			version,
			state: Collaborator.restoreState(state)
		});
	}

	public static restorePreviusVersion(snapshot: Snapshot): Collaborator {
		const state = snapshot.state as unknown as CollaboratorRestoreState;
		Collaborator.validateState(state);

		return new Collaborator({
			id: snapshot.entityId,
			version: snapshot.version,
			state: Collaborator.restoreState(state),
		});
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
			'test "prop"': state['test "prop"'],
			address: new Address(state.address),
		};
	}

	private static validateState(state: CollaboratorRestoreState): void {
		state;
		// should?
	}

}
