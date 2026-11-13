import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";

// Чекбокси надсилаються через звичайну форму (FormData).
// Hidden-поле contactSettingsSent каже серверу, що стан зв'язку треба застосувати.
export default function ContactSettingsFields({ value }) {
  const v = {
    contactByEmail: true,
    contactByChat: true,
    showEmail: false,
    showPhone: false,
    ...value,
  };

  return (
    <Box>
      <input type="hidden" name="contactSettingsSent" value="1" />
      <Typography fontWeight={700} mb={1}>
        Зв'язок з вами
      </Typography>
      <FormControlLabel
        control={
          <Checkbox name="contactByChat" defaultChecked={v.contactByChat} />
        }
        label="Внутрішній чат платформи"
      />
      <FormControlLabel
        control={
          <Checkbox name="contactByEmail" defaultChecked={v.contactByEmail} />
        }
        label="Листування через email"
      />
      <FormControlLabel
        control={<Checkbox name="showEmail" defaultChecked={v.showEmail} />}
        label="Показувати мій email в оголошенні"
      />
      <FormControlLabel
        control={<Checkbox name="showPhone" defaultChecked={v.showPhone} />}
        label="Показувати мій телефон в оголошенні"
      />
      <Typography variant="caption" color="text.secondary">
        Принаймні один спосіб зв'язку має бути увімкнений.
      </Typography>
    </Box>
  );
}
