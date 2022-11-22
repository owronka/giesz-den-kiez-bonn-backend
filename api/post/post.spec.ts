import assert from "node:assert/strict";
import { describe, test } from "node:test";
import path from "node:path";
import { requestTestToken } from "../__test-utils/req-test-token.js";
process.env.NODE_ENV = "test";
import { config } from "dotenv";
import { supabase } from "../_utils/supabase.js";
const envs = config({ path: path.resolve(process.cwd(), ".env") });

const body = {
	tree_id: "1",
	uuid: "1",
	username: "1",
	timestamp: "1",
	amount: 1,
};
// const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";

describe("api/post/[type]", () => {
	test("should make a request to post/water and fail unauthorized", async () => {
		const response = await fetch("http://localhost:3000/post/water", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});
		assert(response.status === 401);
	});

	test("should make a request to post/[type] and fail due to wrong query type", async () => {
		const token = await requestTestToken();
		const response = await fetch("http://localhost:3000/post/watered", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(body),
		});
		console.log(response.status);
		assert(response.status === 400);
	});

	test("should make a request to post/water and fail due to missing body", async () => {
		const token = await requestTestToken();
		const response = await fetch("http://localhost:3000/post/water", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		assert(response.status === 400);
	});

	test("should make a request to post/water and succeed", async () => {
		const token = await requestTestToken();
		const { data: trees, error } = await supabase.from("trees").select("*");
		if (error) {
			throw error;
		}
		assert(trees.length > 0);

		// clone body into new variables and add tree_id
		const { tree_id, ...bodyWithoutTreeId } = body;
		const bodyWithTreeId = { ...bodyWithoutTreeId, tree_id: trees[0].id };
		// add date in format "YYYY-MM-DD HH:mm:ss to bodyWithTreeId
		const date = new Date();
		const dateStr = date.toISOString().slice(0, 19).replace("T", " ");
		const bodyWithTreeIdAndDate = {
			...bodyWithTreeId,
			timestamp: dateStr,
		};

		const response = await fetch("http://localhost:3000/post/water", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(bodyWithTreeIdAndDate),
		});

		assert(response.status === 201);
	});

	test("should make a request to post/adopt and fail due wrong body", async () => {
		const token = await requestTestToken();
		const response = await fetch("http://localhost:3000/post/adopt", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({}),
		});
		assert(response.status === 400);
	});
});
