import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function useEditFlight() {
  const router = useRouter();

  async function handleUpdate({
    id,
    form,
    validate,
    onClose,
    setLoading,
  }: any) {
    const errors = validate();

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`/api/flights/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message);

        return;
      }

      toast.success("Flight updated successfully");

      // tutup modal
      onClose();

      window.location.reload();

      // refresh page
      router.refresh();
    } catch (error) {
      console.error(error);

      toast.error("Failed update flight");
    } finally {
      setLoading(false);
    }
  }

  return {
    handleUpdate,
  };
}
