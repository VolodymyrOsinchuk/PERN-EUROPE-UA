// frontend/src/pages/profile/EditPublication.jsx
import { useLoaderData } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../../utils/customFetch";
import { useAuthContext } from "../../context/AuthContext";
import PublicationForm from "../../components/publications/PublicationForm";

export async function loader({ params }) {
  try {
    const { data } = await customFetch.get(`/publications/${params.id}`);
    return { publication: data };
  } catch (error) {
    toast.error(error?.response?.data?.message || "Публікацію не знайдено");
    throw new Response("Not found", { status: 404 });
  }
}

export default function EditPublication() {
  const { publication } = useLoaderData();
  const { user } = useAuthContext();
  const isStaff = ["admin", "moderator"].includes(user?.role);
  return (
    <PublicationForm
      mode="edit"
      publication={publication}
      returnTo="/profile"
      isStaff={isStaff}
    />
  );
}
