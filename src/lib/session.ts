import { createServerFn } from "@tanstack/react-start";
import { createAuth } from "./auth";

export const getSession = createServerFn({ method: "GET" }).handler(async () => {
	const { getRequest } = await import("@tanstack/react-start/server");
	const { headers } = getRequest();
	return createAuth().api.getSession({ headers });
});
