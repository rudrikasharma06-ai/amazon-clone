function openChat(){
    document.getElementById("chatbox").style.display = "block";
}

function closeChat(){
    document.getElementById("chatbox").style.display = "none";
}

const products = [
    { name: "iPhone 16 Pro Max", brand: "Apple", category: "mobiles", price: 1199, details: "256GB storage, A18 Pro chip, titanium frame, and Pro camera system." },
    { name: "iPhone 15", brand: "Apple", category: "mobiles", price: 799, details: "128GB storage, Dynamic Island, A16 Bionic chip, and 48MP main camera." },
    { name: "AirPods Pro (2nd Gen)", brand: "Apple", category: "electronics", price: 249, details: "Active Noise Cancellation, Adaptive Audio, and USB-C charging case." },
    { name: "Apple Watch Series 10", brand: "Apple", category: "electronics", price: 399, details: "Always-On Retina display, ECG monitor, and sleep apnea notifications." },
    { name: "Galaxy S25 Ultra", brand: "Samsung", category: "mobiles", price: 1299, details: "512GB storage, 200MP camera, Galaxy AI, and an embedded S Pen." },
    { name: "Galaxy A56 5G", brand: "Samsung", category: "mobiles", price: 449, details: "128GB storage, 120Hz Super AMOLED display, and two-day battery life." },
    { name: "OnePlus 13", brand: "OnePlus", category: "mobiles", price: 799, details: "16GB RAM, Snapdragon 8 Gen 4, Hasselblad camera, and 100W charging." },
    { name: "Vivo X200 Pro", brand: "Vivo", category: "mobiles", price: 899, details: "ZEISS telephoto camera, Dimensity 9400 chip, and cinematic portrait mode." },
    { name: "HP Spectre x360", brand: "HP", category: "laptops", price: 1349, details: "Intel Core Ultra 7, 16GB RAM, 1TB SSD, and a 14-inch OLED touchscreen." },
    { name: "HP Victus 16 Gaming", brand: "HP", category: "laptops", price: 849, details: "AMD Ryzen 7, NVIDIA RTX 4060, 16GB DDR5 RAM, and 144Hz display." },
    { name: "Dell XPS 13", brand: "Dell", category: "laptops", price: 1299, details: "InfinityEdge display, CNC aluminum chassis, and Intel Core Ultra 5." },
    { name: "ThinkPad X1 Carbon Gen 12", brand: "Lenovo", category: "laptops", price: 1499, details: "Ultra-light carbon fiber build, military-grade durability, and privacy shutter." },
    { name: "Men's Premium Cotton Hoodie", brand: "Fashion", category: "fashion", price: 34.99, details: "Pre-shrunk organic cotton, sizes S-XXL, and five earth-tone colors." },
    { name: "CloudWalk Performance Sneakers", brand: "Fashion", category: "fashion", price: 59.99, details: "Memory foam, breathable mesh, and shock-absorbing soles." },
    { name: "Sony 65-inch 4K HDR Smart OLED TV", brand: "Sony", category: "electronics", price: 799, details: "Google TV, Dolby Vision, and native 120Hz VRR for gaming." },
    { name: "JBL Charge 5 Waterproof Speaker", brand: "JBL", category: "electronics", price: 149, details: "IP67 water resistance and up to 20 hours of playback." },
    { name: "Sony WH-1000XM5 Headphones", brand: "Sony", category: "electronics", price: 349, details: "Industry-leading noise cancellation and a 30-hour battery." }
];

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
}[character]));

function productCard(product){
    return `<b>${escapeHtml(product.name)}</b><br>
        $${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}<br>
        <small>${escapeHtml(product.details)}</small>`;
}

