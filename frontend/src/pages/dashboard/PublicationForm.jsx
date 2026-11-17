import PublicationForm from "../../components/publications/PublicationForm";

export default function DashboardPublicationForm() {
  return (
    <PublicationForm
      mode="create"
      returnTo="/dashboard/posts"
      isStaff
    />
  );
}