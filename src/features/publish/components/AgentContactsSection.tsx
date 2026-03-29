import { useState } from "react";
import { UserPlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import AgentContactForm from "./AgentContactForm";

import { getContacts } from "@/api/selection.api";
import { queryClient } from "@/lib/queryClient";
import ContactCard from "@/features/selection/components/ContactCard";

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

  const handleDelete = () => {
    toast.info("Delete contact coming soon");
    queryClient.invalidateQueries({ queryKey: ["contacts", listingId] });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {contacts.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No agent contacts added yet.
        </p>
      ) : (
        <div className="space-y-2">
          {contacts.map((contact) => (
            <ContactCard
              key={contact.contactId}
              contact={contact}
              readOnly={readOnly}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {!readOnly && (
        <div className="flex justify-center pt-2">
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

      {showForm && !readOnly && (
        <AgentContactForm
          listingId={listingId}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
