

// currencyFormatter.js

export const formatNaira = (amount) => {
    if (isNaN(amount)) {
      return "₦0.00";
    }
  
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  