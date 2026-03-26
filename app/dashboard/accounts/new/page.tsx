import { NewAccountForm } from './NewAccountForm';

export default function NewAccountPage() {
  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">New opportunity</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Add a company from your pipeline. Attach documents so the tools have the right context.
        </p>
      </div>
      <NewAccountForm />
    </div>
  );
}
