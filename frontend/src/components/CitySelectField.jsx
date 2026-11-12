// frontend/src/components/CitySelectField.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  Button,
  InputAdornment,
  Tooltip,
  IconButton,
} from "@mui/material";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import EditLocationAltOutlinedIcon from "@mui/icons-material/EditLocationAltOutlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ClearIcon from "@mui/icons-material/Clear";
import {
  getCitiesByCountry,
  normalizeCountry,
} from "../data/europeanLocations";

const fontBody = "'Plus Jakarta Sans', sans-serif";
const BLUE = "#0057B8";

/**
 * CitySelectField - Динамічний селектор міст з підтримкою Autocomplete,
 * пошуку українською та латиницею, а також можливістю ручного введення
 * текстового поля, якщо потрібного міста немає в базі.
 */
export default function CitySelectField({
  country = "",
  value = "",
  onChange,
  name = "city",
  label = "Місто / Регіон (опційно)",
  placeholder = "Оберіть місто або введіть назву...",
  required = false,
  fullWidth = true,
  size = "medium",
  isFilter = false,
  disabled = false,
  sx = {},
  helperText,
}) {
  // Список міст для поточної обраної країни
  const cities = useMemo(() => {
    return getCitiesByCountry(country);
  }, [country]);

  // Підготовка опцій для Autocomplete
  const options = useMemo(() => {
    return cities.map((c) => ({
      name: c.name,
      local: c.local || "",
      country: c.country || "",
      // Комбінований лейбл для красивого відображення та пошуку
      label: c.local && c.local !== c.name ? `${c.name} (${c.local})` : c.name,
    }));
  }, [cities]);

  // Чи знаходиться компонент у режимі ручного текстового поля
  const [isManualMode, setIsManualMode] = useState(false);

  // Внутрішнє значення введеного тексту для швидкого відгуку
  const [inputValue, setInputValue] = useState(value || "");

  // Синхронізація з зовнішнім value
  useEffect(() => {
    setInputValue(value || "");
    // Якщо поточне значення не пусте і його немає серед стандартних міст,
    // але це не фільтр — можна автоматично дозволити ручний режим або лишити текст
  }, [value]);

  // Знайти відповідний об'єкт опції за назвою міста (якщо є)
  const selectedOption = useMemo(() => {
    if (!value) return null;
    const norm = value.trim().toLowerCase();
    const found = options.find(
      (opt) =>
        opt.name.toLowerCase() === norm ||
        opt.local.toLowerCase() === norm ||
        opt.label.toLowerCase() === norm
    );
    if (found) return found;
    // Якщо це кастомне місто, створюємо псевдо-опцію для Autocomplete
    return { name: value, local: "", label: value };
  }, [value, options]);

  const handleSelectChange = (event, newValue) => {
    if (typeof newValue === "string") {
      onChange && onChange(newValue.trim());
      setInputValue(newValue.trim());
    } else if (newValue && newValue.name) {
      onChange && onChange(newValue.name);
      setInputValue(newValue.name);
    } else {
      onChange && onChange("");
      setInputValue("");
    }
  };

  const handleInputChange = (event, newInputValue, reason) => {
    setInputValue(newInputValue);
    if (isFilter) {
      if (reason === "clear") {
        onChange && onChange("");
      } else if (reason === "input") {
        onChange && onChange(newInputValue);
      }
    }
  };

  const handleTextChange = (e) => {
    const text = e.target.value;
    setInputValue(text);
    onChange && onChange(text);
  };

  const handleToggleManual = () => {
    setIsManualMode((prev) => !prev);
  };

  // Базові стилі для текстових полів
  const defaultInputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      fontFamily: fontBody,
      bgcolor: "#f8fafc",
      "&:hover fieldset": { borderColor: BLUE },
      "&.Mui-focused fieldset": { borderColor: BLUE },
      fontSize: size === "small" ? "0.875rem" : "0.95rem",
    },
    "& .MuiInputLabel-root": {
      fontFamily: fontBody,
      fontSize: size === "small" ? "0.85rem" : "0.9rem",
    },
    "& .MuiInputLabel-root.Mui-focused": { color: BLUE },
    ...sx,
  };

  return (
    <Box sx={{ width: fullWidth ? "100%" : "auto" }}>
      {/* ── РЕЖИМ 1: РУЧНЕ ТЕКСТОВЕ ПОЛЕ (якщо міста немає у списку) ── */}
      {isManualMode ? (
        <Box>
          <TextField
            name={name}
            label={label ? `${label} (вручну)` : "Місто (вручну)"}
            value={inputValue}
            onChange={handleTextChange}
            placeholder="Введіть назву вашого міста чи села..."
            fullWidth={fullWidth}
            size={size}
            required={required}
            disabled={disabled}
            helperText={helperText}
            sx={defaultInputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PlaceOutlinedIcon sx={{ fontSize: 18, color: "#e11d48" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Повернутися до списку міст" arrow>
                    <IconButton
                      size="small"
                      onClick={handleToggleManual}
                      sx={{ color: BLUE, p: 0.5 }}
                    >
                      <FormatListBulletedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {inputValue && (
                    <IconButton
                      size="small"
                      onClick={() => {
                        setInputValue("");
                        onChange && onChange("");
                      }}
                      sx={{ p: 0.5, color: "#94a3b8" }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
          {!isFilter && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 0.5,
                px: 0.5,
              }}
            >
              <Typography
                sx={{
                  fontFamily: fontBody,
                  fontSize: "0.72rem",
                  color: "#64748b",
                }}
              >
                Ви вводите власну назву міста вручну
              </Typography>
              <Button
                variant="text"
                size="small"
                onClick={handleToggleManual}
                sx={{
                  fontFamily: fontBody,
                  fontSize: "0.72rem",
                  textTransform: "none",
                  p: 0,
                  minWidth: "auto",
                  color: BLUE,
                  fontWeight: 600,
                  "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
                }}
              >
                Обрати зі списку
              </Button>
            </Box>
          )}
        </Box>
      ) : (
        /* ── РЕЖИМ 2: ДИНАМІЧНИЙ СЕЛЕКТОР (Autocomplete + freeSolo) ── */
        <Box>
          <Autocomplete
            freeSolo
            disabled={disabled}
            options={options}
            getOptionLabel={(option) => {
              if (typeof option === "string") return option;
              return option.name || option.label || "";
            }}
            filterOptions={(opts, { inputValue: searchVal }) => {
              const q = (searchVal || "").trim().toLowerCase();
              if (!q) return opts.slice(0, 30);
              return opts
                .filter(
                  (o) =>
                    o.name.toLowerCase().includes(q) ||
                    (o.local && o.local.toLowerCase().includes(q))
                )
                .slice(0, 30);
            }}
            value={selectedOption}
            onChange={handleSelectChange}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            renderInput={(params) => (
              <TextField
                {...params}
                name={name}
                label={label}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                size={size}
                fullWidth={fullWidth}
                helperText={helperText}
                sx={defaultInputSx}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        <PlaceOutlinedIcon sx={{ fontSize: 18, color: BLUE }} />
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => {
              const { key, ...otherProps } = props;
              return (
                <Box
                  component="li"
                  key={key || `${option.country || ""}-${option.name}-${option.local || ""}`}
                  {...otherProps}
                  sx={{
                    fontFamily: fontBody,
                    fontSize: "0.85rem",
                    py: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start !important",
                    borderBottom: "1px solid #f1f5f9",
                    "&:last-child": { borderBottom: "none" },
                    "&:hover": { bgcolor: "rgba(0,87,184,.06) !important" },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: fontBody,
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "#1e293b",
                    }}
                  >
                    {option.name}
                  </Typography>
                  {option.local && option.local !== option.name && (
                    <Typography
                      sx={{
                        fontFamily: fontBody,
                        fontSize: "0.72rem",
                        color: "#64748b",
                      }}
                    >
                      місцева назва: {option.local}
                      {option.country ? ` • ${option.country}` : ""}
                    </Typography>
                  )}
                </Box>
              );
            }}
            noOptionsText={
              <Box sx={{ p: 1, textAlign: "center" }}>
                <Typography
                  sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: "#64748b" }}
                >
                  Місто не знайдено в каталозі.
                </Typography>
                <Button
                  size="small"
                  onClick={handleToggleManual}
                  sx={{
                    mt: 0.5,
                    fontFamily: fontBody,
                    fontSize: "0.75rem",
                    textTransform: "none",
                    fontWeight: 600,
                    color: BLUE,
                  }}
                >
                  Ввести назву вручну
                </Button>
              </Box>
            }
          />

          {/* Перемикач на ручне введення, якщо міста немає */}
          {!isFilter && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 0.5,
                px: 0.5,
              }}
            >
              <Typography
                sx={{
                  fontFamily: fontBody,
                  fontSize: "0.72rem",
                  color: "#94a3b8",
                }}
              >
                {country
                  ? `Міста для: ${normalizeCountry(country)}`
                  : "Оберіть країну для точнішого списку"}
              </Typography>

              <Button
                variant="text"
                size="small"
                onClick={handleToggleManual}
                startIcon={<EditLocationAltOutlinedIcon sx={{ fontSize: 13 }} />}
                sx={{
                  fontFamily: fontBody,
                  fontSize: "0.72rem",
                  textTransform: "none",
                  p: 0,
                  minWidth: "auto",
                  color: "#64748b",
                  "&:hover": {
                    bgcolor: "transparent",
                    color: BLUE,
                    textDecoration: "underline",
                  },
                }}
              >
                Немає у списку? Ввести вручну
              </Button>
            </Box>
          )}
        </Box>
      )}

      {/* Приховане поле гарантує, що при стандартній відправці форми значення завжди буде передано */}
      <input type="hidden" name={name} value={value || inputValue || ""} />
    </Box>
  );
}
