import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Search, UserPlus, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import CreateAgentDialog from "@/features/agents/components/CreateAgentDialog";
import { useAgents } from "@/features/agents/hooks/useAgents";
import { searchAgent, linkToCompany } from "@/api/agents.api";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import type { Agent } from "@/types/models";

export default function AgentsPage() {
  const { isAdmin } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const debouncedEmail = useDebounce(searchEmail, 300);

  const { agents, isLoading } = useAgents();

  const { data: searchResult } = useQuery({
    queryKey: ["agentSearch", debouncedEmail],
    queryFn: () => searchAgent(debouncedEmail),
    enabled: debouncedEmail.length > 2,
  });

  const linkMutation = useMutation({
    mutationFn: (agentId: string) => linkToCompany(agentId),
    onSuccess: () => {
      toast.success("Agent linked to company");
      queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
    onError: () => toast.error("Failed to link agent"),
  });

  if (!isAdmin) return null;

  const displayAgents =
    debouncedEmail.length > 2 ? (searchResult ? [searchResult] : []) : agents;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Staff</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Agent
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by email"
          className="pl-10"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-lg border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">
                Name
              </th>
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">
                Email
              </th>
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">
                Company
              </th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                    <td className="px-6 py-4" />
                  </tr>
                ))
              : displayAgents.map((agent) => (
                  <AgentRow
                    key={agent.id}
                    agent={agent}
                    onLink={() => linkMutation.mutate(agent.id)}
                    isLinking={linkMutation.isPending}
                  />
                ))}
          </tbody>
        </table>

        {!isLoading && displayAgents.length === 0 && (
          <div className="px-6 py-8 text-center text-sm text-muted-foreground">
            {debouncedEmail.length > 2
              ? "No agent found with that email."
              : "No agents yet."}
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))
          : displayAgents.map((agent) => (
              <div
                key={agent.id}
                className="border rounded-lg p-4 bg-white space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm">
                      {agent.agentFirstName} {agent.agentLastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {agent.email}
                    </p>
                    {agent.companyName && (
                      <p className="text-xs text-muted-foreground">
                        {agent.companyName}
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => linkMutation.mutate(agent.id)}
                    disabled={linkMutation.isPending}
                  >
                    <Link className="w-3 h-3 mr-1" />
                    Link
                  </Button>
                </div>
              </div>
            ))}

        {!isLoading && displayAgents.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            {debouncedEmail.length > 2
              ? "No agent found with that email."
              : "No agents yet."}
          </p>
        )}
      </div>

      <CreateAgentDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

function AgentRow({
  agent,
  onLink,
  isLinking,
}: {
  agent: Agent;
  onLink: () => void;
  isLinking: boolean;
}) {
  return (
    <tr className="border-b hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4 font-medium">
        {agent.agentFirstName} {agent.agentLastName}
      </td>
      <td className="px-6 py-4 text-muted-foreground">{agent.email}</td>
      <td className="px-6 py-4">
        {agent.companyName ? (
          <Badge variant="secondary">{agent.companyName}</Badge>
        ) : (
          <span className="text-muted-foreground text-xs">Not linked</span>
        )}
      </td>
      <td className="px-6 py-4 text-right">
        <Button
          size="sm"
          variant="outline"
          onClick={onLink}
          disabled={isLinking}
        >
          <Link className="w-3 h-3 mr-2" />
          Link to Company
        </Button>
      </td>
    </tr>
  );
}
