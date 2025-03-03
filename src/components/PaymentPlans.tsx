import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Zap, Image as ImageIcon, Crown } from "lucide-react";

interface PaymentPlansProps {
  onPurchase: (plan: string, credits: number) => void;
  theme?: "light" | "dark" | "evening" | "luxury" | "neon";
}

const PaymentPlans = ({ onPurchase, theme = "dark" }: PaymentPlansProps) => {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    name: string;
    price: number;
    credits: number;
  } | null>(null);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    email: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayOrderId, setRazorpayOrderId] = useState("");

  const plans = [
    {
      name: "Free",
      price: 0,
      credits: 30,
      features: [
        "30 AI generated images",
        "Basic resolution",
        "Standard styles",
      ],
      popular: false,
    },
    {
      name: "Basic",
      price: 59,
      credits: 100,
      features: [
        "100 AI generated images",
        "HD resolution",
        "All styles",
        "Priority generation",
      ],
      popular: true,
    },
    {
      name: "Standard",
      price: 199,
      credits: 175,
      features: [
        "175 AI generated images",
        "HD resolution",
        "All styles",
        "Priority generation",
        "Background removal",
      ],
      popular: false,
    },
    {
      name: "Premium",
      price: 299,
      credits: 250,
      features: [
        "250 AI generated images",
        "Ultra HD resolution",
        "All styles",
        "Priority generation",
        "Background removal",
        "Advanced editing tools",
      ],
      popular: false,
    },
  ];

  const handleSelectPlan = (plan: (typeof plans)[0]) => {
    if (plan.price === 0) {
      // Free plan doesn't need payment
      onPurchase(plan.name, plan.credits);
      return;
    }

    setSelectedPlan(plan);
    setShowPaymentDialog(true);
    // In a real implementation, you would create a Razorpay order here
    createRazorpayOrder(plan.price);
  };

  const createRazorpayOrder = async (amount: number) => {
    // Simulate API call to create Razorpay order
    // In a real implementation, this would be a call to your backend
    setIsProcessing(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock order ID
      const orderId = "order_" + Math.random().toString(36).substring(2, 15);
      setRazorpayOrderId(orderId);
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = () => {
    if (!selectedPlan) return;

    setIsProcessing(true);

    // Simulate Razorpay payment flow
    setTimeout(() => {
      // In a real implementation, you would open the Razorpay payment modal here
      const options = {
        key: "rzp_test_YourRazorpayKeyHere", // Replace with your actual Razorpay key
        amount: selectedPlan.price * 100, // Razorpay expects amount in paise
        currency: "INR",
        name: "AI Image Generator",
        description: `${selectedPlan.name} Plan - ${selectedPlan.credits} Credits`,
        order_id: razorpayOrderId,
        handler: function (response: any) {
          // Handle successful payment
          console.log("Payment successful:", response);
          onPurchase(selectedPlan.name, selectedPlan.credits);
          setShowPaymentDialog(false);
          setIsProcessing(false);

          // Show success message
          alert(
            `Payment successful! You've purchased the ${selectedPlan.name} plan with ${selectedPlan.credits} credits.`,
          );
        },
        prefill: {
          email: paymentDetails.email,
          contact: "", // User's phone number could be collected
        },
        theme: {
          color: "#3399cc",
        },
      };

      // In a real implementation, you would initialize Razorpay here
      // const razorpayInstance = new window.Razorpay(options);
      // razorpayInstance.open();

      // For demo purposes, we'll just simulate a successful payment
      setTimeout(() => {
        onPurchase(selectedPlan.name, selectedPlan.credits);
        setShowPaymentDialog(false);
        setIsProcessing(false);
        alert(
          `Payment successful! You've purchased the ${selectedPlan.name} plan with ${selectedPlan.credits} credits.`,
        );
      }, 2000);
    }, 1000);
  };

  const getBackgroundColor = () => {
    switch (theme) {
      case "dark":
        return "bg-gray-900 border-gray-800";
      case "evening":
        return "bg-indigo-900/90 backdrop-blur-sm border-indigo-800";
      case "luxury":
        return "bg-gradient-to-br from-gray-900 to-gray-800 border-amber-700";
      case "neon":
        return "bg-black border-pink-600";
      default:
        return "bg-white border-gray-200";
    }
  };

  const getTextColor = () => {
    switch (theme) {
      case "dark":
      case "evening":
      case "luxury":
      case "neon":
        return "text-white";
      default:
        return "text-gray-900";
    }
  };

  const getCardBgColor = () => {
    switch (theme) {
      case "dark":
        return "bg-gray-800 border-gray-700";
      case "evening":
        return "bg-indigo-800/80 border-indigo-700";
      case "luxury":
        return "bg-gray-800 border-amber-600/50";
      case "neon":
        return "bg-gray-900 border-pink-500/50";
      default:
        return "bg-white border-gray-200";
    }
  };

  const getPopularBadgeColor = () => {
    switch (theme) {
      case "dark":
        return "bg-blue-600";
      case "evening":
        return "bg-indigo-600";
      case "luxury":
        return "bg-amber-600";
      case "neon":
        return "bg-pink-600";
      default:
        return "bg-blue-500";
    }
  };

  const getButtonColor = (isPopular: boolean) => {
    if (isPopular) {
      switch (theme) {
        case "dark":
          return "bg-blue-600 hover:bg-blue-700";
        case "evening":
          return "bg-indigo-600 hover:bg-indigo-700";
        case "luxury":
          return "bg-amber-600 hover:bg-amber-700";
        case "neon":
          return "bg-pink-600 hover:bg-pink-700";
        default:
          return "bg-blue-500 hover:bg-blue-600";
      }
    } else {
      return "bg-gray-700 hover:bg-gray-600";
    }
  };

  return (
    <div className={`w-full p-6 rounded-xl ${getBackgroundColor()} shadow-lg`}>
      <div className="text-center mb-8">
        <h2 className={`text-2xl font-bold mb-2 ${getTextColor()}`}>
          Choose Your Plan
        </h2>
        <p className="text-gray-400">
          Select the perfect plan for your AI image generation needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative overflow-hidden ${getCardBgColor()} ${plan.popular ? "border-2 border-blue-500 shadow-lg shadow-blue-500/20" : ""}`}
          >
            {plan.popular && (
              <div
                className={`absolute top-0 right-0 ${getPopularBadgeColor()} text-white px-3 py-1 text-xs font-semibold`}
              >
                Most Popular
              </div>
            )}
            <CardHeader>
              <CardTitle className={getTextColor()}>{plan.name}</CardTitle>
              <CardDescription className="text-gray-400">
                For {plan.name.toLowerCase()} users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className={`text-3xl font-bold ${getTextColor()}`}>
                  ₹{plan.price}
                </p>
                <p className="text-gray-400 text-sm">
                  {plan.price === 0 ? "Free forever" : "One-time payment"}
                </p>
              </div>

              <div className="flex items-center mb-4">
                <div className="mr-2 p-1 bg-blue-500 rounded-full">
                  <ImageIcon className="h-4 w-4 text-white" />
                </div>
                <p className={`${getTextColor()} font-medium`}>
                  {plan.credits} Images
                </p>
              </div>

              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-400 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className={`w-full ${getButtonColor(plan.popular)}`}
                onClick={() => handleSelectPlan(plan)}
              >
                {plan.price === 0 ? "Get Started" : "Buy Now"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Purchase</DialogTitle>
            <DialogDescription>
              {selectedPlan && (
                <span>
                  {selectedPlan.name} Plan - ₹{selectedPlan.price} for{" "}
                  {selectedPlan.credits} credits
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={paymentDetails.email}
                onChange={(e) =>
                  setPaymentDetails({
                    ...paymentDetails,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="4111 1111 1111 1111"
                value={paymentDetails.cardNumber}
                onChange={(e) =>
                  setPaymentDetails({
                    ...paymentDetails,
                    cardNumber: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={paymentDetails.expiryDate}
                  onChange={(e) =>
                    setPaymentDetails({
                      ...paymentDetails,
                      expiryDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={paymentDetails.cvv}
                  onChange={(e) =>
                    setPaymentDetails({
                      ...paymentDetails,
                      cvv: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="cardName">Name on Card</Label>
              <Input
                id="cardName"
                placeholder="John Doe"
                value={paymentDetails.cardName}
                onChange={(e) =>
                  setPaymentDetails({
                    ...paymentDetails,
                    cardName: e.target.value,
                  })
                }
              />
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your payment will be processed securely via Razorpay. We do not
                store your card details.
              </p>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setShowPaymentDialog(false)}
              className="mb-2 sm:mb-0"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>Pay ₹{selectedPlan?.price}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentPlans;
