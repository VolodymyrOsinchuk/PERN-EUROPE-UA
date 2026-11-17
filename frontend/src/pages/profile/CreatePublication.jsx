import { useAuthContext } from "../../context/AuthContext";
import PublicationForm from "../../components/publications/PublicationForm";

export default function CreatePublication() {
  const { user } = useAuthContext();

  const isStaff = ["admin", "moderator"].includes(user?.role);

  return (
    <PublicationForm
      mode="create"
      returnTo="/profile"
      isStaff={isStaff}
    />
  );
}