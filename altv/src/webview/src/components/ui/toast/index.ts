import { cva, type VariantProps } from "class-variance-authority";
import type { ToastRootProps } from "radix-vue";
import type { HTMLAttributes } from "vue";
export { default as Toast } from "./Toast.vue";
export { default as ToastAction } from "./ToastAction.vue";
export { default as ToastClose } from "./ToastClose.vue";
export { default as ToastDescription } from "./ToastDescription.vue";
export { default as Toaster } from "./Toaster.vue";
export { default as ToastProvider } from "./ToastProvider.vue";
export { default as ToastTitle } from "./ToastTitle.vue";
export { default as ToastViewport } from "./ToastViewport.vue";
export { toast, useToast } from "./use-toast";

export const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-(--radix-toast-swipe-end-x) data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x) data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full sm:data-[state=open]:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
        info: "border-blue-200 bg-blue-100 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200",
        warning:
          "border-yellow-200 bg-yellow-100 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
        success:
          "border-green-200 bg-green-100 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type ToastVariants = VariantProps<typeof toastVariants>;

export interface ToastProps extends ToastRootProps {
  class?: HTMLAttributes["class"];
  variant?: ToastVariants["variant"];
  onOpenChange?: ((value: boolean) => void) | undefined;
}
