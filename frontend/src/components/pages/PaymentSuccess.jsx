// src/components/pages/PaymentSuccess.jsx

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [hasConfirmed, setHasConfirmed] = useState(false); // ✅ Prevent double call

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId || hasConfirmed) return;

    const confirmPayment = async () => {
      try {
        console.log("Session ID from URL:", sessionId);

        // Step 1: Get session details from Stripe
        const sessionRes = await fetch(`http://localhost:5000/stripe/session/${sessionId}`);
        const sessionData = await sessionRes.json();
        console.log("Fetched session:", sessionData);

        // Step 2: Confirm payment with your backend
        const confirmRes = await fetch("http://localhost:5000/stripe/confirm-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const confirmData = await confirmRes.json();
        console.log("Confirm result:", confirmData);

        if (confirmData.success) {
          alert("Booking confirmed!");
          navigate("/user/booking-history");
        } else {
          alert("Booking confirmation failed.");
        }

        setHasConfirmed(true); // ✅ Mark as confirmed to prevent repeat
      } catch (err) {
        console.error("Error confirming booking:", err);
        alert("Something went wrong.");
      }
    };

    confirmPayment();
  }, [searchParams, navigate, hasConfirmed]); // ✅ include hasConfirmed

  return (
    <div className="text-white text-center mt-20">
      <h1 className="text-3xl font-bold mb-4">Payment Successful</h1>
      <p>We're confirming your booking...</p>
    </div>
  );
}

export default PaymentSuccess;
