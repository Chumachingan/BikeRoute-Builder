type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input(props: InputProps) {
  return (
    <input
      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/40"
      {...props}
    />
  );
}