function answerProductQuery(query){
    const normalizedQuery = query.toLowerCase();
    const words = normalizedQuery.match(/[a-z0-9]+/g) || [];
    const stopWords = new Set(["a", "an", "the", "is", "are", "do", "you", "have", "show", "me", "find", "tell", "about", "product", "products", "item", "items", "price", "cost", "for", "please", "what", "which", "can", "i", "buy"]);
    const searchWords = words.filter((word) => !stopWords.has(word) && word.length > 1 && !/^\d+$/.test(word));
    const budgetMatch = normalizedQuery.match(/\b(?:under|below|less than|up to|max(?:imum)?)\s*\$?\s*(\d+(?:\.\d{1,2})?)\b/);
    const budget = budgetMatch ? Number(budgetMatch[1]) : null;
    const category = ["mobiles", "mobile", "phones", "laptops", "laptop", "fashion", "electronics"].find((value) => normalizedQuery.includes(value));
    const matches = products.filter((product) => {
        const searchable = `${product.name} ${product.brand} ${product.category} ${product.details}`.toLowerCase();
        const matchesWords = searchWords.some((word) => searchable.includes(word));
        const matchesCategory = !category || product.category === (category === "mobile" || category === "phones" ? "mobiles" : category === "laptop" ? "laptops" : category);
        return matchesWords && matchesCategory && (budget === null || product.price <= budget);
    });

    if (matches.length) {
        return `<b>🛍️ Here are products matching your request:</b><br><br>${matches.slice(0, 4).map(productCard).join("<br><br>")}`;
    }

    if (budget !== null && searchWords.length) {
        return `I couldn't find a matching product under $${budget.toFixed(2)}. Try raising your budget or ask for another category.`;
    }

    if (/\b(product|products|catalog|browse|shop)\b/.test(normalizedQuery)) {
        return "🛍️ I can help you find mobiles, laptops, fashion, and electronics. Try asking “show me laptops under $1000” or “what Apple products do you have?”";
    }

    return null;
}

function answerQuestion(query){
    const normalizedQuery = query.toLowerCase();
    const productReply = answerProductQuery(normalizedQuery);
    if (productReply) return productReply;

    if (/\b(hello|hi|hey)\b/.test(normalizedQuery)) return "Hello 👋 Ask me about products, prices, delivery, returns, payments, offers, or orders.";
    if (/\b(offer|offers|discount|deal|deals|coupon)\b/.test(normalizedQuery)) return "🔥 Current offers: 50% off selected electronics with code <b>ELEC50</b>, up to 40% off fashion, and an additional 10% card cashback.";
    if (/\b(payment|pay|upi|cash on delivery|cod)\b/.test(normalizedQuery)) return "💳 We accept UPI, Visa/Mastercard, NetBanking, and Cash on Delivery where available.";
    if (/\b(delivery|shipping|arrive|deliver)\b/.test(normalizedQuery)) return "🚚 Standard delivery takes 2–4 business days for Prime customers. Express delivery is available within 24 hours for $5.99.";
    if (/\b(return|refund|replace)\b/.test(normalizedQuery)) return "↩️ Items can be returned or replaced within 7 days of delivery when unused and kept in the original packaging.";
    if (/\b(order|track|tracking)\b/.test(normalizedQuery)) return "📦 Your last order #AMZ-994821 is with the local courier and is estimated to arrive tomorrow by 8:00 PM.";
    if (/\b(help|support|agent|contact)\b/.test(normalizedQuery)) return "👨‍💼 I can answer product, order, delivery, payment, offer, and returns questions. Choose a quick option or type your question.";
    return "I’m not sure about that yet. Try asking about a product, price, category, delivery, returns, payment, offers, or an order.";
}

function sendMessage(){
    const input = document.getElementById("userInput");
    const text = input.value.trim();

    if (!text) return;

    const messages = document.getElementById("messages");
    messages.innerHTML += `<div class="user">${escapeHtml(text)}</div>`;
    const reply = answerQuestion(text);

    setTimeout(function () {
        messages.innerHTML += `<div class="bot">${reply}</div>`;
        messages.scrollTop = messages.scrollHeight;
    }, 500);

    input.value = "";
}

document.getElementById("userInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") sendMessage();
});

