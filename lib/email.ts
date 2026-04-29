import { Resend } from ""resend"";

const resend = new Resend(process.env.RESEND_API_KEY || "re_test_123");

export async function sendOrderConfirmationEmail(email: string, orderNumber: string, orderTotal: string, name: string) {
        if (!process.env.RESEND_API_KEY) {
                console.log("Email Mock (No RESEND_API_KEY set):\n  To: $email\n  Subject: Order Confirmation #$orderNumber\n  Hi $name, your order has been received.\n  Total: $orderTotal");
                return;
        }

        try {
                await resend.emails.send({
                        from: "Sumud Scents <orders@sumudscents.com>",
                        to: email,
                        subject: "Order Confirmation #$orderNumber",
                        html: "<p>Hi $name,</p><p>Thank you for your order <strong>#$orderNumber</strong>!</p><p>We are preparing it now. We will notify you when it ships.</p><p>Order total: $orderTotal</p><p>Sumud Scents</p>"
                });
                console.log("Email sent successfully to $email");
        } catch (error) {
                console.error("Failed to send confirmation email:", error);
        }
}
