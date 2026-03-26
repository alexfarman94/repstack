import { NewAccountForm } from './NewAccountForm';

export default function NewAccountPage() {
  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">New account</h1>
        <p className="text-stone-400 mt-1 text-sm">
          Add a company from your pipeline. You can attach documents once the account is created.
        </p>
      </div>
      <NewAccountForm />
    </div>
  );
}
