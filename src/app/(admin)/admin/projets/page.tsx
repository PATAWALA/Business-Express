// src/app/(admin)/admin/projets/page.tsx
import { ProjectsClient } from "@/components/admin/projects/ProjectsClient";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ProjectRequest } from "@/components/admin/projects/ProjectCard";

export const dynamic = "force-dynamic";

export default async function ProjetsPage() {
  const supabase = createAdminClient();
  const { data: projects } = await supabase
    .from("project_requests")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <ProjectsClient
      projects={(projects as ProjectRequest[] | null) ?? []}
    />
  );
}