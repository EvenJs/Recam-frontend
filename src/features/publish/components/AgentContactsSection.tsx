import { useState } from "react";
import { UserPlus, Trash2, Pencil } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
import AgentContactForm from "./AgentContactForm";
import { getContacts } from "@/api/selection.api";
import { queryClient } from "@/lib/queryClient";
import type { CaseContact } from "@/types/models";

interface AgentContactsSectionProps {
  listingId: number;
  readOnly?: boolean;
}

export default function AgentContactsSection({
  listingId,
  readOnly = false,
}: AgentContactsSectionProps) {
  const [showForm, setShowForm] = useState(false);

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["contacts", listingId],
    queryFn: () => getContacts(listingId),
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Contact cards */}
      {contacts.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No agent contacts added yet.
        </p>
      ) : (
        <div className="flex flex-wrap justify-center gap-4">
          {contacts.map((contact) => (
            <ContactCard
              key={contact.contactId}
              contact={contact}
              listingId={listingId}
              readOnly={readOnly}
            />
          ))}
        </div>
      )}

      {/* Add button */}
      {!readOnly && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(true)}
            className="rounded-full"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Create a new agent
          </Button>
        </div>
      )}

      {/* Form modal */}
      {showForm && !readOnly && (
        <AgentContactForm
          listingId={listingId}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

function ContactCard({
  contact,
  listingId,
  readOnly,
}: {
  contact: CaseContact;
  listingId: number;
  readOnly?: boolean;
}) {
  const handleDelete = () => {
    toast.info("Delete contact coming soon");
    queryClient.invalidateQueries({ queryKey: ["contacts", listingId] });
  };

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
          {/* Edit button */}
          <button className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors">
            <Pencil className="w-3.5 h-3.5 text-blue-500" />
          </button>

          {/* Delete button */}
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
                  onClick={handleDelete}
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
