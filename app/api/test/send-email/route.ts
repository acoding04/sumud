import { sendOrderConfirmationEmail } from "@/lib/email";
import { NextResponse } from "next/server";

export async function GET() {
	// Mock order data for testing
	const mockOrder = {
		id: "test-order-123",
		lookup: "TEST-001",
		createdAt: new Date().toISOString(),
		orderData: {
			customer: {
				name: "Test Customer",
				email: "anasthehero2004@gmail.com",
			},
			lineItems: [
				{
					id: "li-1",
					quantity: 2,
					productVariant: {
						id: "v-123",
						price: "2999", // £29.99
						images: [],
						product: {
							id: "p-123",
							name: "Test Perfume",
							slug: "test-perfume",
							images: [],
						},
					},
				},
			],
			shippingAddress: {
				name: "Test Customer",
				line1: "123 Test Street",
				line2: undefined,
				city: "Bristol",
				state: "BS5",
				postalCode: "6DF",
				country: "GB",
			},
			shipping: {
				name: "Standard",
				price: "500", // £5.00
			},
		},
	};

	const result = await sendOrderConfirmationEmail(mockOrder as any);

	return NextResponse.json({
		success: result.success,
		emailId: result.emailId,
		error: result.error,
	});
}
