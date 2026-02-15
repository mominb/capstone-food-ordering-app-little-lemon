export const BUSINESS_CONFIG = {
   // Business Identity
   businessName: "Little Lemon",
   businessTagline: "Fresh Mediterranean flavors delivered",

   // Location & Contact
   country: "Pakistan",
   countryCode: "+92",
   currency: "PKR",

   // App Identity
   appName: "Little Lemon",
   appVersion: "1.0.0",

   // Default Settings
   defaultLanguage: "en",
   timeZone: "Asia/Karachi",

   // Delivery Options
   deliveryOptions: [
      { label: "Deliver to Doorstep", value: "Delivery" },
      { label: "Pick-up from Restaurant", value: "Pickup" },
   ],

   // Payment Options
   paymentOptions: [
      { label: "Cash on Delivery", value: "COD" },
      { label: "Credit/Debit Card", value: "Card" },
   ],

   // Order Status Values
   orderStatuses: [
      { label: "Pending", value: "pending" },
      { label: "Preparing", value: "preparing" },
      { label: "Ready", value: "ready" },
      { label: "Delivered", value: "delivered" },
   ],

   // Validation Rules & Regex Patterns
   validation: {
      // Phone number validation (Pakistan mobile: 10-11 digits)
      phoneRegex: /^\d{10,11}$/,
      phoneFormat: "3XX-XXXXXXX",
      phoneMinLength: 10,
      phoneMaxLength: 11,
      phoneErrorMessage: "Please enter a valid 10-11 digit phone number",

      // Email validation
      emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      emailErrorMessage: "Please enter a valid email address",

      // Name validation
      nameMinLength: 2,
      nameMaxLength: 50,
      nameRegex: /^[a-zA-Z\s'-]+$/,
      nameErrorMessage:
         "Name can only contain letters, spaces, hyphens, and apostrophes",

      // Quantity validation
      minOrderQuantity: 1,
      maxOrderQuantity: 99,
   },

   // Country-Specific Formats
   formats: {
      dateFormat: "DD/MM/YYYY",
      dateTimeFormat: "DD/MM/YYYY hh:mm A",
      timeFormat: "hh:mm A",
      use24HourFormat: false,
      currencyPosition: "left",
      currencySpacing: true,
      decimalSeparator: ".",
      thousandSeparator: ",",
      currencyDecimals: 2,
   },
};

// Validation helper functions
export const validatePhone = (phone) => {
   const { phoneRegex, phoneErrorMessage } = BUSINESS_CONFIG.validation;
   const cleanPhone = phone.replace(/\D/g, "");
   if (!phoneRegex.test(cleanPhone)) {
      return { valid: false, message: phoneErrorMessage };
   }
   return { valid: true };
};

export const validateEmail = (email) => {
   const { emailRegex, emailErrorMessage } = BUSINESS_CONFIG.validation;
   if (!email || !emailRegex.test(email)) {
      return { valid: false, message: emailErrorMessage };
   }
   return { valid: true };
};

export const validateName = (name) => {
   const { nameMinLength, nameMaxLength, nameRegex, nameErrorMessage } =
      BUSINESS_CONFIG.validation;
   if (!name || name.length < nameMinLength || name.length > nameMaxLength) {
      return {
         valid: false,
         message: `Name must be between ${nameMinLength} and ${nameMaxLength} characters`,
      };
   }
   if (!nameRegex.test(name)) {
      return { valid: false, message: nameErrorMessage };
   }
   return { valid: true };
};

export const formatCurrency = (amount) => {
   const {
      currencyPosition,
      currencySpacing,
      decimalSeparator,
      thousandSeparator,
      currencyDecimals,
   } = BUSINESS_CONFIG.formats;
   const { currency } = BUSINESS_CONFIG;

   const formattedAmount = Number(amount)
      .toFixed(currencyDecimals)
      .replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)
      .replace(".", decimalSeparator);

   const space = currencySpacing ? " " : "";

   if (currencyPosition === "left") {
      return `${currency}${space}${formattedAmount}`;
   } else {
      return `${formattedAmount}${space}${currency}`;
   }
};

export const formatPhoneNumber = (phone) => {
   const { countryCode } = BUSINESS_CONFIG;
   const cleanPhone = phone.replace(/^\+?\d{1,3}\s?/, "").replace(/\D/g, "");
   return `${countryCode}${cleanPhone}`;
};

// Export individual items for convenience
export const {
   businessName,
   appName,
   countryCode,
   currency,
   deliveryOptions,
   paymentOptions,
   orderStatuses,
   validation,
   formats,
} = BUSINESS_CONFIG;
