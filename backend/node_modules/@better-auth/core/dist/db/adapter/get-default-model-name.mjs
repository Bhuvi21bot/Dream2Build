import { BetterAuthError } from "../../error/index.mjs";
//#region src/db/adapter/get-default-model-name.ts
const initGetDefaultModelName = ({ usePlural, schema }) => {
	/**
	* This function helps us get the default model name from the schema defined by devs.
	* Often times, the user will be using the `modelName` which could had been customized by the users.
	* This function helps us get the actual model name useful to match against the schema. (eg: schema[model])
	*
	* If it's still unclear what this does:
	*
	* 1. User can define a custom modelName.
	* 2. When using a custom modelName, doing something like `schema[model]` will not work.
	* 3. Using this function helps us get the actual model name based on the user's defined custom modelName.
	*/
	const getDefaultModelName = (model) => {
		const resolve = (candidate) => {
			if (schema[candidate]) return candidate;
			return Object.entries(schema).find(([_, f]) => f.modelName === candidate)?.[0];
		};
		if (usePlural && model.charAt(model.length - 1) === "s") {
			const m = resolve(model.slice(0, -1));
			if (m) return m;
		}
		const m = resolve(model);
		if (!m) throw new BetterAuthError(`Model "${model}" not found in schema`);
		return m;
	};
	return getDefaultModelName;
};
//#endregion
export { initGetDefaultModelName };
