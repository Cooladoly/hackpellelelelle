import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { ArrowRight, Loader } from "lucide-react";
import { Link } from "../components/Link";
import { SwitchButton, SwitchLink } from "@/components/board/switch";
import { StepIndicator } from "@/components/watermelon/step-indicator";
import { PageHead } from "../components/PageHead";
import { Wordmark } from "../components/Wordmark";
import { useTitle } from "../components/useTitle";
import { submitRegistration } from "../lib/registration";
import { register } from "../data/site";

type Values = {
  firstName: string;
  lastName: string;
  email: string;
  school: string;
  grade: string;
  role: string;
  teamName: string;
  dietary: string;
  dietaryOther: string;
  tshirtSize: string;
  emergencyName: string;
  emergencyPhone: string;
};
type Errors = Partial<Record<keyof Values | "codeOfConduct", string>>;

const empty: Values = {
  firstName: "",
  lastName: "",
  email: "",
  school: "",
  grade: "",
  role: "",
  teamName: "",
  dietary: "",
  dietaryOther: "",
  tshirtSize: "",
  emergencyName: "",
  emergencyPhone: "",
};

const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

function validateStep1(v: Values): Errors {
  const e: Errors = {};
  if (!v.firstName.trim()) e.firstName = "First name is required";
  if (!v.lastName.trim()) e.lastName = "Last name is required";
  if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) e.email = "Invalid email address";
  if (!v.school.trim()) e.school = "School is required";
  if (!v.grade) e.grade = "Grade is required";
  if (!v.role) e.role = "Role is required";
  return e;
}