function selectOption(option){
    let messages = document.getElementById("messages");
    
    // Display what the user clicked inside the chat window
    messages.innerHTML += `<div class="user">${option.toUpperCase()}</div>`;
    let reply = "";

    switch(option){
        // --- CATEGORIES ---
        case "products":
            reply = `
            <b>🛍️ Choose a Category</b><br><br>
            <button onclick="selectOption('mobiles')">📱 Mobiles</button>
            <button onclick="selectOption('laptops')">💻 Laptops</button>
            <button onclick="selectOption('fashion')">👕 Fashion</button>
            <button onclick="selectOption('electronics')">📺 Electronics</button>
            `;
            break;

        case "mobiles":
            reply = `
            <b>📱 Choose Brand</b><br><br>
            <button onclick="selectOption('apple')">Apple</button>
            <button onclick="selectOption('samsung')">Samsung</button>
            <button onclick="selectOption('oneplus')">OnePlus</button>
            <button onclick="selectOption('vivo')">Vivo</button>
            `;
            break;

        case "laptops":
            reply = `
            <b>💻 Choose Brand</b><br><br>
            <button onclick="selectOption('hp')">HP</button>
            <button onclick="selectOption('dell')">Dell</button>
            <button onclick="selectOption('lenovo')">Lenovo</button>
            `;
            break;

        // --- SPECIFIC BRAND & SPECIFICATION DATA ---
        case "apple":
            reply = `
            <b>🍎 Apple Store Showcase:</b><br><br>
            • <b>iPhone 16 Pro Max</b><br>
            Price: $1,199 | 256GB Storage, A18 Pro Chip, Titanium Frame, Pro Camera System.<br><br>
            • <b>iPhone 15</b><br>
            Price: $799 | 128GB Storage, Dynamic Island, A16 Bionic chip, 48MP Main Camera.<br><br>
            • <b>AirPods Pro (2nd Gen)</b><br>
            Price: $249 | Active Noise Cancellation, Adaptive Audio, USB-C Charging Case.<br><br>
            • <b>Apple Watch Series 10</b><br>
            Price: $399 | Always-On Retina Display, ECG Monitor, Sleep Apnea Notifications.
            `;
            break;

        case "samsung":
            reply = `
            <b>📱 Samsung Galaxy Showcase:</b><br><br>
            • <b>Galaxy S25 Ultra</b><br>
            Price: $1,299 | 512GB, 200MP Camera, Galaxy AI Built-in, Embedded S-Pen.<br><br>
            • <b>Galaxy A56 5G</b><br>
            Price: $449 | 128GB, Crisp 120Hz Super AMOLED Screen, 2-Day Battery Life.<br><br>
            • <b>Galaxy Buds3 Pro</b><br>
            Price: $219 | Ultimate Hi-Fi Audio Quality, Blade Lights design, Intelligent ANC.
            `;
            break;

        case "oneplus":
            reply = `
            <b>⚡ OnePlus Showcase:</b><br><br>
            • <b>OnePlus 13</b><br>
            Price: $799 | 16GB RAM, Snapdragon 8 Gen 4, Hasselblad Camera, 100W SuperVOOC Fast Charge.<br><br>
            • <b>OnePlus Nord CE 5</b><br>
            Price: $299 | Affordable 5G Powerhouse, 5000mAh Battery, Fluid AMOLED Display.
            `;
            break;

        case "vivo":
            reply = `
            <b>📸 Vivo Showcase:</b><br><br>
            • <b>Vivo X200 Pro</b><br>
            Price: $899 | ZEISS Apo Telephoto Camera, Dimensity 9400 Chip, Cinematic Portrait Master.<br><br>
            • <b>Vivo V50 Slim</b><br>
            Price: $399 | Ultra-Thin Body Architecture, Studio-Quality Aura Light, 50MP Eye-AF Selfie.
            `;
            break;

        case "hp":
            reply = `
            <b>💻 HP Laptop Solutions:</b><br><br>
            • <b>HP Spectre x360</b><br>
            Price: $1,349 | Intel Core Ultra 7, 16GB RAM, 1TB SSD, 14" OLED 2-in-1 Touchscreen.<br><br>
            • <b>HP Victus 16 Gaming</b><br>
            Price: $849 | AMD Ryzen 7, NVIDIA RTX 4060, 16GB DDR5 RAM, 144Hz Refresh Rate Display.
            `;
            break;

        case "dell":
            reply = `
            <b>💻 Dell Premium Devices:</b><br><br>
            • <b>Dell XPS 13</b><br>
            Price: $1,299 | InfinityEdge Borderless Screen, CNC Aluminum Chassis, Intel Core Ultra 5.<br><br>
            • <b>Dell Inspiron 15</b><br>
            Price: $549 | 16GB RAM, 512GB NVMe SSD, AMD Ryzen 5, Perfect Everyday Home/Office Workhorse.
            `;
            break;

        case "lenovo":
            reply = `
            <b>💻 Lenovo Computing Portfolio:</b><br><br>
            • <b>ThinkPad X1 Carbon Gen 12</b><br>
            Price: $1,499 | Ultra-Light Carbon Fiber Build, Military-Grade Durability, Pro Privacy Shutter.<br><br>
            • <b>Legion 5 Pro Gaming</b><br>
            Price: $1,099 | NVIDIA RTX 4070, Coldfront Cooling Matrix, RGB Keyboard, High-FPS Native Performance.
            `;
            break;

        case "fashion":
            reply = `
            <b>👕 Fashion Hub Catalogue:</b><br><br>
            • <b>Men's Premium Cotton Hoodie</b><br>
            Price: $34.99 | Sizes S-XXL, Pre-shrunk Organic Cotton, 5 Trendy Earth Colors.<br><br>
            • <b>Women's Floral Tiered Midi Dress</b><br>
            Price: $29.99 | Breathable Rayon blend, perfect for seasonal casual outings.<br><br>
            • <b>CloudWalk Performance Sneakers</b><br>
            Price: $59.99 | Orthotic Memory Foam, Ergonomic Breathable Mesh, Shock Absorbing Soles.
            `;
            break;

        case "electronics":
            reply = `
            <b>📺 Home Electronics Best Sellers:</b><br><br>
            • <b>Sony 65" 4K HDR Smart OLED TV</b><br>
            Price: $799 | Google TV Built-in, Dolby Vision, Native 120Hz VRR for next-gen gaming consoles.<br><br>
            • <b>JBL Charge 5 Waterproof Speaker</b><br>
            Price: $149 | Dual Bass Radiators, IP67 Dust/Waterproof, 20 Hours of Continuous Playback.<br><br>
            • <b>Sony WH-1000XM5 Headphones</b><br>
            Price: $349 | Industry-Leading Active Noise Cancelling, Smart Listening, 30-Hour Quick Charge Battery.
            `;
            break;

        // --- ORDERS, LOGISTICS & OTHER WORKFLOWS ---
        case "orders":
            reply = `
            <b>📦 Order Management Portal</b><br><br>
            Please choose an option regarding your delivery or historical orders:<br><br>
            <button onclick="selectOption('track')">Track Order</button>
            <button onclick="selectOption('cancel')">Cancel Order</button>
            <button onclick="selectOption('history')">Order History</button>
            `;
            break;

        case "track":
            reply = "🔍 <b>Tracking Status:</b> Your last order <b>#AMZ-994821</b> is currently with local courier facilities. Estimated arrival is tomorrow by <b>8:00 PM</b>.";
            break;

        case "cancel":
            reply = "⚠️ <b>Cancellation Terms:</b> Active packages can be canceled instantaneously from this dashboard as long as the status has not updated to 'Shipped'. Go to your profile menu -> orders to click 'Request Cancel'.";
            break;

        case "history":
            reply = "📂 <b>Order History:</b> You have placed 4 successful orders over the last 90 days. To pull formal tax invoices, please check the 'Returns & Orders' anchor tag linked in the top navigation header bar.";
            break;

        case "offers":
            reply = `
            <b>🔥 Active Storewide Deals:</b><br><br>
            • <b>Electronics Promotion:</b> Flat 50% Off selected items. Use Voucher Code: <b>ELEC50</b>.<br>
            • <b>Fashion clearance:</b> Up to 40% Off summer styles. Discount automatically calculated at checkout.<br>
            • <b>Bank Privilege:</b> Additional 10% instant cashback utilizing major Credit Cards.
            `;
            break;

        case "payment":
            reply = "💳 <b>Secure Checkouts Accepted:</b><br>We process orders securely using unified payment options including: <b>UPI Apps</b>, <b>Visa/Mastercard Credit or Debit instruments</b>, <b>NetBanking gateways</b>, and <b>Cash on Delivery (COD)</b> at processing.";
            break;

        case "delivery":
            reply = "🚚 <b>Logistics Options:</b><br>• <b>Standard Logistics:</b> Free fulfillment for Prime profiles (2 to 4 business days).<br>• <b>Express Priority:</b> Guaranteed distribution within 24 hours ($5.99 surcharge applied at confirmation).";
            break;

        case "returns":
            reply = "↩️ <b>7-Day Return Policy:</b> Items can be returned or replaced directly within a 7-day period from delivery if undamaged and kept with original brand packaging tags preserved.";
            break;

        case "support":
            reply = "👨‍💼 <b>Customer Help Center:</b><br>Reach our responsive 24/7 client advocacy helpline toll-free at <b>1800-000-000</b> or send electronic complaints to <i>support@amazon.clone</i>.";
            break;

        default:
            reply = "Please choose a valid interactive option or type your request clearly into the input box.";
    }

    setTimeout(function(){
        messages.innerHTML += `<div class="bot">${reply}</div>`;
        messages.scrollTop = messages.scrollHeight;
    }, 500);
}