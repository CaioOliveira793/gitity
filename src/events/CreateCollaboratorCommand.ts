import { DommainCommand } from "../base/DomainCommand";
import { CollaboratorData } from "../Collaborator";


export interface CreateCollaboratorCommandInput {
	readonly id: string;
	readonly time: Date;
	readonly data: CollaboratorData;
}

export class CreateCollaboratorCommand implements DommainCommand {
	public readonly id: string;
	public readonly type: string;
	public readonly time: Date;
	public readonly data: CollaboratorData;

	constructor({ id, data }: CreateCollaboratorCommandInput) {
		this.id = id;
		this.time = new Date;
		this.type = CreateCollaboratorCommand.type;
		this.data = data;
	}

	public static readonly type = CreateCollaboratorCommand.name;
}
