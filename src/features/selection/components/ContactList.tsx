import { useQuery } from "@tanstack/react-query";
import { Mail, Phone, Building2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getContacts } from "@/api/selection.api";

interface ContactListProps {
  listingId: number;
}

export default function ContactList({ listingId }: ContactListProps) {
  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["contacts", listingId],
    queryFn: () => getContacts(listingId),
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No contacts added yet.</p>
    );
  }

  return (
    <div className="space-y-3">
      {contacts.map((contact) => (
        <div
          key={contact.contactId}
          className="border rounded-lg p-4 space-y-2"
        >
          <p className="font-medium text-sm">
            {contact.firstName} {contact.lastName}
          </p>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="w-3 h-3" />
              {contact.email}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="w-3 h-3" />
              {contact.phoneNumber}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Building2 className="w-3 h-3" />
              {contact.companyName}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
