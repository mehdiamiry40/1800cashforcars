import type { Metadata } from "next";
import { AskForPrice } from "@/components/Blocks";

export const metadata: Metadata = {
  title: "Get a Free Cash Offer For Your Car",
  description:
    "Tell us about your car and get a free, no-obligation cash offer. Free removal and paid on pickup.",
  alternates: { canonical: "/quote" },
};

export default function QuotePage() {
  return (
    <>
      <div className="container-site pb-6 pt-10">
        <h1 className="h-section">Get a free car quote</h1>
        <p className="mt-3">
          Your car’s next chapter starts here. Fill in the details below and
          we’ll be in touch.
        </p>
      </div>
      <AskForPrice />
    </>
  );
}
