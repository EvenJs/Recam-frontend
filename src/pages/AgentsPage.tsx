import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserPlus, Pencil, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CreateAgentDialog from "@/features/agents/components/CreateAgentDialog";
import { useAgents } from "@/features/agents/hooks/useAgents";
import { linkToCompany } from "@/api/agents.api";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import type { Agent } from "@/types/models";

const roleColors: Record<string, string> = {
  Photographer: "bg-blue-100 text-blue-700",
  Videographer: "bg-purple-100 text-purple-700",
  VRCreator: "bg-teal-100 text-teal-700",
};

export default function AgentsPage() {
  const { isAdmin, user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  const { agents, isLoading } = useAgents();

  const linkMutation = useMutation({
    mutationFn: (agentId: string) => linkToCompany(agentId),
    onSuccess: () => {
      toast.success("Agent linked to company");
      queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
    onError: () => toast.error("Failed to link agent"),
  });

  if (!isAdmin) return null;

  const filters = ["All", "Photographer", "Videographer", "VRCreator"];

  const filtered =
    activeFilter === "All"
      ? agents
      : agents.filter((a) => a.roles?.includes(activeFilter));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-center md:text-left">
            Hi, Welcome {user?.email?.split("@")[0]}!
          </h1>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-[#1DA1F2] hover:bg-[#1a91da] rounded-full px-6"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add new staff
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === filter
                ? "bg-[#1DA1F2] text-white"
                : "bg-slate-100 text-muted-foreground hover:bg-slate-200"
            }`}
          >
            {filter === "VRCreator" ? "VR Creator" : filter}
          </button>
        ))}
      </div>

      {/* Card grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-52 w-full rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">
          No staff found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onLink={() => linkMutation.mutate(agent.id)}
              isLinking={linkMutation.isPending}
            />
          ))}
        </div>
      )}

      <CreateAgentDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

function AgentCard({
  agent,
  onLink,
  isLinking,
}: {
  agent: Agent;
  onLink: () => void;
  isLinking: boolean;
}) {
  return (
    <div className="relative bg-white border rounded-xl p-4 space-y-3 hover:shadow-md transition-shadow">
      {/* Edit button */}
      <button className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
        <Pencil className="w-4 h-4" />
      </button>

      {/* Avatar */}
      <div className="flex flex-col items-center text-center space-y-2">
        {agent.avatarUrl ? (
          <img
            src={agent.avatarUrl}
            alt={`${agent.agentFirstName} ${agent.agentLastName}`}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-lg font-semibold text-slate-500">
            {agent.agentFirstName?.[0]}
            {agent.agentLastName?.[0]}
          </div>
        )}

        {/* Name */}
        <p className="font-semibold text-sm">
          {agent.agentFirstName} {agent.agentLastName}
        </p>

        {/* Role tags */}
        {agent.roles && agent.roles.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1">
            {agent.roles.map((role) => (
              <span
                key={role}
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  roleColors[role] ?? "bg-slate-100 text-slate-600"
                }`}
              >
                {role === "VRCreator" ? "VR Creator" : role}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Contact info */}
      <div className="space-y-1">
        {agent.email && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Mail className="w-3 h-3 shrink-0" />
            <span className="truncate">{agent.email}</span>
          </div>
        )}
        {agent.phoneNumber && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Phone className="w-3 h-3 shrink-0" />
            {agent.phoneNumber}
          </div>
        )}
      </div>

      {/* Availability button */}
      <Button
        size="sm"
        className="w-full bg-[#1DA1F2] hover:bg-[#1a91da] text-white rounded-full text-xs"
        onClick={onLink}
        disabled={isLinking}
      >
        Availability
      </Button>
    </div>
  );
}
