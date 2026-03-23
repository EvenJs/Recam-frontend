import { useState } from "react";
import { UserPlus, Trash2 } from "lucide-react";
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
}

export default function AgentContactsSection({
  listingId,
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
            />
          ))}
        </div>
      )}

      {/* Add button */}
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

      {/* Form modal */}
      {showForm && (
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
}: {
  contact: CaseContact;
  listingId: number;
}) {
  // Note: delete endpoint not in current API spec
  // Wire up when backend provides DELETE /listings/:id/contacts/:contactId
  const handleDelete = () => {
    toast.info("Delete contact coming soon");
    queryClient.invalidateQueries({ queryKey: ["contacts", listingId] });
  };

  return (
    <div className="relative border rounded-xl p-6 text-center space-y-2 min-w-48 max-w-56">
      {/* Delete button */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Avatar placeholder */}
      <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center mx-auto text-lg font-semibold text-slate-500">
        {contact.firstName?.[0]}
        {contact.lastName?.[0]}
      </div>

      <p className="font-semibold text-sm">
        {contact.firstName} {contact.lastName}
      </p>
      <p className="text-xs text-muted-foreground">{contact.companyName}</p>
      <p className="text-xs text-muted-foreground">{contact.email}</p>
      <p className="text-xs text-muted-foreground">{contact.phoneNumber}</p>
    </div>
  );
}
