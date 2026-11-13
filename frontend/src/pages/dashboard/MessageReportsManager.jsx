import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { PageHeader } from "../../components";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

export async function loader() {
  try {
    const { data } = await customFetch.get("/moderation/message-reports", {
      params: { status: "pending" },
    });
    return { reports: data };
  } catch (error) {
    toast.error(error?.response?.data?.message || "Помилка завантаження");
    return { reports: [] };
  }
}

export default function MessageReportsManager() {
  const { reports: initial } = useLoaderData();
  const [reports, setReports] = useState(initial);

  const decide = async (id, decision) => {
    try {
      await customFetch.patch(`/moderation/message-reports/${id}`, {
        decision,
      });
      setReports((prev) => prev.filter((r) => r.id !== id));
      toast.success("Рішення збережено");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Помилка");
    }
  };

  return (
    <Box>
      <PageHeader
        title="Скарги на повідомлення"
        subtitle={`${reports.length} очікують розгляду`}
        breadcrumbs={[
          { label: "Панель", to: "/dashboard" },
          { label: "Скарги" },
        ]}
      />
      <Stack spacing={2}>
        {reports.length === 0 && (
          <Typography color="text.secondary">Скарг немає</Typography>
        )}
        {reports.map((r) => (
          <Paper key={r.id} sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography fontWeight={700}>Причина: {r.reason}</Typography>
            <Typography variant="caption" color="text.secondary">
              Від: {r.reporter?.firstName} {r.reporter?.lastName} ·{" "}
              {new Date(r.createdAt).toLocaleString("uk-UA")}
            </Typography>
            <Typography sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
              «{r.message?.body}»
            </Typography>
            {r.details && (
              <Typography variant="body2" color="text.secondary" mt={1}>
                Деталі: {r.details}
              </Typography>
            )}
            <Stack direction="row" gap={1.5} mt={2}>
              <Button
                variant="contained"
                color="error"
                onClick={() => decide(r.id, "resolved")}
              >
                Визнати порушенням
              </Button>
              <Button
                variant="outlined"
                onClick={() => decide(r.id, "dismissed")}
              >
                Відхилити скаргу
              </Button>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
