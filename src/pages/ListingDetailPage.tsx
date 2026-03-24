import { useState, lazy, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Trash2, UserPlus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import StatusBadge from "@/features/listings/components/StatusBadge";
import {
  getListing,
  deleteListing,
  updateStatus,
  assignAgent,
} from "@/api/listing.api";
import { searchAgent } from "@/api/agents.api";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import {
  listcaseStatusLabel,
  propertyTypeLabel,
  saleCategoryLabel,
} from "@/utils/enumMaps";
import type { ListcaseStatus } from "@/types/enums";
import type { Agent } from "@/types/models";

const MediaTab = lazy(() => import("@/features/media/components/MediaGallery"));
const SelectionTab = lazy(
  () => import("@/features/selection/components/SelectionGrid"),
);
const ContactsTab = lazy(
  () => import("@/features/selection/components/ContactList"),
);
const ContactForm = lazy(
  () => import("@/features/selection/components/ContactForm"),
);
const nextStatusMap: Record<number, number> = { 1: 2, 2: 3, 3: 4 };

const formatPrice = (price: number) =>
  Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(
    price,
  );

export default function ListingDetailPage() {
  const { id } = useParams();
  const listingId = Number(id);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  // Assign agent modal state
  const [agentDialogOpen, setAgentDialogOpen] = useState(false);
  const [agentEmail, setAgentEmail] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const debouncedEmail = useDebounce(agentEmail, 300);

  const {
    data: listing,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["listing", listingId],
    queryFn: () => getListing(listingId),
  });

  const { data: foundAgents = [] } = useQuery({
    queryKey: ["agentSearch", debouncedEmail],
    queryFn: () => searchAgent(debouncedEmail),
    enabled: debouncedEmail.length > 3,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteListing(listingId),
    onSuccess: () => {
      toast.success("Listing deleted");
      navigate("/dashboard");
    },
    onError: () => toast.error("Failed to delete listing"),
  });

  const statusMutation = useMutation({
    mutationFn: (status: ListcaseStatus) => updateStatus(listingId, status),
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries({ queryKey: ["listing", listingId] });
    },
    onError: () => toast.error("Failed to update status"),
  });

  const assignMutation = useMutation({
    mutationFn: (agentId: string) => assignAgent(listingId, agentId),
    onSuccess: () => {
      toast.success("Agent assigned");
      setAgentDialogOpen(false);
      setAgentEmail("");
      queryClient.invalidateQueries({ queryKey: ["listing", listingId] });
    },
    onError: () => toast.error("Failed to assign agent"),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !listing) {
    toast.error("Listing not found");
    navigate("/dashboard");
    return null;
  }

  const nextStatus = nextStatusMap[listing.listcaseStatus] as
    | ListcaseStatus
    | undefined;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-semibold">{listing.title}</h1>
            <StatusBadge status={listing.listcaseStatus} />
          </div>
          <p className="text-sm text-muted-foreground">
            {listing.street}, {listing.city} {listing.state} {listing.postcode}
          </p>
          <p className="text-lg font-semibold">{formatPrice(listing.price)}</p>
        </div>

        {/* Admin actions */}
        {isAdmin && (
          <div className="flex flex-wrap gap-2">
            {/* Edit */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/listings/${listingId}/edit`)}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>

            {/* Assign Agent */}
            <Dialog open={agentDialogOpen} onOpenChange={setAgentDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Assign Agent
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm rounded-2xl p-6">
                <DialogHeader>
                  <DialogTitle className="text-base font-semibold">
                    Assign Agent
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-3 pt-2">
                  <Input
                    placeholder="Search by email"
                    value={agentEmail}
                    onChange={(e) => setAgentEmail(e.target.value)}
                    className="rounded-lg"
                  />

                  {/* Result area — only show when debounced email is long enough */}

                  {debouncedEmail.length > 3 &&
                    (foundAgents.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        No agent found
                      </p>
                    ) : (
                      foundAgents.map((agent) => (
                        <div
                          key={agent.id}
                          onClick={() => setSelectedAgent(agent)}
                          className={`p-3 border rounded-lg text-sm cursor-pointer transition-colors ${
                            selectedAgent?.id === agent.id
                              ? "border-primary bg-primary/5"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          <p className="font-medium">
                            {agent.agentFirstName} {agent.agentLastName}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {agent.email}
                          </p>
                        </div>
                      ))
                    ))}

                  <Button
                    className="w-full rounded-lg"
                    disabled={!selectedAgent || assignMutation.isPending}
                    onClick={() =>
                      selectedAgent && assignMutation.mutate(selectedAgent.id)
                    }
                  >
                    {assignMutation.isPending
                      ? "Assigning..."
                      : "Confirm Assignment"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Update Status */}
            {nextStatus && (
              <Button
                size="sm"
                onClick={() => statusMutation.mutate(nextStatus)}
                disabled={statusMutation.isPending}
              >
                <ChevronRight className="w-4 h-4 mr-2" />
                Mark as {listcaseStatusLabel[nextStatus]}
              </Button>
            )}

            {/* Delete */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete listing?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteMutation.mutate()}
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

      {/* Details grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Bedrooms", value: listing.bedrooms },
          { label: "Bathrooms", value: listing.bathrooms },
          { label: "Garages", value: listing.garages },
          { label: "Floor Area", value: `${listing.floorArea} m²` },
          {
            label: "Property Type",
            value: propertyTypeLabel[listing.propertyType],
          },
          {
            label: "Sale Category",
            value: saleCategoryLabel[listing.saleCategory],
          },
        ].map(({ label, value }) => (
          <div key={label} className="p-4 border rounded-lg bg-card">
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className="font-medium">{value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="media">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="selection">Selection</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="media" className="mt-6">
          <Suspense fallback={<Skeleton className="h-48 w-full" />}>
            <MediaTab listingId={listingId} />
          </Suspense>
        </TabsContent>

        <TabsContent value="selection" className="mt-6">
          <Suspense fallback={<Skeleton className="h-48 w-full" />}>
            <SelectionTab listingId={listingId} />
          </Suspense>
        </TabsContent>

        <TabsContent value="contacts" className="mt-6">
          <Suspense fallback={<Skeleton className="h-48 w-full" />}>
            <div className="space-y-6">
              <ContactsTab listingId={listingId} />
              <ContactForm listingId={listingId} />
            </div>
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
