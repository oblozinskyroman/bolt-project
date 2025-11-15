import { supabase } from "./supabase";

export async function saveWebProject(data: any) {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  if (!user) throw new Error("Not logged in");

  const { error } = await supabase
    .from("web_projects")
    .insert({
      user_id: user.id,
      project_name: data.projectName,
      website_url: data.websiteUrl,
      contact_name: data.contactName,
      contact_email: data.contactEmail,
      business_type: data.businessType,
      ai_tasks: data.aiTasks,
      notes: data.notes,
    });

  if (error) throw error;
}
