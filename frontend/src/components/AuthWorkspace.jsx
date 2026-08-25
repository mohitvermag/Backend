import { useEffect, useMemo, useState } from "react";
import { AtSign, BadgeCheck, Eye, EyeOff, KeyRound, Mail, Phone, Shield, UserRound } from "lucide-react";

const modes = [
  { id: "login", label: "Login" },
  { id: "register", label: "Register" },
];

const roles = [
  { id: "user", label: "User", description: "Customer or normal account access" },
  { id: "admin", label: "Admin", description: "Dashboard and protected admin APIs" },
];

function Field({ icon: Icon, label, ...props }) {
  return (
    <label className="auth-field">
      <span>{label}</span>
      <div className="auth-input-wrap">
        <Icon size={17} />
        <input {...props} />
      </div>
    </label>
  );
}

function PasswordField({ label, value, onChange, placeholder = "Enter password" }) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="auth-field">
      <span>{label}</span>
      <div className="auth-input-wrap">
        <KeyRound size={17} />
        <input type={visible ? "text" : "password"} value={value} onChange={onChange} placeholder={placeholder} />
        <button type="button" className="auth-eye" onClick={() => setVisible((current) => !current)} aria-label={visible ? "Hide password" : "Show password"}>
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </label>
  );
}

function RoleSelector({ role, onRoleChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {roles.map((item) => (
        <button key={item.id} type="button" onClick={() => onRoleChange(item.id)} className={`role-option ${role === item.id ? "role-option-active" : ""}`}>
          <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            {item.id === "admin" ? <Shield size={18} /> : <UserRound size={18} />}
          </div>
          <div className="min-w-0 text-left">
            <p>{item.label}</p>
            <span>{item.description}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

export default function AuthWorkspace({ initialMode = "login", onAuthenticated }) {
  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState("user");
  const [otpSent, setOtpSent] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    identifier: "",
    otp: "",
    newPassword: "",
  });

  useEffect(() => {
    setMode(initialMode);
    setOtpSent(false);
  }, [initialMode]);

  const selectedRoleLabel = useMemo(() => roles.find((item) => item.id === role)?.label || "User", [role]);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const finishAuth = () => {
    onAuthenticated?.({
      role,
      roleLabel: selectedRoleLabel,
      name: form.username || form.identifier || form.email || selectedRoleLabel,
      email: form.email,
      mobile: form.mobile,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (mode === "reset" && !otpSent) {
      setOtpSent(true);
      return;
    }

    if (mode === "login" || mode === "register" || (mode === "reset" && otpSent)) {
      finishAuth();
    }
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setOtpSent(false);
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border-b border-slate-200 p-5 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            <BadgeCheck size={17} /> Auth practice module
          </div>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">Role based authentication UI</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Is form ko tum baad mein register, login, OTP send, OTP verify aur password update APIs ke saath connect kar sakte ho.
          </p>
          <div className="mt-5 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3 text-sm"><span className="text-slate-500">Selected role</span><strong className="text-slate-950">{selectedRoleLabel}</strong></div>
            <div className="flex items-center justify-between gap-3 text-sm"><span className="text-slate-500">Login identifier</span><strong className="text-slate-950">Email or username</strong></div>
            <div className="flex items-center justify-between gap-3 text-sm"><span className="text-slate-500">Reset channel</span><strong className="text-slate-950">Email or mobile OTP</strong></div>
          </div>
        </div>

        <div className="p-5">
          <div className="auth-mode-switch">
            {modes.map((item) => (
              <button key={item.id} type="button" onClick={() => switchMode(item.id)} className={mode === item.id ? "auth-mode-active" : ""}>{item.label}</button>
            ))}
          </div>

          <form className="mt-5 space-y-5" onSubmit={handleSubmit}>
            <RoleSelector role={role} onRoleChange={setRole} />

            {mode === "register" && (
              <div className="grid gap-4 md:grid-cols-2">
                <Field icon={UserRound} label="Username" value={form.username} onChange={updateField("username")} placeholder="mohit_admin" />
                <Field icon={Mail} label="Email" type="email" value={form.email} onChange={updateField("email")} placeholder="mohit@example.com" />
                <Field icon={Phone} label="Mobile number" type="tel" value={form.mobile} onChange={updateField("mobile")} placeholder="9876543210" />
                <PasswordField label="Password" value={form.password} onChange={updateField("password")} />
                <div className="md:col-span-2">
                  <PasswordField label="Confirm password" value={form.confirmPassword} onChange={updateField("confirmPassword")} placeholder="Confirm password" />
                </div>
              </div>
            )}

            {mode === "login" && (
              <div className="grid gap-4">
                <Field icon={AtSign} label="Email or mobile number" value={form.identifier} onChange={updateField("identifier")} placeholder="email@example.com or 9876543210" />
                <PasswordField label="Password" value={form.password} onChange={updateField("password")} />
              </div>
            )}

            {mode === "reset" && (
              <div className="grid gap-4">
                <Field icon={AtSign} label="Email or mobile number" value={form.identifier} onChange={updateField("identifier")} placeholder="email@example.com or 9876543210" />
                {otpSent && (
                  <>
                    <Field icon={KeyRound} label="OTP" value={form.otp} onChange={updateField("otp")} placeholder="6 digit OTP" inputMode="numeric" />
                    <PasswordField label="New password" value={form.newPassword} onChange={updateField("newPassword")} placeholder="Create new password" />
                    <PasswordField label="Confirm new password" value={form.confirmPassword} onChange={updateField("confirmPassword")} placeholder="Confirm new password" />
                  </>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button type="submit" className="primary-button w-full sm:w-auto">
                {mode === "login" && `Login as ${selectedRoleLabel}`}
                {mode === "register" && `Create ${selectedRoleLabel} Account`}
                {mode === "reset" && (otpSent ? "Update Password" : "Get OTP")}
              </button>
              {mode === "login" && (
                <button type="button" className="secondary-button w-full sm:w-auto" onClick={() => switchMode("reset")}>Reset password</button>
              )}
              {mode === "reset" && otpSent && (
                <button type="button" className="secondary-button w-full sm:w-auto" onClick={() => setOtpSent(false)}>Change email/mobile</button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
