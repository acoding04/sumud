import { Resend } from "resend";
import { try_ as safe } from "safe-try";
import type { StoredOrder } from "@/lib/commerce";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";

const resend = process.env.RESEND_API_KEY
	? new Resend(process.env.RESEND_API_KEY)
	: null;

function formatPrice(amount: bigint) {
	return formatMoney({ amount, currency: CURRENCY, locale: LOCALE });
}

function buildOrderConfirmationHtml(order: StoredOrder) {
	const { customer, lineItems, shippingAddress, shipping } = order.orderData;

	const subtotal = lineItems.reduce(
		(sum, item) => sum + BigInt(item.productVariant.price) * BigInt(item.quantity),
		0n,
	);
	const shippingCost = BigInt(shipping.price);
	const standardShippingCost = 395n;
	const isFreeShipping = shippingCost === 0n;
	const total = subtotal + shippingCost;

	const date = new Intl.DateTimeFormat(LOCALE, {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(new Date(order.createdAt));

	const itemRows = lineItems
		.map((item) => {
			const lineTotal = BigInt(item.productVariant.price) * BigInt(item.quantity);
			return `
				<tr style="border-bottom:1px solid #f0f0f0;">
					<td style="padding:12px 0;font-size:14px;color:#1a1a1a;">${item.productVariant.product.name}</td>
					<td align="center" style="padding:12px 0;font-size:14px;color:#555;">${item.quantity}</td>
					<td align="right" style="padding:12px 0;font-size:14px;color:#1a1a1a;">${formatPrice(lineTotal)}</td>
				</tr>`;
		})
		.join("");

	const addressLines = [
		shippingAddress.name,
		shippingAddress.line1,
		shippingAddress.line2,
		[shippingAddress.city, shippingAddress.state, shippingAddress.postalCode]
			.filter(Boolean)
			.join(", "),
		shippingAddress.country,
	]
		.filter(Boolean)
		.join("<br>");

	return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Order Confirmation</title>
</head>
<body style="margin:0;padding:0;background-color:#FAF9F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF9F6;">
<tr><td align="center" style="padding:40px 16px;">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e5e5e5;">

<tr><td style="background:#000000;padding:32px 40px;text-align:center;">
<img src="https://sumudscents.com/images/sumud_dark.png" alt="Sumud Scents Logo" style="max-width:120px;height:auto;display:block;margin:0 auto;">
</td></tr>

<tr><td style="padding:32px 40px 16px;">
<h2 style="margin:0 0 8px;font-family:Georgia,serif;font-size:22px;color:#1a1a1a;">Thank you for your order!</h2>
<p style="margin:0;color:#555;font-size:15px;line-height:1.6;">Hi ${customer.name}, we've received your order and are preparing it now.</p>
</td></tr>

<tr><td style="padding:0 40px;">
<table width="100%" cellpadding="16" cellspacing="0" style="background:#faf9f6;border-left:3px solid #d2ab5a;">
<tr><td style="font-size:13px;color:#555;">
<strong style="color:#1a1a1a;">Order #${order.lookup}</strong><br>
Placed on ${date}
</td></tr>
</table>
</td></tr>

<tr><td style="padding:24px 40px 0;">
<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
<tr style="border-bottom:1px solid #e5e5e5;">
<th align="left" style="padding:8px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#999;">Item</th>
<th align="center" style="padding:8px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#999;">Qty</th>
<th align="right" style="padding:8px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#999;">Price</th>
</tr>
${itemRows}
</table>
</td></tr>

<tr><td style="padding:16px 40px 0;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td style="padding:6px 0;font-size:14px;color:#555;">Subtotal</td>
<td align="right" style="padding:6px 0;font-size:14px;color:#555;">${formatPrice(subtotal)}</td>
</tr>
<tr>
<td style="padding:6px 0;font-size:14px;color:#555;">Shipping (${shipping.name})</td>
<td align="right" style="padding:6px 0;font-size:14px;color:#555;">
	${isFreeShipping ? `<span style="color:#999;text-decoration:line-through;margin-right:8px;">${formatPrice(standardShippingCost)}</span><span style="color:#1a1a1a;font-weight:700;">${formatPrice(0n)}</span>` : formatPrice(shippingCost)}
</td>
</tr>
<tr style="border-top:2px solid #1a1a1a;">
<td style="padding:12px 0;font-size:16px;font-weight:700;color:#1a1a1a;">Total</td>
<td align="right" style="padding:12px 0;font-size:16px;font-weight:700;color:#1a1a1a;">${formatPrice(total)}</td>
</tr>
</table>
</td></tr>

<tr><td style="padding:24px 40px 0;">
<p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#999;">Shipping Address</p>
<p style="margin:0;font-size:14px;color:#1a1a1a;line-height:1.6;">${addressLines}</p>
</td></tr>

<tr><td style="padding:32px 40px;text-align:center;"> </td></tr>

<tr><td style="background:#000;padding:24px 40px;text-align:center;">
<p style="margin:0 0 8px;color:#999;font-size:12px;">Questions? Contact <a href="mailto:sumudltd@gmail.com" style="color:#d2ab5a;">sumudltd@gmail.com</a></p>
<p style="margin:0;color:#666;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;">&copy; ${new Date().getFullYear()} Sumud Scents. All rights reserved.</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

export async function sendOrderConfirmationEmail(order: StoredOrder) {
	const { customer } = order.orderData;

	if (!resend) {
		console.warn(
			`[EMAIL] Resend not initialized - RESEND_API_KEY is missing!\n  To: ${customer.email}\n  Subject: Order Confirmation #${order.lookup}`,
		);
		return { success: false, error: "RESEND_API_KEY not configured" };
	}

	console.log(
		`[EMAIL] Sending order confirmation to ${customer.email} (Order #${order.lookup})`,
	);

	const [error, result] = await safe(
		resend.emails.send({
			from: "Sumud Scents <orders@contact.sumudscents.com>",
			to: customer.email,
			subject: `Order Confirmation #${order.lookup}`,
			html: buildOrderConfirmationHtml(order),
		}),
	);

	if (error) {
		console.error(`[EMAIL] Failed to send confirmation email for order #${order.lookup}:`, {
			email: customer.email,
			error: error instanceof Error ? error.message : String(error),
		});
		return { success: false, error };
	}

	if (!result) {
		console.error(`[EMAIL] Empty response from Resend for order #${order.lookup}`);
		return { success: false, error: "Empty response from Resend" };
	}

	// Check if Resend returned an error in the response body
	if (result.error) {
		console.error(`[EMAIL] Resend API error for order #${order.lookup}:`, {
			email: customer.email,
			statusCode: result.error.statusCode,
			message: result.error.message,
		});
		return { success: false, error: result.error.message };
	}

	// Check if data is null or missing
	if (!result.data?.id) {
		console.error(`[EMAIL] Invalid Resend response (no email ID) for order #${order.lookup}:`, {
			response: JSON.stringify(result, null, 2),
		});
		return { success: false, error: "No email ID in Resend response" };
	}

	console.log(`[EMAIL] Successfully sent confirmation email (Email ID: ${result.data.id})`);
	return { success: true, emailId: result.data.id };
}
