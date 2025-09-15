const express = require("express");
const router = express.Router();

const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_KEY);

router.post("/create-checkout-session", async (req, res) => {
    try {
        const { items } = req.body; // items from POS frontend
        // Example: [{ name: "Pomade", price: 1500, quantity: 2 }]

        console.log(items);
        const line_items = items.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: { name: item.name },
                unit_amount: item.price, // in cents
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pos?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/pos`,
        });

        res.json({ id: session.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    (req, res) => {
        const sig = req.headers["stripe-signature"];
        let event;

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            console.log("checkout completed");
            // ✅ Mark order as paid in your DB
        }

        res.json({ received: true });
    }
);

const calculateOrderAmount = (items) => {
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    let total = 0;
    items.forEach((item) => {
        total += item.amount;
    });
    return total;
};

router.post("/create-payment-intent", async (req, res) => {
    const { items } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(items),
        currency: "usd",
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
            enabled: true,
        },
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
    });
});

router.post("/add-tip", async (req, res) => {
    const { tip, paymentIntentId } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.update(
            paymentIntentId,
            {
                amount: paymentIntent.amount_received + tip * 100, // Add tip amount in cents
            }
        );

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.post("/capture_payment_intent", async (req, res) => {
    const intent = await stripe.paymentIntents.capture(
        req.body.payment_intent_id
    );
    res.send(intent);
});

// Invoke this method in your webhook handler when `payment_intent.succeeded` webhook is received
const handlePaymentIntentSucceeded = async (paymentIntent) => {
    // Create a Tax Transaction for the successful payment
    stripe.tax.transactions.createFromCalculation({
        calculation: paymentIntent.metadata["tax_calculation"],
        reference: "myOrder_123", // Replace with a unique reference from your checkout/order system
    });
};

//STRIPE CONNECT

router.post("/account_link", async (req, res) => {
    try {
        const { account } = req.body;

        const accountLink = await stripe.accountLinks.create({
            account: account,
            return_url: `${req.headers.origin}/register/${account}`,
            refresh_url: `${req.headers.origin}/refresh/${account}`,
            type: "account_onboarding",
        });

        res.json(accountLink);
    } catch (error) {
        console.error(
            "An error occurred when calling the Stripe API to create an account link:",
            error
        );
        res.status(500);
        res.send({ error: error.message });
    }
});

router.post("/account", async (req, res) => {
    try {
        const account = await stripe.accounts.create({});

        res.json({
            account: account.id,
        });
    } catch (error) {
        console.error(
            "An error occurred when calling the Stripe API to create an account",
            error
        );
        res.status(500);
        res.send({ error: error.message });
    }
});

// Check if a connected Stripe account has entered payment information
router.get("/account_status/:accountId", async (req, res) => {
    const { accountId } = req.params;

    try {
        const account = await stripe.accounts.retrieve(accountId);

        const accountStatus = {
            charges_enabled: account.charges_enabled,
            payouts_enabled: account.payouts_enabled,
            details_submitted: account.details_submitted,
        };

        res.json(accountStatus);
    } catch (error) {
        console.error("Error retrieving Stripe account:", error);
        res.status(500).send({ error: error.message });
    }
});

router.get("/*", (_req, res) => {
    res.sendFile(__dirname + "/dist/index.html");
});

module.exports = router;
