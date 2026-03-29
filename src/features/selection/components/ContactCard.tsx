import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { CaseContact } from "@/types/models";

interface ContactCardProps {
  contact: CaseContact;
  readOnly?: boolean;
  onDelete?: () => void;
}

export default function ContactCard({
  contact,
  readOnly = false,
  onDelete,
}: ContactCardProps) {
  return (
    <div className="flex items-center gap-4 bg-slate-50 rounded-xl px-4 py-3 w-full">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center shrink-0 text-sm font-semibold text-slate-600">
        {contact.firstName?.[0]}
        {contact.lastName?.[0]}
      </div>

      {/* Name + company */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {contact.firstName} {contact.lastName}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {contact.companyName}
        </p>
      </div>

      {/* Phone + email */}
      <div className="text-right shrink-0 hidden md:block">
        <p className="text-sm font-medium">{contact.phoneNumber}</p>
        <p className="text-xs text-muted-foreground">{contact.email}</p>
      </div>

      {/* Actions — hidden in readOnly mode */}
      {!readOnly && (
        <div className="flex items-center gap-2 shrink-0">
          <button className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors">
            <Pencil className="w-3.5 h-3.5 text-blue-500" />
          </button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors">
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete agent information</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this agent?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}
