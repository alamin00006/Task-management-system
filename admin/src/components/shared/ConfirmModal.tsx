"use client";

import { AlertTriangle, Loader2 } from "lucide-react";

import Modal from "./Modal";

// shadcn/ui imports
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "danger" | "warning" | "info";
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
  variant = "danger",
}: ConfirmModalProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          confirmButton:
            "bg-destructive text-destructive-foreground hover:bg-destructive/90",
          icon: <AlertTriangle className="h-5 w-5 text-destructive" />,
          iconBg: "bg-destructive/10",
        };
      case "warning":
        return {
          confirmButton: "bg-yellow-500 text-white hover:bg-yellow-600",
          icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
          iconBg: "bg-yellow-50",
        };
      case "info":
        return {
          confirmButton: "bg-blue-500 text-white hover:bg-blue-600",
          icon: <AlertTriangle className="h-5 w-5 text-blue-600" />,
          iconBg: "bg-blue-50",
        };
      default:
        return {
          confirmButton:
            "bg-destructive text-destructive-foreground hover:bg-destructive/90",
          icon: <AlertTriangle className="h-5 w-5 text-destructive" />,
          iconBg: "bg-destructive/10",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-5">
        {/* Alert Message */}
        <Alert
          variant={variant === "danger" ? "destructive" : "default"}
          className="border-0 bg-muted/50"
        >
          <div className="flex gap-3">
            <div className="flex-1">
              <AlertTitle className="text-sm font-semibold mb-1">
                Are you absolutely sure?
              </AlertTitle>
              <AlertDescription className="text-sm text-muted-foreground">
                {message}
              </AlertDescription>
            </div>
          </div>
        </Alert>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 ${styles.confirmButton}`}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
