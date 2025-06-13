import { Invoice } from "@getalby/lightning-tools";
import QRCode from "qrcode.react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Backbar } from "../../components/Backbar";
import React from "react";

export function Pay() {
  //const { invoice } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { paymentRequest, verify } = location.state as { paymentRequest: string; verify: string };
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [hasCopied, setCopied] = useState(false);

  const invoice = React.useMemo(
    () =>
      new Invoice({
        pr: paymentRequest,
        verify,
      }),
    [paymentRequest, verify]
  );

  function copyQr() {
    try {
      if (!paymentRequest) {
        return;
      }
      window.navigator.clipboard.writeText(paymentRequest);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (invoice) {
      const { satoshi, description } = invoice;
      setAmount(satoshi);
      if (description) {
        setDescription(description);
      }

      const interval = setInterval(async () => {
        console.log("Checking invoice", invoice);
        try {
          const paid = await invoice.verifyPayment();
          if (paid) {
            navigate("../paid");
          }
        } catch (error) {
          console.error("failed to verify payment", error);
        }
      }, 3000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [invoice, navigate]);

  if (!invoice) {
    return null;
  }

  return (
    <>
      <Backbar />
      <div className="flex grow flex-col items-center justify-center gap-5">
        <span className="text-4xl font-bold">{new Intl.NumberFormat().format(amount)} sats</span>
        <span className="font-semibold">{description}</span>
        <div className="relative flex items-center justify-center p-4 bg-white" onClick={copyQr}>
          <QRCode value={invoice.paymentRequest} size={256} />
        </div>
        <p className="mb-4 flex flex-row items-center justify-center gap-2">
          {!hasCopied && <span className="loading loading-spinner text-primary"></span>}
          {hasCopied ? "✅ Invoice Copied!" : "Waiting for payment..."}
        </p>
        <button
          onClick={() => {
            navigate("../new");
          }}
          className="btn"
        >
          Cancel
        </button>
      </div>
    </>
  );
}
