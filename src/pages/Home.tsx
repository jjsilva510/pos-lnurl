import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BuzzPay } from "../components/icons/BuzzPay";
import { localStorageKeys } from "../constants";
import { Footer } from "../components/Footer";

export function Home() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  React.useEffect(() => {
    const label = params.get("label") || params.get("name");
    if (label) {
      localStorage.setItem(localStorageKeys.label, label); // Save the label to local storage
    }

    const currency = params.get("currency");
    if (currency) {
      localStorage.setItem(localStorageKeys.currency, currency); // Save the currency to local storage
    }

    // Load lightning address from query parameter and save it to local storage
    const lightningAddressEncoded = params.get("lightningAddress");
    if (lightningAddressEncoded) {
      try {
        const lightningAddress = atob(lightningAddressEncoded);
        // store the wallet URL so PWA can restore it (PWA always loads on the homepage)
        window.localStorage.setItem(localStorageKeys.lightningAddress, lightningAddress);
        navigate(`/wallet/new`);
      } catch (error) {
        console.error(error);
        alert("Failed to load wallet: " + error);
      }
    }
    const lightningAddress = window.localStorage.getItem(localStorageKeys.lightningAddress);
    if (lightningAddress) {
      navigate(`/wallet/new`);
    }
  }, [navigate, params]);

  function setLightningAddress() {
    const lightningAddress = prompt("Enter your Lightning Address here.");
    if (lightningAddress) {
      window.localStorage.setItem(localStorageKeys.lightningAddress, lightningAddress);
      navigate(`/wallet/new`);
    }
  }

  return (
    <>
      <div
        className="flex flex-col justify-center items-center w-full h-full bg-primary"
        // force light theme on the home/welcome page because it has a yellow background
        data-theme="light"
      >
        <div className="flex flex-1 flex-col justify-center items-center max-w-lg">
          <BuzzPay className="mb-8" />

          <p className="text-center mb-4">Point-of-Sale for bitcoin lightning payments</p>

          <button className="btn mt-8 btn-sm btn-secondary" onClick={setLightningAddress}>
            Set Lightning Address
          </button>

          <button className="btn mt-8 btn-sm btn-secondary btn-outline" onClick={importWallet}>
            Import Wallet URL
          </button>
        </div>
        <Footer />
      </div>
    </>
  );
}

// Needed on iOS because PWA localStorage is not shared with Safari.
// PWA can only be installed with a static URL (e.g. "/pos/").

function importWallet() {
  const url = prompt(
    "On BuzzPay in another browser, go to the sidebar menu -> Share with a co-worker, copy the share URL and paste it here."
  );
  if (url) {
    window.location.href = url;
  }
}