function validateStep2(v: Values, coc: boolean): Errors {
  const e: Errors = {};
  if (!v.tshirtSize) e.tshirtSize = "T-shirt size is required";
  if (!v.emergencyName.trim()) e.emergencyName = "Emergency contact name is required";
  if (v.emergencyPhone.trim().length < 10) e.emergencyPhone = "Valid phone number required";
  if (!coc) e.codeOfConduct = "You must accept the Code of Conduct";
  return e;
}

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && !error && <p className="t-meta">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function Register() {
  useTitle("Register");
  const [step, setStep] = useState<1 | 2>(1);
  const [v, setV] = useState<Values>(empty);
  const [coc, setCoc] = useState(false);
  const [photo, setPhoto] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [failed, setFailed] = useState(false);
  const [done, setDone] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  const set = (k: keyof Values) => (e: { target: { value: string } }) => {
    setV((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const focusFirstError = () =>
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());

  const isParticipant = v.role === "participant";
  const canBeOther = v.role === "mentor" || v.role === "volunteer";

  const next = () => {
    const e = validateStep1(v);
    setErrors(e);
    if (Object.keys(e).length) return focusFirstError();
    setStep(2);
  };

  useEffect(() => {
    if (step === 2) headingRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (done) {
      window.scrollTo(0, 0);
      doneRef.current?.focus();
    }
  }, [done]);

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (step === 1) return next();
    const e = validateStep2(v, coc);
    setErrors(e);
    if (Object.keys(e).length) return focusFirstError();

    setSubmitting(true);
    setFailed(false);
    try {
      await submitRegistration({
        firstName: v.firstName.trim(),
        lastName: v.lastName.trim(),
        email: v.email.trim(),
        school: v.school.trim(),
        grade: v.grade,
        role: v.role,
        teamName: isParticipant ? v.teamName.trim() : undefined,
        dietary: v.dietary === "other" ? v.dietaryOther.trim() : v.dietary,
        tshirtSize: v.tshirtSize,
        emergencyName: v.emergencyName.trim(),
        emergencyPhone: v.emergencyPhone.trim(),
        codeOfConduct: coc,
        photoRelease: photo,
      });
      setDone(true);
    } catch (err) {
      console.error(err);
      setFailed(true);
    } finally {
      setSubmitting(false);
    }
  };

  const inv = (k: keyof Errors) => ({
    "aria-invalid": errors[k] ? (true as const) : undefined,
    "aria-describedby": errors[k] ? `${k}-error` : undefined,
  });

  if (done) {
    return (
      <header className="wrap page-head min-h-[60vh]">
        <h1 ref={doneRef} tabIndex={-1} className="t-h1 outline-none">
          {register.successTitle}
        </h1>
        <p className="t-lede mt-6">{register.success}</p>
        <div className="mt-8">
          <SwitchLink to="/">Back to Home</SwitchLink>
        </div>
      </header>
    );
  }

  const steps = ["Personal Information", "Additional Details"];

  return (
    <>
      <PageHead
        title={
          <>
            register for <Wordmark />
          </>
        }
        lede={register.lede}
        note={register.note}
      />

      <div className="wrap split">
        {/* the two stages as an LED bar graph; the tag over it names the current stage, or the one being pointed at */}
        <StepIndicator
          steps={steps}
          current={step}
          label="Registration progress"
          onSelect={(n) => {
            if (submitting) return;
            if (n === 1) setStep(1);
            else if (step === 1) next();
          }}
          className="self-start lg:sticky lg:top-28"
        />

        <form ref={formRef} onSubmit={onSubmit} noValidate>
          {step === 1 && (
            <div className="grid gap-6">
              <h2 className="t-h2">{steps[0]}</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field id="firstName" label="First Name *" error={errors.firstName}>
                  <input id="firstName" className="input" autoComplete="given-name" value={v.firstName} onChange={set("firstName")} {...inv("firstName")} />
                </Field>
                <Field id="lastName" label="Last Name *" error={errors.lastName}>
                  <input id="lastName" className="input" autoComplete="family-name" value={v.lastName} onChange={set("lastName")} {...inv("lastName")} />
                </Field>
              </div>
              <Field id="email" label="Email *" error={errors.email}>
                <input id="email" type="email" className="input" autoComplete="email" value={v.email} onChange={set("email")} {...inv("email")} />
              </Field>
              <Field id="school" label="School *" error={errors.school}>
                <input id="school" className="input" autoComplete="organization" value={v.school} onChange={set("school")} {...inv("school")} />
              </Field>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field id="grade" label="Grade *" error={errors.grade} hint={isParticipant ? register.roleNote : undefined}>
                  <select id="grade" className="input" value={v.grade} onChange={set("grade")} {...inv("grade")}>
                    <option value="">Select grade</option>
                    {[9, 10, 11, 12].map((g) => (
                      <option key={g} value={g}>
                        Grade {g}
                      </option>
                    ))}
                    {canBeOther && <option value="other">Other</option>}
                  </select>
                </Field>
                <Field id="role" label="Role *" error={errors.role}>
                  <select id="role" className="input" value={v.role} onChange={set("role")} {...inv("role")}>
                    <option value="">Select role</option>
                    <option value="participant">Participant</option>
                    <option value="mentor">Mentor</option>
                    <option value="volunteer">Volunteer</option>
                  </select>
                </Field>
              </div>
              <div>
                <SwitchButton type="button" onClick={next} className="w-full sm:w-auto">
                  Continue
                  <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
                </SwitchButton>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-6">
              <h2 ref={headingRef} tabIndex={-1} className="t-h2 outline-none">
                {steps[1]}
              </h2>
              {isParticipant && (
                <Field id="teamName" label="Team Name (Optional)">
                  <input id="teamName" className="input" placeholder="Leave blank if you don't have a team yet" value={v.teamName} onChange={set("teamName")} />
                </Field>
              )}
              <Field id="dietary" label="Dietary Restrictions (Optional)">
                <select id="dietary" className="input" value={v.dietary} onChange={set("dietary")}>
                  <option value="">Select dietary restrictions</option>
                  {register.dietary.map((d) => (
                    <option key={d} value={slug(d)}>
                      {d}
                    </option>
                  ))}
                </select>
              </Field>
              {v.dietary === "other" && (
                <Field id="dietaryOther" label="Please specify your dietary restrictions">
                  <input id="dietaryOther" className="input" value={v.dietaryOther} onChange={set("dietaryOther")} />
                </Field>
              )}
              <Field id="tshirtSize" label="T-Shirt Size *" error={errors.tshirtSize}>
                <select id="tshirtSize" className="input" value={v.tshirtSize} onChange={set("tshirtSize")} {...inv("tshirtSize")}>
                  <option value="">Select size</option>
                  {register.sizes.map((s) => (
                    <option key={s} value={s.toLowerCase()}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field id="emergencyName" label="Emergency Contact Name *" error={errors.emergencyName}>
                  <input id="emergencyName" className="input" autoComplete="off" value={v.emergencyName} onChange={set("emergencyName")} {...inv("emergencyName")} />
                </Field>
                <Field id="emergencyPhone" label="Emergency Contact Phone *" error={errors.emergencyPhone}>
                  <input id="emergencyPhone" type="tel" inputMode="tel" className="input" autoComplete="off" value={v.emergencyPhone} onChange={set("emergencyPhone")} {...inv("emergencyPhone")} />
                </Field>
              </div>

              <div className="grid gap-4 border-t border-line pt-6">
                <div>
                  <label className="check" htmlFor="codeOfConduct">
                    <input
                      id="codeOfConduct"
                      type="checkbox"
                      checked={coc}
                      onChange={(e) => {
                        setCoc(e.target.checked);
                        if (e.target.checked) setErrors((p) => ({ ...p, codeOfConduct: undefined }));
                      }}
                      aria-invalid={errors.codeOfConduct ? true : undefined}
                      aria-describedby={errors.codeOfConduct ? "codeOfConduct-error" : undefined}
                    />
                    <span>
                      I agree to follow the{" "}
                      <Link to="/code-of-conduct" target="_blank" className="link">
                        Code of Conduct
                      </Link>{" "}
                      *
                    </span>
                  </label>
                  {errors.codeOfConduct && (
                    <p id="codeOfConduct-error" className="field-error mt-2">
                      {errors.codeOfConduct}
                    </p>
                  )}
                </div>
                <label className="check" htmlFor="photoRelease">
                  <input id="photoRelease" type="checkbox" checked={photo} onChange={(e) => setPhoto(e.target.checked)} />
                  <span>I consent to photos/videos being taken during the event for promotional purposes</span>
                </label>
              </div>

              {failed && (
                <div role="alert" className="border border-danger p-4">
                  <p className="font-semibold">{register.failTitle}</p>
                  <p className="t-body mt-1">{register.fail}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => !submitting && setStep(1)} disabled={submitting} className="btn btn-secondary">
                  Back
                </button>
                <SwitchButton type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader size={18} strokeWidth={2} className="animate-spin" aria-hidden="true" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Registration"
                  )}
                </SwitchButton>
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  );
}
