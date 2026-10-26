/**
 * Accordion, from Watermelon UI (MIT, https://registry.watermelon.sh/r/accordion.json),
 * which is the shadcn/ui accordion on Radix UI Accordion (MIT). Radix handles the
 * keyboard (arrows, Home, End), aria-expanded and the height animation.
 * Restyled for hack::peel: ruled rows, and a DIP switch with an LED in place of the plus icon.
 */
import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";

function Accordion({ ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-t border-line last:border-b", className)}
      {...props}
    />
  );
}

function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          // -mx-3/px-3: the text stays on the page grid while the focus ring gets room around it
          "group -mx-3 flex flex-1 items-center justify-between gap-6 px-3 py-5 text-left text-[1.125rem] font-semibold text-foreground transition-colors hover:text-primary disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
        {/* a DIP switch: the knob slides to ON and its LED lights when the answer is open */}
        <span aria-hidden="true" className="dip">
          <span className="dip-knob" />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden motion-safe:data-[state=closed]:animate-accordion-up motion-safe:data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn("pb-6 pr-10 pt-1", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
