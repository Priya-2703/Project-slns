// ✅ razorpayHelper.jsx - FIXED VERSION

const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
};

export const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

// ✅ Order Create API Call
export const createRazorpayOrder = async (amount) => {
    const token = getAuthToken();

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/create-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ amount })
        });
        
        const data = await response.json();
        console.log("create order", data);
        return data;
    } catch (error) {
        console.error('Order creation failed:', error);
        throw error;
    }
};

// ✅ Payment Verification API Call
export const verifyPayment = async (paymentData) => {
    const token = getAuthToken();

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(paymentData)
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Verification failed:', error);
        throw error;
    }
};

// ✅✅✅ NEW: Place Order API Call
export const placeOrder = async (orderData) => {
    const token = getAuthToken();

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/place`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(orderData)
        });
        
        const data = await response.json();
        console.log("place order response", data);
        return data;
    } catch (error) {
        console.error('Place order failed:', error);
        throw error;
    }
};