import { env, createExecutionContext, waitOnExecutionContext, SELF } from "cloudflare:test";
import { describe, it, expect } from "vitest";
import worker from "../src/index";

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe("share/collections/:slug", () => {
	it("redirects non-bot visitors to the hash-routed site (unit style)", async () => {
		const request = new IncomingRequest("https://component.wanlok.workers.dev/share/collections/hong-kong-food");
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		expect(response.status).toBe(302);
		expect(response.headers.get("location")).toBe("https://wanlok.github.io/#/collections/hong-kong-food");
	});

	it("redirects non-bot visitors to the hash-routed site (integration style)", async () => {
		const response = await SELF.fetch("https://component.wanlok.workers.dev/share/collections/hong-kong-food", {
			redirect: "manual"
		});
		expect(response.status).toBe(302);
		expect(response.headers.get("location")).toBe("https://wanlok.github.io/#/collections/hong-kong-food");
	});

	it("returns 404 for unmatched paths", async () => {
		const response = await SELF.fetch("https://component.wanlok.workers.dev/nope");
		expect(response.status).toBe(404);
	});
});
