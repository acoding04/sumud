const fs = require('fs');
function updateFile(path) {
        let code = fs.readFileSync(path, 'utf8');

        if (!code.includes('import { sendOrderConfirmationEmail }')) {
                // Add import above getStripe or at top
                code = code.replace(/import \{ getStripe \} from .*/, match => match + '\nimport { sendOrderConfirmationEmail } from \"@/lib/email\";');
        }

        // for page.tsx
        if (code.includes('SENDING CONFIRMATION EMAIL TO')) {
                code = code.replace(
                        /console\.log\([^]*?SENDING CONFIRMATION EMAIL TO[^]*?\);[^]*?commerce\.orderCreate\(\{[\s\S]*?\}\);/m,
                        (match) => {
                                // keep the commerce.orderCreate, then add email sending
                                const orderCreateBlock = match.substring(match.indexOf('order ='));
                                return orderCreateBlock + '\n\n\t\t\t\t\t\t\t\t\tif (order?.customer?.email) {\n\t\t\t\t\t\t\t\t\t\tconst totalAmount = order.lineItems.reduce((acc, curr) => acc + (Number(curr.productVariant.price) * curr.quantity), 0) + Number(order.shipping.price);\n\t\t\t\t\t\t\t\t\t\tawait sendOrderConfirmationEmail(\n\t\t\t\t\t\t\t\t\t\t\torder.customer.email,\n\t\t\t\t\t\t\t\t\t\t\torder.lookup,\n\t\t\t\t\t\t\t\t\t\t\ttotalAmount.toString(),\n\t\t\t\t\t\t\t\t\t\t\torder.customer.name\n\t\t\t\t\t\t\t\t\t\t);\n\t\t\t\t\t\t\t\t\t}';
                        }
                );
        }
        
        // for webhook
        if (path.includes('route.ts') && !code.includes('sendOrderConfirmationEmail')) {
            code = code.replace(
                    /await commerce\.orderCreate\(\{[\s\S]*?\}\);/m,
                    (match) => {
                            return \const order = \
                                    if (order?.customer?.email) {
                                            const totalAmount = order.lineItems.reduce((acc, curr) => acc + (Number(curr.productVariant.price) * curr.quantity), 0) + Number(order.shipping.price);
                                            await sendOrderConfirmationEmail(
                                                    order.customer.email,
                                                    order.lookup,
                                                    totalAmount.toString(),
                                                    order.customer.name
                                            );
                                    }\;
                    }
            );
        }

        fs.writeFileSync(path, code);
}

updateFile('app/order/success/[id]/page.tsx');
updateFile('app/api/webhooks/stripe/route.ts');
