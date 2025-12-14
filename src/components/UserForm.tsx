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

const STORAGE_KEY = "forms_users_v1"; // comment: local storage key

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

const validate = (form: FormState): ErrorsState => { // comment: validate fields and return errors
  const errors: ErrorsState = {}; // comment: init empty errors

  if (!form.fullName.trim()) errors.fullName = "Full name is required"; // comment: required name
  if (form.fullName.trim().length > 40) errors.fullName = "Max 40 characters"; // comment: length limit

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()); // comment: basic email regex
  if (!form.email.trim()) errors.email = "Email is required"; // comment: required email
  else if (!emailOk) errors.email = "Email format is invalid"; // comment: invalid email

  const phoneOk = /^[0-9]{9,10}$/.test(form.phone.trim()); // comment: israel-ish 9-10 digits
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
  const [form, setForm] = useState<FormState>(() => createEmptyForm()); // comment: single form state
  const [errors, setErrors] = useState<ErrorsState>({}); // comment: errors state

  const isValid = useMemo(() => { // comment: compute if form is valid
    const e = validate(form); // comment: validate current form
    return Object.keys(e).length === 0; // comment: valid if no errors
  }, [form]); // comment: recompute when form changes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => { // comment: one handler for all fields
    const { name, value } = e.target; // comment: read field name and value
    setForm((prev) => ({ ...prev, [name]: value })); // comment: update specific field by name
    setErrors((prev) => ({ ...prev, [name]: "" })); // comment: clear this field error on edit
  }; // comment: end handleChange

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => { // comment: submit handler
    e.preventDefault(); // comment: prevent page reload
    const newErrors = validate(form); // comment: validate before save
    setErrors(newErrors); // comment: set errors state
    if (Object.keys(newErrors).length > 0) return; // comment: stop if invalid

    const rows = loadRows(); // comment: read existing rows
    const newRow: UserRow = { // comment: create new row
      id: crypto.randomUUID(), // comment: unique id (modern browsers)
      fullName: form.fullName.trim(), // comment: sanitized name
      email: form.email.trim(), // comment: sanitized email
      phone: form.phone.trim(), // comment: sanitized phone
      age: form.age.trim(), // comment: age kept as string
      city: form.city.trim(), // comment: sanitized city
      createdAt: Date.now(), // comment: timestamp
    }; // comment: end new row

    const updated = [newRow, ...rows]; // comment: add row to start
    saveRows(updated); // comment: save back to storage
    setForm(createEmptyForm()); // comment: reset form
    if (onSaved) onSaved(); // comment: notify parent
  }; // comment: end submit

  return ( // comment: render UI
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}> {/* comment: form wrapper */}
      <Typography variant="h5" sx={{ mb: 2 }}> {/* comment: title */}
        Forms - User Details
      </Typography>

      <Stack spacing={2}> {/* comment: vertical spacing */}
        <TextField
          name="fullName" // comment: name used by handleChange
          label="Full Name" // comment: UI label
          value={form.fullName} // comment: controlled value
          onChange={handleChange} // comment: one handler
          error={Boolean(errors.fullName)} // comment: MUI error flag
          helperText={errors.fullName || "Enter up to 40 characters"} // comment: message under input
          fullWidth // comment: stretch
        />

        <TextField
          name="email" // comment: field name
          label="Email" // comment: label
          value={form.email} // comment: controlled value
          onChange={handleChange} // comment: handler
          error={Boolean(errors.email)} // comment: error flag
          helperText={errors.email || "example@domain.com"} // comment: helper
          fullWidth // comment: full width
        />

        <TextField
          name="phone" // comment: field name
          label="Phone" // comment: label
          value={form.phone} // comment: controlled value
          onChange={handleChange} // comment: handler
          error={Boolean(errors.phone)} // comment: error flag
          helperText={errors.phone || "9-10 digits"} // comment: helper
          fullWidth // comment: full width
        />

        <TextField
          name="age" // comment: field name
          label="Age" // comment: label
          value={form.age} // comment: controlled value
          onChange={handleChange} // comment: handler
          error={Boolean(errors.age)} // comment: error flag
          helperText={errors.age || "12-120"} // comment: helper
          fullWidth // comment: full width
        />

        <TextField
          name="city" // comment: field name
          label="City" // comment: label
          value={form.city} // comment: controlled value
          onChange={handleChange} // comment: handler
          error={Boolean(errors.city)} // comment: error flag
          helperText={errors.city || "Your city"} // comment: helper
          fullWidth // comment: full width
        />

        <Button type="submit" variant="contained" disabled={!isValid}> {/* comment: submit button */}
          Save to Local Storage
        </Button>
      </Stack>
    </Box> // comment: end wrapper
  ); // comment: end return
}; // comment: end component

export default UserForm; // comment: export
export { STORAGE_KEY }; // comment: export key so table can use it
