import { VercelRequest, VercelResponse } from "@vercel/node";
import { setupResponseData } from "./_utils/setup-response";

export default async function (
	_request: VercelRequest,
	response: VercelResponse,
) {
	try {
		return response
			.status(200)
			.json(setupResponseData({ message: "its working" }));
	} catch (error) {
		return response
			.status(500)
			.json(setupResponseData({ error: "its not working" }));
	}
}
