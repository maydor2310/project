import React, { useMemo, useState } from "react"; // comment: react + hooks
import { Box, Button, TextField, Typography, Stack } from "@mui/material"; // comment: MUI components

export type UserRow = { // comment: type for one row saved in storage
  id: string; // comment: unique id
  fullName: string; // comment: user full name
  email: string; // comment: user email
  phone: string; // comment: user phone
  age: string; // comment: age as string for input handling
  city: string; // comment: user city
  createdAt: number; // comment: creation timestamp
}; // comment: end type

export const STORAGE_KEY = "forms_users_v1"; // comment: local storage key (exported)

type FormState = Omit<UserRow, "id" | "createdAt">; // comment: form fields only
type ErrorsState = Partial<Record<keyof FormState, string>>; // comment: map field->error message

const createEmptyForm = (): FormState => ({ // comment: helper to create initial form
  fullName: "", // comment: empty name
  email: "", // comment: empty email
  phone: "", // comment: empty phone
  age: "", // comment: empty age
  city: "", // comment: empty city
}); // comment: end helper

const loadRows = (): UserRow[] => { // comment: load rows from local storage
  try { // comment: protect from JSON errors
    const raw = localStorage.getItem(STORAGE_KEY); // comment: read storage
    if (!raw) return []; // comment: no data -> empty
    const parsed = JSON.parse(raw); // comment: parse JSON
    if (!Array.isArray(parsed)) return []; // comment: validate array
    return parsed as UserRow[]; // comment: return typed array
  } catch { // comment: parsing failed
    return []; // comment: fallback
  } // comment: end try/catch
}; // comment: end loadRows

const saveRows = (rows: UserRow[]): void => { // comment: save rows to local storage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows)); // comment: stringify and store
}; // comment: end saveRows

const generateId = (): string => { // comment: generate id with fallback
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) { // comment: check support
    return crypto.randomUUID(); // comment: generate uuid
  } // comment: end if
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`; // comment: fallback id
}; // comment: end generateId

const validate = (form: FormState): ErrorsState => { // comment: validate fields and return errors
  const errors: ErrorsState = {}; // comment: init empty errors

  if (!form.fullName.trim()) errors.fullName = "Full name is required"; // comment: required name
  else if (form.fullName.trim().length > 40) errors.fullName = "Max 40 characters"; // comment: length limit

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()); // comment: basic email regex
  if (!form.email.trim()) errors.email = "Email is required"; // comment: required email
  else if (!emailOk) errors.email = "Email format is invalid"; // comment: invalid email

  const phoneOk = /^[0-9]{9,10}$/.test(form.phone.trim()); // comment: 9-10 digits
  if (!form.phone.trim()) errors.phone = "Phone is required"; // comment: required phone
  else if (!phoneOk) errors.phone = "Phone must be 9-10 digits"; // comment: invalid phone

  const ageNum = Number(form.age); // comment: convert to number
  const ageOk = Number.isFinite(ageNum) && ageNum >= 12 && ageNum <= 120; // comment: range check
  if (!form.age.trim()) errors.age = "Age is required"; // comment: required age
  else if (!ageOk) errors.age = "Age must be between 12 and 120"; // comment: invalid age

  if (!form.city.trim()) errors.city = "City is required"; // comment: required city

  return errors; // comment: return errors object
}; // comment: end validate

type Props = { // comment: component props
  onSaved?: () => void; // comment: optional callback after save
}; // comment: end props

const UserForm: React.FC<Props> = ({ onSaved }) => { // comment: user form component
  const [form, setForm] = useState<FormState>(() => createEmptyForm()); // comment: form state
  const [errors, setErrors] = useState<ErrorsState>({}); // comment: errors state

  const isValid = useMemo(() => { // comment: compute if valid
    const e = validate(form); // comment: validate current form
    return Object.keys(e).length === 0; // comment: valid if no errors
  }, [form]); // comment: dependency

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => { // comment: single handler
    const { name, value } = e.target; // comment: read name + value
    setForm((prev) => ({ ...prev, [name]: value })); // comment: update field
    setErrors((prev) => ({ ...prev, [name]: "" })); // comment: clear field error
  }; // comment: end handleChange

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => { // comment: submit handler
    e.preventDefault(); // comment: prevent reload
    const newErrors = validate(form); // comment: validate
    setErrors(newErrors); // comment: set errors
    if (Object.keys(newErrors).length > 0) return; // comment: stop if invalid

    const rows = loadRows(); // comment: load current rows
    const newRow: UserRow = { // comment: create row
      id: generateId(), // comment: safe id
      fullName: form.fullName.trim(), // comment: sanitize
      email: form.email.trim(), // comment: sanitize
      phone: form.phone.trim(), // comment: sanitize
      age: form.age.trim(), // comment: keep string
      city: form.city.trim(), // comment: sanitize
      createdAt: Date.now(), // comment: timestamp
    }; // comment: end row

    saveRows([newRow, ...rows]); // comment: save updated list
    setForm(createEmptyForm()); // comment: reset form
    if (onSaved) onSaved(); // comment: notify parent
  }; // comment: end submit

  return ( // comment: render
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}> {/* comment: wrapper */}
      <Typography variant="h5" sx={{ mb: 2 }}> {/* comment: title */}
        Forms - User Details
      </Typography>

      <Stack spacing={2}> {/* comment: spacing */}
        <TextField
          name="fullName" // comment: field name
          label="Full Name" // comment: label
          value={form.fullName} // comment: value
          onChange={handleChange} // comment: change handler
          error={Boolean(errors.fullName)} // comment: error flag
          helperText={errors.fullName || "Enter up to 40 characters"} // comment: helper
          fullWidth // comment: full width
          required // comment: show required *
        />

        <TextField
          name="email" // comment: field name
          label="Email" // comment: label
          value={form.email} // comment: value
          onChange={handleChange} // comment: change handler
          error={Boolean(errors.email)} // comment: error flag
          helperText={errors.email || "example@domain.com"} // comment: helper
          fullWidth // comment: full width
          required // comment: required
        />

        <TextField
          name="phone" // comment: field name
          label="Phone" // comment: label
          value={form.phone} // comment: value
          onChange={handleChange} // comment: change handler
          error={Boolean(errors.phone)} // comment: error flag
          helperText={errors.phone || "9-10 digits"} // comment: helper
          fullWidth // comment: full width
          required // comment: required
        />

        <TextField
          name="age" // comment: field name
          label="Age" // comment: label
          value={form.age} // comment: value
          onChange={handleChange} // comment: change handler
          error={Boolean(errors.age)} // comment: error flag
          helperText={errors.age || "12-120"} // comment: helper
          fullWidth // comment: full width
          required // comment: required
        />

        <TextField
          name="city" // comment: field name
          label="City" // comment: label
          value={form.city} // comment: value
          onChange={handleChange} // comment: change handler
          error={Boolean(errors.city)} // comment: error flag
          helperText={errors.city || "Your city"} // comment: helper
          fullWidth // comment: full width
          required // comment: required
        />

        <Button type="submit" variant="contained" disabled={!isValid}> {/* comment: submit */}
          Save to Local Storage
        </Button>
      </Stack>
    </Box>
  );
};

export default UserForm; // comment: export
