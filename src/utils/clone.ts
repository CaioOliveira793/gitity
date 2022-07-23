import { serialize, deserialize } from 'v8';


export function clone(state: unknown) {
	return deserialize(serialize(state));
}
