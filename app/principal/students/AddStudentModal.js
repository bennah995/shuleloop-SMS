'use client';

import { useState } from 'react';
import { upload } from '@vercel/blob/client';

const RELATIONSHIPS = [
  { value: 'mother', label: 'Mother' },
  { value: 'father', label: 'Father' },
  { value: 'guardian', label: 'Guardian' },
  { value: 'other', label: 'Other' },
];

const emptyParent = () => ({
  firstName: '',
  middleName: '',
  lastName: '',
  phone: '',
  email: '',
  nationalId: '',
  relationship: '',
});

// classes: [{ id, name }]
// onClose: () => void
// onSuccess: (student) => void
export default function AddStudentModal({ classes, onClose, onSuccess }) {
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [parent1, setParent1] = useState(emptyParent());
  const [hasSecondParent, setHasSecondParent] = useState(false);
  const [parent2, setParent2] = useState(emptyParent());

  const [studentFirstName, setStudentFirstName] = useState('');
  const [studentMiddleName, setStudentMiddleName] = useState('');
  const [studentLastName, setStudentLastName] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');
  const [classId, setClassId] = useState('');

  // Each: { url, fileName, uploading, error }
  const [passportPhoto, setPassportPhoto] = useState(null);
  const [kcpeCertificate, setKcpeCertificate] = useState(null);
  const [leavingCertificate, setLeavingCertificate] = useState(null);

  async function handleFileUpload(file, setState) {
    setState({ fileName: file.name, uploading: true, error: null, url: null });
    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/principal/upload',
      });
      setState({ fileName: file.name, uploading: false, error: null, url: blob.url });
    } catch (err) {
      console.error('File upload error:', err);
      setState({ fileName: file.name, uploading: false, error: 'Upload failed — try again', url: null });
    }
  }

  function validate() {
    if (!parent1.firstName.trim() || !parent1.lastName.trim() || !parent1.phone.trim() || !parent1.relationship) {
      return 'Parent 1: first name, last name, phone, and relationship are required.';
    }
    if (
      hasSecondParent &&
      (!parent2.firstName.trim() || !parent2.lastName.trim() || !parent2.phone.trim() || !parent2.relationship)
    ) {
      return 'Parent 2: first name, last name, phone, and relationship are required (or turn off "Add second parent").';
    }
    if (!studentFirstName.trim() || !studentLastName.trim()) {
      return "Student's first and last name are required.";
    }
    if (!classId) return 'Please assign a class.';
    if (!passportPhoto?.url) return 'Passport photo is required.';
    if (kcpeCertificate?.uploading || leavingCertificate?.uploading || passportPhoto?.uploading) {
      return 'Please wait for uploads to finish.';
    }
    return '';
  }

  async function handleSubmit() {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setSaving(true);

    const parents = [parent1];
    if (hasSecondParent) parents.push(parent2);

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: studentFirstName.trim(),
          middleName: studentMiddleName.trim() || null,
          lastName: studentLastName.trim(),
          classId,
          medicalConditions: medicalConditions.trim() || null,
          passportPhotoUrl: passportPhoto.url,
          kcpeCertificateUrl: kcpeCertificate?.url || null,
          leavingCertificateUrl: leavingCertificate?.url || null,
          parents,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to add student.');
        setSaving(false);
        return;
      }
      onSuccess?.(data.student);
      onClose();
    } catch (err) {
      console.error('Add student error:', err);
      setError('Something went wrong. Please try again.');
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-[#1E293B]">Add New Student</h2>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-[#1E293B] text-xl leading-none" aria-label="Close">
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6">
          {error && (
            <div className="px-3 py-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
              {error}
            </div>
          )}

          {/* Section: Parents Info */}
          <section className="border border-[#E2E8F0] rounded-lg p-5">
            <h3 className="text-sm font-semibold text-[#1A3C5E] uppercase tracking-wide mb-4">Parents Info</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ParentFields label="Parent / Guardian 1 (required)" value={parent1} onChange={setParent1} />

              {!hasSecondParent ? (
                <div className="flex items-center justify-center border border-dashed border-[#CBD5E1] rounded-lg">
                  <button
                    type="button"
                    onClick={() => setHasSecondParent(true)}
                    className="text-sm text-[#1A3C5E] font-medium hover:underline px-4 py-8"
                  >
                    + Add second parent
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[#1E293B]">Parent / Guardian 2</span>
                    <button
                      type="button"
                      onClick={() => {
                        setHasSecondParent(false);
                        setParent2(emptyParent());
                      }}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  <ParentFields label={null} value={parent2} onChange={setParent2} />
                </div>
              )}
            </div>
          </section>

          {/* Section: Student Info */}
          <section className="border border-[#E2E8F0] rounded-lg p-5">
            <h3 className="text-sm font-semibold text-[#1A3C5E] uppercase tracking-wide mb-4">Student Info</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <Field label="First Name" required>
                <input
                  type="text"
                  value={studentFirstName}
                  onChange={(e) => setStudentFirstName(e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Middle Name">
                <input
                  type="text"
                  value={studentMiddleName}
                  onChange={(e) => setStudentMiddleName(e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Last Name" required>
                <input
                  type="text"
                  value={studentLastName}
                  onChange={(e) => setStudentLastName(e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Medical Conditions (optional)">
              <textarea
                value={medicalConditions}
                onChange={(e) => setMedicalConditions(e.target.value)}
                rows={2}
                className={inputClass}
                placeholder="Allergies, conditions, medication — anything staff should be aware of"
              />
            </Field>

            {/* Documents */}
            <div className="mt-5 pt-5 border-t border-[#F1F5F9]">
              <p className="text-xs font-semibold text-[#475569] uppercase tracking-wide mb-3">Admission Documents</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FileUploadField
                  label="Passport Photo"
                  required
                  accept="image/jpeg,image/png,image/webp"
                  state={passportPhoto}
                  onFile={(file) => handleFileUpload(file, setPassportPhoto)}
                />
                <FileUploadField
                  label="KCPE Certificate"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  state={kcpeCertificate}
                  onFile={(file) => handleFileUpload(file, setKcpeCertificate)}
                />
                <FileUploadField
                  label="School Leaving Certificate"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  state={leavingCertificate}
                  onFile={(file) => handleFileUpload(file, setLeavingCertificate)}
                />
              </div>
            </div>
          </section>

          {/* Section: Assign Class */}
          <section className="border border-[#E2E8F0] rounded-lg p-5 max-w-xs">
            <h3 className="text-sm font-semibold text-[#1A3C5E] uppercase tracking-wide mb-3">Assign Class</h3>
            <Field label="Class" required>
              <select value={classId} onChange={(e) => setClassId(e.target.value)} className={inputClass}>
                <option value="">Select a class...</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] flex justify-between sticky bottom-0 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#64748B] hover:text-[#1E293B]"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium bg-[#F0A500] text-white rounded-md hover:bg-[#d99400] disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Add Student'}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  'w-full px-3 py-2 border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3C5E] text-sm';

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-[#1E293B] mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

function ParentFields({ label, value, onChange }) {
  const update = (field) => (e) => onChange({ ...value, [field]: e.target.value });

  return (
    <div className="space-y-3">
      {label && <p className="text-sm font-medium text-[#1E293B]">{label}</p>}
      <div className="grid grid-cols-3 gap-2">
        <Field label="First" required>
          <input type="text" value={value.firstName} onChange={update('firstName')} className={inputClass} />
        </Field>
        <Field label="Middle">
          <input type="text" value={value.middleName} onChange={update('middleName')} className={inputClass} />
        </Field>
        <Field label="Last" required>
          <input type="text" value={value.lastName} onChange={update('lastName')} className={inputClass} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Relationship" required>
          <select value={value.relationship} onChange={update('relationship')} className={inputClass}>
            <option value="">Select...</option>
            {RELATIONSHIPS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Phone" required>
          <input type="tel" value={value.phone} onChange={update('phone')} placeholder="07xx xxx xxx" className={inputClass} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Email (optional)">
          <input type="email" value={value.email} onChange={update('email')} className={inputClass} />
        </Field>
        <Field label="National ID (optional)">
          <input type="text" value={value.nationalId} onChange={update('nationalId')} className={inputClass} />
        </Field>
      </div>
    </div>
  );
}

function FileUploadField({ label, required, accept, state, onFile }) {
  return (
    <div>
      <span className="block text-sm font-medium text-[#1E293B] mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </span>

      {state?.url && accept.includes('image') && (
        <img src={state.url} alt={label} className="w-16 h-16 object-cover rounded-md border border-[#CBD5E1] mb-2" />
      )}

      <input
        type="file"
        accept={accept}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
        }}
        className="w-full text-xs text-[#64748B] file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border file:border-[#CBD5E1] file:bg-white file:text-xs file:text-[#1A3C5E] hover:file:bg-[#F5F7FA]"
      />

      {state?.uploading && <p className="text-xs text-[#64748B] mt-1">Uploading {state.fileName}...</p>}
      {state?.error && <p className="text-xs text-red-600 mt-1">{state.error}</p>}
      {state?.url && !state.uploading && (
        <p className="text-xs text-green-700 mt-1">✓ {state.fileName}</p>
      )}
    </div>
  );
}