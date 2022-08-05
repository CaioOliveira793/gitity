import { StateDiff } from "../base/StateCommit";
import { ExtendedJSON } from "./ExtendedJSON";

/*
diff format:

diff_type:"prop_as_scaped_double_quote_string":serialized_value_in_json\n
diff_type:"prop_as_scaped_double_quote_string":serialized_value_in_json
*/

// const DIFF_TYPE_REGEX = /[mad]/;

export class DiffSerde {

	static serialize(diffs: StateDiff[]): string {
		return ExtendedJSON.stringify(diffs);
	}

	static deserialize(diffs: string): StateDiff[] {
		return ExtendedJSON.parse(diffs) as StateDiff[];
	}

}
