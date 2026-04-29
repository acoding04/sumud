const fs = require('fs');
let code = fs.readFileSync('app/order/success/[id]/page.tsx', 'utf8');
code = code.replace('\"li-$[++lineItemCounter]\"', '\li-${++lineItemCounter}\');
code = code.replace('\"p-$(item.variantId.replace(\"v-\", \"\"))\"', '\p-${item.variantId.replace(\"v-\", \"\")}\');
fs.writeFileSync('app/order/success/[id]/page.tsx', code);
