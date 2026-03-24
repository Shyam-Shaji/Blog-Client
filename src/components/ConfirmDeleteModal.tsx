import { Button } from "./ui/button";
import { AlertCircle } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Blog",
  description = "Are you sure you want to delete this blog? This action cannot be undo.",
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl max-w-sm w-full p-6 text-center space-y-4 shadow-xl">
        <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6 text-destructive" />
        </div>
        
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <p className="text-foreground/70 text-sm">
          {description}
        </p>

        <div className="flex gap-3 pt-4 mt-6 border-t border-border">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            variant="destructive"
            className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
