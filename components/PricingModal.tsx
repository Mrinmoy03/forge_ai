"use client";

import { PricingTable } from "@clerk/nextjs";
import { BlueTitle } from "./reusables";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PricingModalProps {
  children: React.ReactNode;
  reason?: "credits" | "upgrade";
}

const pricingTableAppearance = {
  elements: {
    pricingTableRoot: "!bg-transparent !p-0",
    pricingTableCardContainer: "!grid !grid-cols-3 !gap-4 !w-full",
    pricingTableCard:
      "!bg-[#111111] !border !border-white/10 !rounded-2xl !text-white !shadow-none",
    pricingTableCardTitle: "!text-white !font-semibold",
    pricingTableCardDescription: "!text-white/40 !text-xs",
    pricingTableCardPrice: "!text-white",
    pricingTableCardFeatureListItem: "!text-white/55 !text-xs",
    pricingTableCardSubscribeButton: "!rounded-full !font-semibold !text-sm",
    pricingTableCardActionButton: "!rounded-full !font-semibold !text-sm",
    pricingTableCardFrequency: "!text-white/30",
    pricingTableCardFeatureListItemCheckmark: "!text-blue-400",
    pricingTableCardHighlightBadge:
      "!bg-blue-500/10 !text-blue-400 !border-blue-500/20 !rounded-full",
  },
};

export function PricingModal({
  children,
  reason = "upgrade",
}: PricingModalProps) {
  const title =
    reason === "credits" ? "You're out of credits" : "Upgrade your plan";
  const description =
    reason === "credits"
      ? "You've used all your credits. Upgrade to keep building."
      : "Choose a plan that fits how much you build.";

  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer">{children}</DialogTrigger>
      <DialogContent
        className="border-white/10 bg-[#0a0a0a] p-3 text-white sm:max-w-7xl w-[95vw] max-h-[85dvh] overflow-hidden rounded-2xl flex flex-col"
      >
        {/* Header */}
        <div className="px-7 pt-7 pb-4 border-b border-white/6 shrink-0 pr-14">
          <BlueTitle className="text-3xl font-serif">{title}</BlueTitle>
          <p className="mt-1.5 text-sm text-white/35">{description}</p>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-7 py-6">
          <PricingTable appearance={pricingTableAppearance} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
