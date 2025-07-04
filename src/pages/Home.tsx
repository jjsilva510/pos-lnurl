import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { localStorageKeys } from "../constants";
import { Footer } from "../components/Footer";

export function Home() 
{
  const navigate = useNavigate();
  const [params] = useSearchParams();
  //State to hold the value of the lightning address input field
  const [lightningAddressInput, setLightningAddressInput] = useState("");
  const [businessNameInput, setBusinessNameInput] = useState("");

  React.useEffect(() => {
    const label = params.get("label") || params.get("name");
    if (label) 
    {
      localStorage.setItem(localStorageKeys.label, label); // Save the label to local storage
    }

    const currency = params.get("currency");
    if (currency) 
    {
      localStorage.setItem(localStorageKeys.currency, currency); // Save the currency to local storage
    }

    // --- Loading Lightning Address from URL Query Parameter ---
    // This block handles cases where a Lightning Address is passed directly in the URL,
    // often used for sharing wallet configurations or deep linking.
    const lightningAddressEncoded = params.get("lightningAddress");
    if (lightningAddressEncoded) // If the 'lightningAddress' query parameter exists, attempt to decode and use it.
    {
      try 
      {
        const lightningAddress = atob(lightningAddressEncoded); // the Lightning Address in the URL.
        // store the wallet URL so PWA can restore it (PWA always loads on the homepage)
        window.localStorage.setItem(localStorageKeys.lightningAddress, lightningAddress);
        // Immediately navigate the user to the `/wallet/new` route.
        navigate(`/wallet/new`);
        return; // Add return to prevent further execution after navigation
      } 
      catch (error) 
      {
        console.error(error);
        alert("Failed to load wallet: " + error);
      }
    }
    // --- Loading Lightning Address from Local Storage ---
    // This block handles cases where the user has previously set up a Lightning Address
    // and it's stored in local storage, allowing for session persistence.
    // This check is performed *after* the URL parameter check, giving URL parameters priority.
    const lightningAddress = window.localStorage.getItem(localStorageKeys.lightningAddress);
    if (lightningAddress)       // If a Lightning Address is found in local storage, automatically navigate
    {
      navigate(`/wallet/new`);
      return;
    }

    //load business name from local storage
    const storedBusinessName = window.localStorage.getItem(localStorageKeys.businessName);
    if (storedBusinessName) 
    {
      setBusinessNameInput(storedBusinessName);
    }
  }, [navigate, params]);

  

  // --- setLightningAddress Function ---
  // This function is called when the user clicks the "Set Lightning Address" button.
  // It provides a manual way for the user to input their Lightning Address.
  function handleSetAddressAndName() {
    // Use the value from the state variable (which is bound to the input field)
    const lightningAddress = lightningAddressInput.trim(); // Trim whitespace
    const businessName = businessNameInput.trim();

    if (!lightningAddress) 
    {
      alert("Please enter your Lightning Address.");
      return;
    }
    // NEW: Add validation for business name
    if (!businessName) 
    {
      alert("Please enter your Business Name.");
      return;
    }

    window.localStorage.setItem(localStorageKeys.lightningAddress, lightningAddress);
    // NEW: Save the business name to local storage
    window.localStorage.setItem(localStorageKeys.businessName, businessName);

    navigate(`/wallet/new`);
  }

  return (
    
    <div
      className="flex flex-col justify-center items-center w-full h-full bg-primary"
      // force light theme on the home/welcome page because it has a yellow background
      data-theme="light"
    >
      <div className="flex flex-1 flex-col justify-center items-center max-w-lg">
        {/* <BuzzPay className="mb-8" />  comment out*/}

        <p className="text-center mb-4">SATSCASH</p>
        <p className="text-center mb-4">Lightning POS</p>

        <input
            type="text"
            placeholder="Your Business Name"
            className="input input-bordered w-full max-w-xs mb-4" // Add some styling for better appearance
            value={businessNameInput} // Bind input value to state
            onChange={(e) => setBusinessNameInput(e.target.value)} // Update state on input change
          />

        <input
            type="text"
            placeholder="Enter your Lightning Address"
            className="input input-bordered w-full max-w-xs mb-4" // Add some styling for better appearance
            value={lightningAddressInput} // Bind input value to state
            onChange={(e) => setLightningAddressInput(e.target.value)} // Update state on input change
          />

          {/*
          <input
            type="text"
            placeholder="Security Pin"
            className="input input-bordered w-full max-w-xs mb-4" // Add some styling for better appearance
            value={lightningAddressInput} // Bind input value to state
            onChange={(e) => setLightningAddressInput(e.target.value)} // Update state on input change
          />
          */}

        <button className="btn mt-8 btn-sm btn-secondary" onClick={handleSetAddressAndName}>
          Set Lightning Address
        </button>

        <button className="btn mt-8 btn-sm btn-secondary btn-outline" onClick={importWallet}>
          Import Wallet URL
        </button>
      </div>
      <Footer />
    </div>
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
